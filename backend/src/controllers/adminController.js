const { User, Parish, Booking, MassIntention, SystemConfiguration } = require('../models');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const { parishId } = req.query;
    const user = req.user;

    // Build where clause based on user role
    let parishWhereClause = {};
    let bookingWhereClause = {};
    let userWhereClause = {};

    if (user.role === 'parish_admin' || user.role === 'parish_staff') {
      if (user.assignedParishId) {
        parishWhereClause = { id: user.assignedParishId };
        bookingWhereClause = { parishId: user.assignedParishId };
        userWhereClause = { assignedParishId: user.assignedParishId };
      }
    }

    if (parishId && user.role === 'diocese_admin') {
      parishWhereClause = { id: parishId };
      bookingWhereClause = { parishId };
      userWhereClause = { assignedParishId: parishId };
    }

    // Get counts
    const totalParishes = await Parish.count({ where: parishWhereClause });
    const totalUsers = await User.count({ where: userWhereClause });
    const totalBookings = await Booking.count({ where: bookingWhereClause });
    const pendingBookings = await Booking.count({
      where: { ...bookingWhereClause, status: 'pending' },
    });
    const confirmedBookings = await Booking.count({
      where: { ...bookingWhereClause, status: 'confirmed' },
    });

    // Get recent bookings
    const recentBookings = await Booking.findAll({
      where: bookingWhereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
        {
          model: Parish,
          as: 'parish',
          attributes: ['id', 'name'],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: 10,
    });

    // Get bookings by status
    const bookingsByStatus = await Booking.findAll({
      where: bookingWhereClause,
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('Booking.id')), 'count'],
      ],
      group: ['status'],
      raw: true,
    });

    // Get bookings by type
    const bookingsByType = await Booking.findAll({
      where: bookingWhereClause,
      attributes: [
        'bookingType',
        [sequelize.fn('COUNT', sequelize.col('Booking.id')), 'count'],
      ],
      group: ['bookingType'],
      raw: true,
    });

    res.json({
      summary: {
        totalParishes,
        totalUsers,
        totalBookings,
        pendingBookings,
        confirmedBookings,
      },
      recentBookings,
      bookingsByStatus: bookingsByStatus.reduce((acc, item) => {
        acc[item.status] = parseInt(item.count);
        return acc;
      }, {}),
      bookingsByType: bookingsByType.reduce((acc, item) => {
        acc[item.bookingType] = parseInt(item.count);
        return acc;
      }, {}),
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({ error: 'Failed to get dashboard statistics' });
  }
};

// ==================== USER MANAGEMENT ====================

// Get all users (with filtering and pagination)
const getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      role,
      parishId,
      search,
      isActive,
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    if (role) whereClause.role = role;
    if (parishId) whereClause.assignedParishId = parishId;
    if (isActive !== undefined) whereClause.isActive = isActive === 'true';

    if (search) {
      whereClause[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { count, rows } = await User.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Parish,
          as: 'assignedParish',
          attributes: ['id', 'name'],
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
    });

    res.json({
      users: rows.map((user) => user.toSafeObject()),
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
};

// Get single user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      include: [
        {
          model: Parish,
          as: 'assignedParish',
          attributes: ['id', 'name'],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user.toSafeObject());
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
};

