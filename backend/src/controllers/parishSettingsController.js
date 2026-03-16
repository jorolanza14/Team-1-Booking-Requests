const {
  Parish,
  ParishSlotSetting,
  BlackoutDate,
  User,
  BaptismBooking,
  WeddingBooking,
  ConfirmationBooking,
  EucharistBooking,
  ReconciliationBooking,
  AnointingSickBooking,
  FuneralMassBooking,
  MassIntention,
  sequelize,
} = require('../models');
const { Op } = require('sequelize');

// Get parish slot settings
exports.getParishSlotSettings = async (req, res) => {
  try {
    const { parishId } = req.params;

    const settings = await ParishSlotSetting.findAll({
      where: { parishId },
      order: [['serviceType', 'ASC']],
    });

    res.json({ settings });
  } catch (error) {
    console.error('Error fetching parish slot settings:', error);
    res.status(500).json({ error: 'Failed to fetch parish slot settings' });
  }
};

// Create or update parish slot setting
exports.upsertParishSlotSetting = async (req, res) => {
  try {
    const { parishId } = req.params;
    const {
      serviceType,
      dailyLimit,
      weeklyLimit,
      timeSlots = [],
      cutoffTime,
      minAdvanceDays = 1,
      maxAdvanceDays = 90,
      isActive = true,
    } = req.body;

    // Validate service type
    const validServiceTypes = [
      'baptism',
      'wedding',
      'confirmation',
      'eucharist',
      'reconciliation',
      'anointing_sick',
      'funeral_mass',
      'mass_intention',
    ];

    if (!validServiceTypes.includes(serviceType)) {
      return res.status(400).json({ error: 'Invalid service type' });
    }

    // Validate time slots format
    if (timeSlots.length > 0) {
      const isValidSlots = timeSlots.every(
        (slot) => slot.start && slot.end && (!slot.capacity || typeof slot.capacity === 'number')
      );
      if (!isValidSlots) {
        return res.status(400).json({
          error: 'Invalid time slots format. Each slot must have start, end, and optional capacity',
        });
      }
    }

    // Find existing or create new
    let setting = await ParishSlotSetting.findOne({
      where: { parishId, serviceType },
    });

    if (setting) {
      await setting.update({
        dailyLimit,
        weeklyLimit,
        timeSlots,
        cutoffTime,
        minAdvanceDays,
        maxAdvanceDays,
        isActive,
      });
    } else {
      setting = await ParishSlotSetting.create({
        parishId,
        serviceType,
        dailyLimit,
        weeklyLimit,
        timeSlots,
        cutoffTime,
        minAdvanceDays,
        maxAdvanceDays,
        isActive,
      });
    }

    res.json({
      message: 'Parish slot setting saved successfully',
      setting,
    });
  } catch (error) {
    console.error('Error saving parish slot setting:', error);
    res.status(500).json({ error: 'Failed to save parish slot setting' });
  }
};

// Delete parish slot setting
exports.deleteParishSlotSetting = async (req, res) => {
  try {
    const { parishId, serviceType } = req.params;

    const setting = await ParishSlotSetting.findOne({
      where: { parishId, serviceType },
    });

    if (!setting) {
      return res.status(404).json({ error: 'Setting not found' });
    }

    await setting.destroy();

    res.json({ message: 'Parish slot setting deleted successfully' });
  } catch (error) {
    console.error('Error deleting parish slot setting:', error);
    res.status(500).json({ error: 'Failed to delete parish slot setting' });
  }
};

// Get blackout dates
exports.getBlackoutDates = async (req, res) => {
  try {
    const { parishId } = req.params;
    const { serviceType, startDate, endDate } = req.query;

    const where = { parishId };

    if (serviceType) where.serviceType = serviceType;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date[Op.gte] = startDate;
      if (endDate) where.date[Op.lte] = endDate;
    }

    const blackoutDates = await BlackoutDate.findAll({
      where,
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
      order: [['date', 'ASC']],
    });

    res.json({ blackoutDates });
  } catch (error) {
    console.error('Error fetching blackout dates:', error);
    res.status(500).json({ error: 'Failed to fetch blackout dates' });
  }
};

