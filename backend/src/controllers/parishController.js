const { Parish } = require('../models');
const { Op } = require('sequelize');

// Get all active parishes
exports.getAllParishes = async (req, res, next) => {
  try {
    const parishes = await Parish.findAll({
      where: { isActive: true },
      attributes: ['id', 'name', 'address', 'contactEmail', 'contactPhone', 'schedule', 'servicesOffered', 'createdAt', 'updatedAt'],
    });

    res.json({
      success: true,
      data: parishes,
      message: 'Parishes retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Get parish by ID
exports.getParishById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const parish = await Parish.findOne({
      where: { id, isActive: true },
      attributes: ['id', 'name', 'address', 'contactEmail', 'contactPhone', 'schedule', 'servicesOffered', 'createdAt', 'updatedAt'],
    });

    if (!parish) {
      return res.status(404).json({
        success: false,
        message: 'Parish not found',
      });
    }

    res.json({
      success: true,
      data: parish,
      message: 'Parish retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Search parishes by name or location
exports.searchParishes = async (req, res, next) => {
  try {
    const { query, services } = req.query;
    const conditions = { isActive: true };

    if (query) {
      conditions[Op.or] = [
        { name: { [Op.iLike]: `%${query}%` } },
        { address: { [Op.iLike]: `%${query}%` } },
      ];
    }

    if (services) {
      const serviceList = Array.isArray(services) ? services : [services];
      conditions.servicesOffered = { [Op.contains]: serviceList };
    }

    const parishes = await Parish.findAll({
      where: conditions,
      attributes: ['id', 'name', 'address', 'contactEmail', 'contactPhone', 'schedule', 'servicesOffered', 'createdAt', 'updatedAt'],
    });

    res.json({
      success: true,
      data: parishes,
      message: 'Parishes retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Get parishes by services offered
exports.getParishesByService = async (req, res, next) => {
  try {
    const { service } = req.params;

    const parishes = await Parish.findAll({
      where: {
        isActive: true,
        servicesOffered: { [Op.contains]: [service] },
      },
      attributes: ['id', 'name', 'address', 'contactEmail', 'contactPhone', 'schedule', 'servicesOffered', 'createdAt', 'updatedAt'],
    });

    res.json({
      success: true,
      data: parishes,
      message: 'Parishes retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};