// Create new user
const createUser = async (req, res) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      role,
      assignedParishId,
    } = req.body;

    // Validate required fields
    if (!email || !firstName || !lastName || !role) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Email, firstName, lastName, and role are required',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      phone,
      role,
      assignedParishId,
    });

    res.status(201).json({
      message: 'User created successfully',
      user: user.toSafeObject(),
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      email,
      firstName,
      lastName,
      phone,
      role,
      assignedParishId,
      isActive,
    } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check email uniqueness if changing email
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }
    }

    await user.update({
      email: email || user.email,
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      phone: phone || user.phone,
      role: role || user.role,
      assignedParishId: assignedParishId !== undefined ? assignedParishId : user.assignedParishId,
      isActive: isActive !== undefined ? isActive : user.isActive,
    });

    res.json({
      message: 'User updated successfully',
      user: user.toSafeObject(),
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// Delete user (soft delete by deactivating)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.update({ isActive: false });

    res.json({ message: 'User deactivated successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

// ==================== PARISH MANAGEMENT ====================

// Get all parishes
const getAllParishes = async (req, res) => {
  try {
    const { page = 1, limit = 20, isActive, search } = req.query;
    const offset = (page - 1) * limit;
    const whereClause = {};

    if (isActive !== undefined) whereClause.isActive = isActive === 'true';
    if (search) {
      whereClause.name = { [Op.iLike]: `%${search}%` };
    }

    const { count, rows } = await Parish.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: SystemConfiguration,
          as: 'configurations',
          where: { isActive: true },
          required: false,
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['name', 'ASC']],
    });

    res.json({
      parishes: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Error getting parishes:', error);
    res.status(500).json({ error: 'Failed to get parishes' });
  }
};

// Get single parish by ID
const getParishById = async (req, res) => {
  try {
    const { id } = req.params;

    const parish = await Parish.findByPk(id, {
      include: [
        {
          model: SystemConfiguration,
          as: 'configurations',
          where: { isActive: true },
          required: false,
        },
      ],
    });

    if (!parish) {
      return res.status(404).json({ error: 'Parish not found' });
    }

    res.json(parish);
  } catch (error) {
    console.error('Error getting parish:', error);
    res.status(500).json({ error: 'Failed to get parish' });
  }
};

// Create new parish
const createParish = async (req, res) => {
  try {
    const {
      name,
      address,
      contactEmail,
      contactPhone,
      schedule,
      servicesOffered,
    } = req.body;

    if (!name || !address) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Name and address are required',
      });
    }

    const parish = await Parish.create({
      name,
      address,
      contactEmail,
      contactPhone,
      schedule,
      servicesOffered,
    });

    res.status(201).json({
      message: 'Parish created successfully',
      parish,
    });
  } catch (error) {
    console.error('Error creating parish:', error);
    res.status(500).json({ error: 'Failed to create parish' });
  }
};

// Update parish
const updateParish = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      address,
      contactEmail,
      contactPhone,
      schedule,
      servicesOffered,
      isActive,
    } = req.body;

    const parish = await Parish.findByPk(id);
    if (!parish) {
      return res.status(404).json({ error: 'Parish not found' });
    }

    await parish.update({
      name: name || parish.name,
      address: address || parish.address,
      contactEmail: contactEmail || parish.contactEmail,
      contactPhone: contactPhone || parish.contactPhone,
      schedule: schedule !== undefined ? schedule : parish.schedule,
      servicesOffered: servicesOffered !== undefined ? servicesOffered : parish.servicesOffered,
      isActive: isActive !== undefined ? isActive : parish.isActive,
    });

    res.json({
      message: 'Parish updated successfully',
      parish,
    });
  } catch (error) {
    console.error('Error updating parish:', error);
    res.status(500).json({ error: 'Failed to update parish' });
  }
};

// Delete parish (soft delete)
const deleteParish = async (req, res) => {
  try {
    const { id } = req.params;

    const parish = await Parish.findByPk(id);
    if (!parish) {
      return res.status(404).json({ error: 'Parish not found' });
    }

    await parish.update({ isActive: false });

    res.json({ message: 'Parish deactivated successfully' });
  } catch (error) {
    console.error('Error deleting parish:', error);
    res.status(500).json({ error: 'Failed to delete parish' });
  }
};

// ==================== SYSTEM CONFIGURATION MANAGEMENT ====================

// Get configurations for a parish
const getParishConfigurations = async (req, res) => {
  try {
    const { parishId } = req.params;
    const { configType } = req.query;

    const whereClause = { parishId, isActive: true };
    if (configType) {
      whereClause.configType = configType;
    }

    const configurations = await SystemConfiguration.findAll({
      where: whereClause,
      order: [['configType', 'ASC']],
    });

    res.json(configurations);
  } catch (error) {
    console.error('Error getting configurations:', error);
    res.status(500).json({ error: 'Failed to get configurations' });
  }
};

// Create or update configuration
const upsertConfiguration = async (req, res) => {
  try {
    const { parishId, configType } = req.params;
    const configData = req.body;

    // Find existing configuration
    let configuration = await SystemConfiguration.findOne({
      where: { parishId, configType },
    });

    if (configuration) {
      // Update existing
      await configuration.update(configData);
      res.json({
        message: 'Configuration updated successfully',
        configuration,
      });
    } else {
      // Create new
      configuration = await SystemConfiguration.create({
        parishId,
        configType,
        ...configData,
      });
      res.status(201).json({
        message: 'Configuration created successfully',
        configuration,
      });
    }
  } catch (error) {
    console.error('Error upserting configuration:', error);
    res.status(500).json({ error: 'Failed to save configuration' });
  }
};

