const {
  WeddingBooking,
  ConfirmationBooking,
  EucharistBooking,
  ReconciliationBooking,
  AnointingSickBooking,
  FuneralMassBooking,
  Godparent,
  BookingDocument,
  Parish,
  ParishSlotSetting,
  BlackoutDate,
  Payment,
  User,
} = require('../models');
const { Op } = require('sequelize');
const emailService = require('../services/emailService');

// Mapping of sacrament types to models and config
const SACRAMENT_CONFIG = {
  wedding: {
    model: WeddingBooking,
    serviceName: 'Wedding',
    emailTemplate: 'weddingConfirmation',
    allowsGodparents: true,
  },
  confirmation: {
    model: ConfirmationBooking,
    serviceName: 'Confirmation',
    emailTemplate: 'confirmationConfirmation',
    allowsGodparents: true,
  },
  eucharist: {
    model: EucharistBooking,
    serviceName: 'First Communion',
    emailTemplate: 'eucharistConfirmation',
    allowsGodparents: false,
  },
  reconciliation: {
    model: ReconciliationBooking,
    serviceName: 'Confession',
    emailTemplate: 'reconciliationConfirmation',
    allowsGodparents: false,
  },
  anointing_sick: {
    model: AnointingSickBooking,
    serviceName: 'Anointing of the Sick',
    emailTemplate: 'anointingSickConfirmation',
    allowsGodparents: false,
  },
  funeral_mass: {
    model: FuneralMassBooking,
    serviceName: 'Funeral Mass',
    emailTemplate: 'funeralMassConfirmation',
    allowsGodparents: false,
  },
};

// Helper function to check if date is within booking window
const checkBookingWindow = async (parishId, serviceType, preferredDate) => {
  const settings = await ParishSlotSetting.findOne({
    where: { parishId, serviceType, isActive: true },
  });

  if (!settings) return { valid: true };

  const today = new Date();
  const requestedDate = new Date(preferredDate);
  const minDate = new Date(today);
  minDate.setDate(minDate.getDate() + (settings.minAdvanceDays || 1));
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + (settings.maxAdvanceDays || 90));

  if (requestedDate < minDate) {
    return {
      valid: false,
      error: `Booking must be made at least ${settings.minAdvanceDays} days in advance`,
    };
  }

  if (requestedDate > maxDate) {
    return {
      valid: false,
      error: `Booking can only be made up to ${settings.maxAdvanceDays} days in advance`,
    };
  }

  return { valid: true };
};

// Helper function to check blackout dates
const checkBlackoutDates = async (parishId, serviceType, date) => {
  const blackoutDates = await BlackoutDate.findAll({
    where: {
      parishId,
      date,
      isActive: true,
      [Op.or]: [{ serviceType: null }, { serviceType }],
    },
  });

  if (blackoutDates.length > 0) {
    return {
      available: false,
      reason: blackoutDates[0].reason || 'Date is not available',
    };
  }

  return { available: true };
};

// Helper function to check daily limit
const checkDailyLimit = async (parishId, serviceType, date, Model) => {
  const settings = await ParishSlotSetting.findOne({
    where: { parishId, serviceType, isActive: true },
  });

  if (!settings || !settings.dailyLimit) return { withinLimit: true };

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const bookingCount = await Model.count({
    where: {
      parishId,
      preferredDate: {
        [Op.gte]: startOfDay,
        [Op.lte]: endOfDay,
      },
      status: { [Op.notIn]: ['declined', 'cancelled'] },
    },
  });

  if (bookingCount >= settings.dailyLimit) {
    return {
      withinLimit: false,
      error: `Daily limit of ${settings.dailyLimit} bookings has been reached`,
    };
  }

  return { withinLimit: true, remaining: settings.dailyLimit - bookingCount };
};

