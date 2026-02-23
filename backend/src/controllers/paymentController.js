const {
  Payment,
  BaptismBooking,
  WeddingBooking,
  ConfirmationBooking,
  EucharistBooking,
  ReconciliationBooking,
  AnointingSickBooking,
  FuneralMassBooking,
  MassIntention,
  Parish,
  User,
  sequelize,
} = require('../models');
const { Op } = require('sequelize');
const fs = require('fs');

// Mapping of booking types to models
const BOOKING_MODELS = {
  baptism: BaptismBooking,
  wedding: WeddingBooking,
  confirmation: ConfirmationBooking,
  eucharist: EucharistBooking,
  reconciliation: ReconciliationBooking,
  anointing_sick: AnointingSickBooking,
  funeral_mass: FuneralMassBooking,
  mass_intention: MassIntention,
};

// Create payment
exports.createPayment = async (req, res) => {
  try {
    const {
      bookingType,
      bookingId,
      amount = 0,
      donationAmount = 0,
      paymentMethod,
      notes,
    } = req.body;

    // Validate booking type
    if (!BOOKING_MODELS[bookingType]) {
      return res.status(400).json({ error: 'Invalid booking type' });
    }

    // Verify booking exists
    const booking = await BOOKING_MODELS[bookingType].findByPk(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Handle proof of payment upload
    let proofOfPaymentUrl = null;
    let proofOfPaymentPath = null;

    if (req.file) {
      proofOfPaymentPath = req.file.path;
      proofOfPaymentUrl = `/uploads/${req.file.filename}`;
    }

    const totalAmount = parseFloat(amount) + parseFloat(donationAmount || 0);

    const payment = await Payment.create({
      bookingType,
      bookingId,
      parishId: booking.parishId,
      userId: req.user.userId,
      amount,
      donationAmount,
      totalAmount,
      paymentMethod,
      status: proofOfPaymentUrl ? 'paid' : 'pending',
      proofOfPaymentUrl,
      proofOfPaymentPath,
      notes,
    });

    res.status(201).json({
      message: 'Payment created successfully',
      payment,
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ error: 'Failed to create payment' });
  }
};

// Get payments for a booking
exports.getBookingPayments = async (req, res) => {
  try {
    const { bookingType, bookingId } = req.params;

    if (!BOOKING_MODELS[bookingType]) {
      return res.status(400).json({ error: 'Invalid booking type' });
    }

    const payments = await Payment.findAll({
      where: { bookingType, bookingId },
      include: [
        {
          model: User,
          as: 'processor',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({ payments });
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
};

// Get all payments (with filters)
exports.getPayments = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      parishId,
      bookingType,
      startDate,
      endDate,
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    if (status) where.status = status;
    if (parishId) where.parishId = parseInt(parishId);
    if (bookingType) where.bookingType = bookingType;

    if (startDate || endDate) {
      where.paymentDate = {};
      if (startDate) where.paymentDate[Op.gte] = startDate;
      if (endDate) where.paymentDate[Op.lte] = endDate;
    }

    // Filter by user's parish if not admin
    if (req.user.role === 'parish_admin' || req.user.role === 'parish_staff') {
      const user = await User.findByPk(req.user.userId);
      if (user && user.assignedParishId) {
        where.parishId = user.assignedParishId;
      }
    }

    const { count, rows } = await Payment.findAndCountAll({
      where,
      include: [
        {
          model: Parish,
          as: 'parish',
          attributes: ['id', 'name'],
        },
        {
          model: User,
          as: 'processor',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
    });

    res.json({
      payments: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
};

// Get single payment
exports.getPayment = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findByPk(id, {
      include: [
        {
          model: Parish,
          as: 'parish',
          attributes: ['id', 'name'],
        },
        {
          model: User,
          as: 'processor',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json({ payment });
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({ error: 'Failed to fetch payment' });
  }
};

// Update payment (process payment)
exports.updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const payment = await Payment.findByPk(id);
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    // Handle proof of payment upload
    if (req.file) {
      // Delete old file if exists
      if (payment.proofOfPaymentPath && fs.existsSync(payment.proofOfPaymentPath)) {
        fs.unlinkSync(payment.proofOfPaymentPath);
      }

      payment.proofOfPaymentPath = req.file.path;
      payment.proofOfPaymentUrl = `/uploads/${req.file.filename}`;
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    // If status is being set to paid, record the processor and time
    if (status === 'paid') {
      updateData.processedBy = req.user.userId;
      updateData.paymentDate = new Date();
    }

    await payment.update(updateData);

    res.json({
      message: 'Payment updated successfully',
      payment,
    });
  } catch (error) {
    console.error('Error updating payment:', error);
    res.status(500).json({ error: 'Failed to update payment' });
  }
};

// Delete payment
exports.deletePayment = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findByPk(id);
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    // Delete proof of payment file if exists
    if (payment.proofOfPaymentPath && fs.existsSync(payment.proofOfPaymentPath)) {
      fs.unlinkSync(payment.proofOfPaymentPath);
    }

    await payment.destroy();

    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    console.error('Error deleting payment:', error);
    res.status(500).json({ error: 'Failed to delete payment' });
  }
};

// Get payment statistics
exports.getPaymentStats = async (req, res) => {
  try {
    const { parishId, startDate, endDate } = req.query;

    const where = {};
    if (parishId) where.parishId = parseInt(parishId);

    if (startDate || endDate) {
      where.paymentDate = {};
      if (startDate) where.paymentDate[Op.gte] = startDate;
      if (endDate) where.paymentDate[Op.lte] = endDate;
    }

    // Filter by user's parish if not admin
    if (req.user.role === 'parish_admin' || req.user.role === 'parish_staff') {
      const user = await User.findByPk(req.user.userId);
      if (user && user.assignedParishId) {
        where.parishId = user.assignedParishId;
      }
    }

    // Total amounts
    const totalStats = await Payment.findAll({
      where,
      attributes: [
        [sequelize.fn('SUM', sequelize.col('totalAmount')), 'totalAmount'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'baseAmount'],
        [sequelize.fn('SUM', sequelize.col('donationAmount')), 'donationAmount'],
      ],
      raw: true,
    });

    // By status
    const byStatus = await Payment.findAll({
      where,
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('totalAmount')), 'totalAmount'],
      ],
      group: ['status'],
      raw: true,
    });

    // By payment method
    const byMethod = await Payment.findAll({
      where,
      attributes: [
        'paymentMethod',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('totalAmount')), 'totalAmount'],
      ],
      group: ['paymentMethod'],
      raw: true,
    });

    res.json({
      stats: {
        totals: totalStats[0],
        byStatus,
        byMethod,
      },
    });
  } catch (error) {
    console.error('Error fetching payment stats:', error);
    res.status(500).json({ error: 'Failed to fetch payment stats' });
  }
};