// Delete configuration
const deleteConfiguration = async (req, res) => {
  try {
    const { id } = req.params;

    const configuration = await SystemConfiguration.findByPk(id);
    if (!configuration) {
      return res.status(404).json({ error: 'Configuration not found' });
    }

    await configuration.update({ isActive: false });

    res.json({ message: 'Configuration deactivated successfully' });
  } catch (error) {
    console.error('Error deleting configuration:', error);
    res.status(500).json({ error: 'Failed to delete configuration' });
  }
};

// ==================== BOOKING MANAGEMENT ====================

// Get all bookings (admin view)
const getAllBookings = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      parishId,
      bookingType,
      userId,
      startDate,
      endDate,
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    if (status) whereClause.status = status;
    if (parishId) whereClause.parishId = parishId;
    if (bookingType) whereClause.bookingType = bookingType;
    if (userId) whereClause.userId = userId;

    if (startDate || endDate) {
      whereClause.requestedDate = {};
      if (startDate) whereClause.requestedDate[Op.gte] = startDate;
      if (endDate) whereClause.requestedDate[Op.lte] = endDate;
    }

    const { count, rows } = await Booking.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone'],
        },
        {
          model: Parish,
          as: 'parish',
          attributes: ['id', 'name'],
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['requestedDate', 'DESC']],
    });

    res.json({
      bookings: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Error getting bookings:', error);
    res.status(500).json({ error: 'Failed to get bookings' });
  }
};

// Get single booking by ID
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone'],
        },
        {
          model: Parish,
          as: 'parish',
          attributes: ['id', 'name', 'address', 'contactEmail', 'contactPhone'],
        },
      ],
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Error getting booking:', error);
    res.status(500).json({ error: 'Failed to get booking' });
  }
};

// Update booking status (approve/reject/reschedule)
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, newRequestedDate } = req.body;

    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Invalid status',
        message: `Status must be one of: ${validStatuses.join(', ')}`,
      });
    }

    await booking.update({
      status: status || booking.status,
      notes: notes !== undefined ? notes : booking.notes,
      requestedDate: newRequestedDate || booking.requestedDate,
    });

    res.json({
      message: `Booking ${status ? status + 'ed' : 'updated'} successfully`,
      booking,
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ error: 'Failed to update booking status' });
  }
};

// Delete booking
const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    await booking.destroy();

    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ error: 'Failed to delete booking' });
  }
};

// ==================== MASS INTENTION MANAGEMENT ====================

// Get all mass intentions (admin view)
const getAllMassIntentions = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      parishId,
      intentionType,
      startDate,
      endDate,
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    if (status) whereClause.status = status;
    if (parishId) whereClause.parishId = parishId;
    if (intentionType) whereClause.intentionType = intentionType;

    if (startDate || endDate) {
      whereClause.massDate = {};
      if (startDate) whereClause.massDate[Op.gte] = startDate;
      if (endDate) whereClause.massDate[Op.lte] = endDate;
    }

    const { count, rows } = await MassIntention.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
        {
          model: Parish,
          as: 'parish',
          attributes: ['id', 'name'],
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['massDate', 'DESC']],
    });

    res.json({
      massIntentions: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Error getting mass intentions:', error);
    res.status(500).json({ error: 'Failed to get mass intentions' });
  }
};

// Update mass intention status
const updateMassIntentionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const intention = await MassIntention.findByPk(id);
    if (!intention) {
      return res.status(404).json({ error: 'Mass intention not found' });
    }

    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Invalid status',
        message: `Status must be one of: ${validStatuses.join(', ')}`,
      });
    }

    await intention.update({
      status: status || intention.status,
      notes: notes !== undefined ? notes : intention.notes,
    });

    res.json({
      message: 'Mass intention updated successfully',
      intention,
    });
  } catch (error) {
    console.error('Error updating mass intention:', error);
    res.status(500).json({ error: 'Failed to update mass intention' });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getAllParishes,
  getParishById,
  createParish,
  updateParish,
  deleteParish,
  getParishConfigurations,
  upsertConfiguration,
  deleteConfiguration,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
  getAllMassIntentions,
  updateMassIntentionStatus,
};
