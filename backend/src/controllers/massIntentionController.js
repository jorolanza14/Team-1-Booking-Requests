const { validationResult } = require('express-validator');
const { MassIntention, User, Parish } = require('../models');
const { Op } = require('sequelize');

// Create a new mass intention
exports.createMassIntention = async (req, res, next) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const {
      type,
      intentionDetails,
      donorName,
      parishId,
      massSchedule,
      preferredPriest,
      notes
    } = req.body;

    // Check if parish exists
    const parish = await Parish.findByPk(parishId);
    if (!parish) {
      return res.status(404).json({
        error: 'Parish not found',
        message: 'The specified parish does not exist'
      });
    }

    // Create mass intention
    const massIntention = await MassIntention.create({
      type,
      intentionDetails,
      donorName,
      parishId,
      massSchedule,
      preferredPriest,
      notes,
      submittedBy: req.user.userId,
      dateRequested: new Date().toISOString().split('T')[0] // Today's date in YYYY-MM-DD format
    });

    res.status(201).json({
      message: 'Mass intention created successfully',
      massIntention: massIntention
    });
  } catch (error) {
    next(error);
  }
};

// Get all mass intentions (with pagination and filtering)
exports.getAllMassIntentions = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // Filtering options
    const { type, status, parishId, startDate, endDate } = req.query;
    
    const whereClause = {};
    
    if (type) whereClause.type = type;
    if (status) whereClause.status = status;
    if (parishId) whereClause.parishId = parishId;
    
    // Date range filtering
    if (startDate || endDate) {
      whereClause.dateRequested = {};
      if (startDate) whereClause.dateRequested[Op.gte] = startDate;
      if (endDate) whereClause.dateRequested[Op.lte] = endDate;
    }
    
    // Role-based access control
    if (req.user.role === 'parishioner') {
      // Parishioners can only see their own intentions
      whereClause.submittedBy = req.user.userId;
    } else if (req.user.role === 'parish_staff' || req.user.role === 'priest') {
      // Parish staff and priests can only see intentions for their assigned parishes
      // For simplicity, we'll assume they can see all parishes for now
      // In a real implementation, you'd link staff to specific parishes
    }
    
    const { count, rows } = await MassIntention.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'submitter',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Parish,
          as: 'parish',
          attributes: ['id', 'name', 'address']
        }
      ]
    });

    res.json({
      massIntentions: rows,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get a specific mass intention by ID
exports.getMassIntentionById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const massIntention = await MassIntention.findByPk(id, {
      include: [
        {
          model: User,
          as: 'submitter',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Parish,
          as: 'parish',
          attributes: ['id', 'name', 'address']
        }
      ]
    });

    if (!massIntention) {
      return res.status(404).json({
        error: 'Mass intention not found',
        message: 'The specified mass intention does not exist'
      });
    }

    // Check if user has permission to view this mass intention
    if (req.user.role === 'parishioner' && massIntention.submittedBy !== req.user.userId) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only view your own mass intentions'
      });
    }

    res.json({
      massIntention: massIntention
    });
  } catch (error) {
    next(error);
  }
};

// Update a mass intention
exports.updateMassIntention = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const massIntention = await MassIntention.findByPk(id);
    if (!massIntention) {
      return res.status(404).json({
        error: 'Mass intention not found',
        message: 'The specified mass intention does not exist'
      });
    }

    // Only allow updating certain fields based on user role
    const allowedUpdates = [];
    if (req.user.role === 'diocese_staff' || req.user.role === 'diocese_admin') {
      // Diocese staff can update everything
      allowedUpdates.push(...Object.keys(req.body));
    } else if (req.user.role === 'parish_staff' || req.user.role === 'priest') {
      // Parish staff and priests can update status and notes
      allowedUpdates.push('status', 'notes');
    } else if (req.user.role === 'parishioner') {
      // Parishioners can only update their own intentions if still pending
      if (massIntention.submittedBy !== req.user.userId) {
        return res.status(403).json({
          error: 'Access denied',
          message: 'You can only update your own mass intentions'
        });
      }

      if (massIntention.status !== 'pending') {
        return res.status(400).json({
          error: 'Cannot update',
          message: 'Cannot update mass intention once it is no longer pending'
        });
      }

      // Parishioners can only update specific fields for pending intentions
      allowedUpdates.push('intentionDetails', 'donorName', 'parishId', 'massSchedule', 'preferredPriest', 'notes');
    }

    // Prepare update data
    const updateData = {};
    for (const field of allowedUpdates) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }

    // Update the mass intention
    await massIntention.update(updateData);

    res.json({
      message: 'Mass intention updated successfully',
      massIntention: massIntention
    });
  } catch (error) {
    next(error);
  }
};

// Delete a mass intention
exports.deleteMassIntention = async (req, res, next) => {
  try {
    const { id } = req.params;

    const massIntention = await MassIntention.findByPk(id);
    if (!massIntention) {
      return res.status(404).json({
        error: 'Mass intention not found',
        message: 'The specified mass intention does not exist'
      });
    }

    // Check permissions
    if (req.user.role !== 'diocese_staff' && req.user.role !== 'diocese_admin') {
      if (req.user.role === 'parishioner') {
        // Parishioners can only delete their own pending intentions
        if (massIntention.submittedBy !== req.user.userId) {
          return res.status(403).json({
            error: 'Access denied',
            message: 'You can only delete your own mass intentions'
          });
        }

        if (massIntention.status !== 'pending') {
          return res.status(400).json({
            error: 'Cannot delete',
            message: 'Cannot delete mass intention once it is no longer pending'
          });
        }
      } else {
        // Parish staff and priests cannot delete intentions
        return res.status(403).json({
          error: 'Access denied',
          message: 'Parish staff and priests cannot delete mass intentions'
        });
      }
    }

    await massIntention.destroy();

    res.json({
      message: 'Mass intention deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Approve a mass intention
exports.approveMassIntention = async (req, res, next) => {
  try {
    const { id } = req.params;

    const massIntention = await MassIntention.findByPk(id);
    if (!massIntention) {
      return res.status(404).json({
        error: 'Mass intention not found',
        message: 'The specified mass intention does not exist'
      });
    }

    // Only parish staff, priests, or diocese staff can approve
    if (!['parish_staff', 'priest', 'diocese_staff', 'diocese_admin'].includes(req.user.role)) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'Only authorized personnel can approve mass intentions'
      });
    }

    await massIntention.update({ status: 'approved' });

    res.json({
      message: 'Mass intention approved successfully',
      massIntention: massIntention
    });
  } catch (error) {
    next(error);
  }
};

// Decline a mass intention
exports.declineMassIntention = async (req, res, next) => {
  try {
    const { id } = req.params;

    const massIntention = await MassIntention.findByPk(id);
    if (!massIntention) {
      return res.status(404).json({
        error: 'Mass intention not found',
        message: 'The specified mass intention does not exist'
      });
    }

    // Only parish staff, priests, or diocese staff can decline
    if (!['parish_staff', 'priest', 'diocese_staff', 'diocese_admin'].includes(req.user.role)) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'Only authorized personnel can decline mass intentions'
      });
    }

    await massIntention.update({ status: 'declined' });

    res.json({
      message: 'Mass intention declined successfully',
      massIntention: massIntention
    });
  } catch (error) {
    next(error);
  }
};