// Create Sacrament Booking (generic)
exports.createSacramentBooking = (sacramentType) => async (req, res) => {
  try {
    const config = SACRAMENT_CONFIG[sacramentType];
    if (!config) {
      return res.status(400).json({ error: 'Invalid sacrament type' });
    }

    const {
      parishId,
      preferredDate,
      preferredTimeSlot,
      preferredPriest,
      additionalNotes,
      godparents = [],
      ...bookingData
    } = req.body;

    // Validate parish exists
    const parish = await Parish.findByPk(parishId);
    if (!parish) {
      return res.status(404).json({ error: 'Parish not found' });
    }

    // Check booking window
    const windowCheck = await checkBookingWindow(parishId, sacramentType, preferredDate);
    if (!windowCheck.valid) {
      return res.status(400).json({ error: windowCheck.error });
    }

    // Check blackout dates
    const blackoutCheck = await checkBlackoutDates(parishId, sacramentType, preferredDate);
    if (!blackoutCheck.available) {
      return res.status(400).json({ error: blackoutCheck.reason });
    }

    // Check daily limit
    const limitCheck = await checkDailyLimit(parishId, sacramentType, preferredDate, config.model);
    if (!limitCheck.withinLimit) {
      return res.status(400).json({ error: limitCheck.error });
    }

    // Create booking
    const booking = await config.model.create({
      parishId,
      userId: req.user.userId,
      preferredDate,
      preferredTimeSlot,
      preferredPriest,
      additionalNotes,
      status: 'pending',
      ...bookingData,
    });

    // Add godparents if allowed
    if (config.allowsGodparents && godparents.length > 0) {
      const godparentRecords = godparents.map((gp) => ({
        bookingType: sacramentType,
        bookingId: booking.id,
        fullName: gp.fullName,
        contactEmail: gp.contactEmail,
        contactPhone: gp.contactPhone,
        address: gp.address,
        parishAffiliation: gp.parishAffiliation,
        confirmationCertificateNumber: gp.confirmationCertificateNumber,
        notes: gp.notes,
      }));
      await Godparent.bulkCreate(godparentRecords);
    }

    // Send confirmation email
    try {
      const contactEmail = bookingData.contactEmail || req.user.email;
      await emailService.sendNotification(
        contactEmail,
        `${config.serviceName} Booking Request Received`,
        `
          <h2>${config.serviceName} Booking Request Received</h2>
          <p>Dear Applicant,</p>
          <p>Your ${config.serviceName.toLowerCase()} booking request has been successfully submitted.</p>
          <p><strong>Booking Details:</strong></p>
          <ul>
            <li>Reference Number: ${booking.id}</li>
            <li>Preferred Date: ${new Date(preferredDate).toLocaleDateString()}</li>
            <li>Preferred Time Slot: ${preferredTimeSlot}</li>
            <li>Parish: ${parish.name}</li>
          </ul>
          <p>Your request is currently under review. We will notify you once it has been confirmed by our parish staff.</p>
          ${preferredPriest ? '<p><em>Note: Your preferred priest has been noted. Subject to availability. Parish will confirm.</em></p>' : ''}
          <br>
          <p>Best regards,<br>The Parish Team</p>
        `
      );
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
    }

    const responseNote = preferredPriest
      ? 'Preferred priest noted. Subject to availability. Parish will confirm.'
      : undefined;

    res.status(201).json({
      message: `${config.serviceName} booking request submitted successfully`,
      booking: {
        id: booking.id,
        preferredDate: booking.preferredDate,
        preferredTimeSlot: booking.preferredTimeSlot,
        status: booking.status,
        note: responseNote,
      },
    });
  } catch (error) {
    console.error(`Error creating ${sacramentType} booking:`, error);
    res.status(500).json({ error: `Failed to create ${sacramentType} booking` });
  }
};