// Create blackout date
exports.createBlackoutDate = async (req, res) => {
  try {
    const { parishId } = req.params;
    const {
      date,
      serviceType,
      reason,
      isRecurring = false,
      recurrencePattern,
    } = req.body;

    // Validate service type if provided
    const validServiceTypes = [
      'baptism',
      'wedding',
      'confirmation',
      'eucharist',
      'reconciliation',
      'anointing_sick',
      'funeral_mass',
      'mass_intention',
      null,
    ];

    if (serviceType && !validServiceTypes.includes(serviceType)) {
      return res.status(400).json({ error: 'Invalid service type' });
    }

    // Validate recurrence pattern
    if (isRecurring && !['yearly', 'monthly', 'weekly'].includes(recurrencePattern)) {
      return res.status(400).json({
        error: 'Invalid recurrence pattern. Must be yearly, monthly, or weekly',
      });
    }

    const blackoutDate = await BlackoutDate.create({
      parishId,
      date,
      serviceType: serviceType || null,
      reason,
      isRecurring,
      recurrencePattern: isRecurring ? recurrencePattern : null,
      createdBy: req.user.userId,
    });

    res.status(201).json({
      message: 'Blackout date created successfully',
      blackoutDate,
    });
  } catch (error) {
    console.error('Error creating blackout date:', error);
    res.status(500).json({ error: 'Failed to create blackout date' });
  }
};

// Update blackout date
exports.updateBlackoutDate = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const blackoutDate = await BlackoutDate.findByPk(id);
    if (!blackoutDate) {
      return res.status(404).json({ error: 'Blackout date not found' });
    }

    await blackoutDate.update(updateData);

    res.json({
      message: 'Blackout date updated successfully',
      blackoutDate,
    });
  } catch (error) {
    console.error('Error updating blackout date:', error);
    res.status(500).json({ error: 'Failed to update blackout date' });
  }
};

// Delete blackout date
exports.deleteBlackoutDate = async (req, res) => {
  try {
    const { id } = req.params;

    const blackoutDate = await BlackoutDate.findByPk(id);
    if (!blackoutDate) {
      return res.status(404).json({ error: 'Blackout date not found' });
    }

    await blackoutDate.destroy();

    res.json({ message: 'Blackout date deleted successfully' });
  } catch (error) {
    console.error('Error deleting blackout date:', error);
    res.status(500).json({ error: 'Failed to delete blackout date' });
  }
};

// Get parish booking statistics
exports.getParishBookingStats = async (req, res) => {
  try {
    const { parishId } = req.params;
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate || endDate) {
      if (startDate) dateFilter[Op.gte] = startDate;
      if (endDate) dateFilter[Op.lte] = endDate;
    }

    const stats = {};

    // Count bookings by type and status
    const baptismStats = await BaptismBooking.findAll({
      where: { parishId, preferredDate: dateFilter },
      attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['status'],
      raw: true,
    });

    const weddingStats = await WeddingBooking.findAll({
      where: { parishId, preferredDate: dateFilter },
      attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['status'],
      raw: true,
    });

    const confirmationStats = await ConfirmationBooking.findAll({
      where: { parishId, preferredDate: dateFilter },
      attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['status'],
      raw: true,
    });

    stats.baptisms = baptismStats;
    stats.weddings = weddingStats;
    stats.confirmations = confirmationStats;

    res.json({ stats });
  } catch (error) {
    console.error('Error fetching parish booking stats:', error);
    res.status(500).json({ error: 'Failed to fetch parish booking stats' });
  }
};

// Update parish settings (sacrament settings, booking settings)
exports.updateParishSettings = async (req, res) => {
  try {
    const { parishId } = req.params;
    const { sacramentSettings, bookingSettings } = req.body;

    const parish = await Parish.findByPk(parishId);
    if (!parish) {
      return res.status(404).json({ error: 'Parish not found' });
    }

    const updateData = {};
    if (sacramentSettings !== undefined) updateData.sacramentSettings = sacramentSettings;
    if (bookingSettings !== undefined) updateData.bookingSettings = bookingSettings;

    await parish.update(updateData);

    res.json({
      message: 'Parish settings updated successfully',
      parish,
    });
  } catch (error) {
    console.error('Error updating parish settings:', error);
    res.status(500).json({ error: 'Failed to update parish settings' });
  }
};

// Get parish configuration
exports.getParishConfiguration = async (req, res) => {
  try {
    const { parishId } = req.params;

    const parish = await Parish.findByPk(parishId, {
      attributes: [
        'id',
        'name',
        'sacramentSettings',
        'bookingSettings',
        'servicesOffered',
      ],
    });

    if (!parish) {
      return res.status(404).json({ error: 'Parish not found' });
    }

    const slotSettings = await ParishSlotSetting.findAll({
      where: { parishId, isActive: true },
      attributes: ['serviceType', 'dailyLimit', 'weeklyLimit', 'timeSlots', 'cutoffTime', 'minAdvanceDays', 'maxAdvanceDays'],
    });

    res.json({
      parish,
      slotSettings,
    });
  } catch (error) {
    console.error('Error fetching parish configuration:', error);
    res.status(500).json({ error: 'Failed to fetch parish configuration' });
  }
};