// Get all Sacrament Bookings (generic)
exports.getSacramentBookings = (sacramentType) => async (req, res) => {
  try {
    const config = SACRAMENT_CONFIG[sacramentType];
    if (!config) {
      return res.status(400).json({ error: 'Invalid sacrament type' });
    }

    const { page = 1, limit = 10, status, parishId, startDate, endDate } = req.query;
    const offset = (page - 1) * limit;

    const where = {};

    if (status) where.status = status;
    if (parishId) where.parishId = parseInt(parishId);

    // Filter by user's parish if not admin
    if (req.user.role === 'parish_admin' || req.user.role === 'parish_staff') {
      const user = await User.findByPk(req.user.userId);
      if (user && user.assignedParishId) {
        where.parishId = user.assignedParishId;
      }
    }

    if (startDate || endDate) {
      where.preferredDate = {};
      if (startDate) where.preferredDate[Op.gte] = startDate;
      if (endDate) where.preferredDate[Op.lte] = endDate;
    }

    const includeOptions = [
      { model: Parish, as: 'parish', attributes: ['id', 'name', 'address'] },
    ];

    if (config.allowsGodparents) {
      includeOptions.push({
        model: Godparent,
        as: 'godparents',
        attributes: ['id', 'fullName', 'contactEmail', 'contactPhone'],
      });
    }

    includeOptions.push({
      model: BookingDocument,
      as: 'documents',
      attributes: ['id', 'documentType', 'fileName', 'fileUrl', 'isVerified'],
    });

    const { count, rows } = await config.model.findAndCountAll({
      where,
      include: includeOptions,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
    });

    res.json({
      bookings: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error(`Error fetching ${sacramentType} bookings:`, error);
    res.status(500).json({ error: `Failed to fetch ${sacramentType} bookings` });
  }
};

// Get single Sacrament Booking (generic)
exports.getSacramentBooking = (sacramentType) => async (req, res) => {
  try {
    const config = SACRAMENT_CONFIG[sacramentType];
    if (!config) {
      return res.status(400).json({ error: 'Invalid sacrament type' });
    }

    const { id } = req.params;

    const includeOptions = [
      { model: Parish, as: 'parish' },
      { model: BookingDocument, as: 'documents' },
      { model: Payment, as: 'payment' },
    ];

    if (config.allowsGodparents) {
      includeOptions.push({ model: Godparent, as: 'godparents' });
    }

    const booking = await config.model.findByPk(id, {
      include: includeOptions,
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ booking });
  } catch (error) {
    console.error(`Error fetching ${sacramentType} booking:`, error);
    res.status(500).json({ error: `Failed to fetch ${sacramentType} booking` });
  }
};

// Update Sacrament Booking (generic)
exports.updateSacramentBooking = (sacramentType) => async (req, res) => {
  try {
    const config = SACRAMENT_CONFIG[sacramentType];
    if (!config) {
      return res.status(400).json({ error: 'Invalid sacrament type' });
    }

    const { id } = req.params;
    const updateData = req.body;

    const booking = await config.model.findByPk(id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check permissions
    const isOwner = booking.userId === req.user.userId;
    const isAdmin = ['parish_admin', 'parish_staff', 'diocese_staff', 'diocese_admin'].includes(
      req.user.role
    );

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Not authorized to update this booking' });
    }

    // Admins can update status, users can only update notes
    if (!isAdmin) {
      delete updateData.status;
      delete updateData.preferredDate;
      delete updateData.preferredTimeSlot;
    }

    await booking.update(updateData);

    res.json({
      message: `${config.serviceName} booking updated successfully`,
      booking,
    });
  } catch (error) {
    console.error(`Error updating ${sacramentType} booking:`, error);
    res.status(500).json({ error: `Failed to update ${sacramentType} booking` });
  }
};

// Approve/Decline Sacrament Booking (generic - Admin only)
exports.approveSacramentBooking = (sacramentType) => async (req, res) => {
  try {
    const config = SACRAMENT_CONFIG[sacramentType];
    if (!config) {
      return res.status(400).json({ error: 'Invalid sacrament type' });
    }

    const { id } = req.params;
    const { status, adminNotes } = req.body;

    if (!['approved', 'declined'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be "approved" or "declined"' });
    }

    const booking = await config.model.findByPk(id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    await booking.update({
      status,
      adminNotes,
      approvedBy: req.user.userId,
      approvedAt: new Date(),
    });

    // Send email notification
    try {
      const user = await User.findByPk(booking.userId);
      const contactEmail = booking.contactEmail || user?.email;
      
      await emailService.sendNotification(
        contactEmail,
        `${config.serviceName} Booking ${status === 'approved' ? 'Approved' : 'Declined'}`,
        `
          <h2>${config.serviceName} Booking Update</h2>
          <p>Dear Applicant,</p>
          <p>Your ${config.serviceName.toLowerCase()} booking request has been ${status}.</p>
          ${adminNotes ? `<p><strong>Admin Notes:</strong> ${adminNotes}</p>` : ''}
          <p><strong>Booking Details:</strong></p>
          <ul>
            <li>Reference Number: ${booking.id}</li>
            <li>Status: ${status}</li>
          </ul>
          <br>
          <p>Best regards,<br>The Parish Team</p>
        `
      );
    } catch (emailError) {
      console.error('Failed to send status update email:', emailError);
    }

    res.json({
      message: `${config.serviceName} booking ${status} successfully`,
      booking,
    });
  } catch (error) {
    console.error(`Error approving ${sacramentType} booking:`, error);
    res.status(500).json({ error: 'Failed to process approval' });
  }
};

// Delete Sacrament Booking (generic)
exports.deleteSacramentBooking = (sacramentType) => async (req, res) => {
  try {
    const config = SACRAMENT_CONFIG[sacramentType];
    if (!config) {
      return res.status(400).json({ error: 'Invalid sacrament type' });
    }

    const { id } = req.params;

    const booking = await config.model.findByPk(id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check permissions
    const isOwner = booking.userId === req.user.userId;
    const isAdmin = ['parish_admin', 'parish_staff', 'diocese_staff', 'diocese_admin'].includes(
      req.user.role
    );

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Not authorized to delete this booking' });
    }

    // Soft delete by setting status to cancelled
    await booking.update({ status: 'cancelled' });

    res.json({ message: `${config.serviceName} booking cancelled successfully` });
  } catch (error) {
    console.error(`Error deleting ${sacramentType} booking:`, error);
    res.status(500).json({ error: `Failed to delete ${sacramentType} booking` });
  }
};

// Get available time slots (generic)
exports.getAvailableTimeSlots = (sacramentType) => async (req, res) => {
  try {
    const config = SACRAMENT_CONFIG[sacramentType];
    if (!config) {
      return res.status(400).json({ error: 'Invalid sacrament type' });
    }

    const { parishId, date } = req.query;

    if (!parishId || !date) {
      return res.status(400).json({ error: 'Parish ID and date are required' });
    }

    // Get slot settings
    const settings = await ParishSlotSetting.findOne({
      where: { parishId, serviceType: sacramentType, isActive: true },
    });

    // Check blackout dates
    const blackoutCheck = await checkBlackoutDates(parishId, sacramentType, date);
    if (!blackoutCheck.available) {
      return res.json({ timeSlots: [], blackoutReason: blackoutCheck.reason });
    }

    if (!settings || !settings.timeSlots) {
      // Return default time slots if none configured
      return res.json({
        timeSlots: [
          { start: '09:00', end: '10:00', available: true },
          { start: '10:00', end: '11:00', available: true },
          { start: '13:00', end: '14:00', available: true },
          { start: '14:00', end: '15:00', available: true },
        ],
      });
    }

    // Get bookings for this date
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const existingBookings = await config.model.findAll({
      where: {
        parishId,
        preferredDate: {
          [Op.gte]: startOfDay,
          [Op.lte]: endOfDay,
        },
        status: { [Op.notIn]: ['declined', 'cancelled'] },
      },
      attributes: ['preferredTimeSlot'],
    });

    const bookedSlots = new Set(existingBookings.map((b) => b.preferredTimeSlot));

    // Calculate availability for each time slot
    const availableSlots = settings.timeSlots.map((slot) => ({
      ...slot,
      available: !bookedSlots.has(slot.start) && (!slot.capacity || slot.capacity > bookedSlots.size),
    }));

    res.json({ timeSlots: availableSlots });
  } catch (error) {
    console.error(`Error fetching time slots for ${sacramentType}:`, error);
    res.status(500).json({ error: 'Failed to fetch available time slots' });
  }
};
