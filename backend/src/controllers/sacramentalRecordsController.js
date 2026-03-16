const { SacramentalRecord, Parish, User, sequelize } = require('../models');
const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');

// Create sacramental record (digitization)
exports.createSacramentalRecord = async (req, res) => {
  try {
    const {
      parishId,
      sacramentType,
      personName,
      dateOfBirth,
      placeOfBirth,
      fatherName,
      motherName,
      motherMaidenName,
      godparents = [],
      sacramentDate,
      sacramentLocation,
      officiatingPriest,
      certificateNumber,
      registerNumber,
      page,
      entry,
      spouseName,
      notes,
      hasScannedCopy = false,
    } = req.body;

    // Validate sacrament type
    const validSacramentTypes = [
      'baptism',
      'confirmation',
      'eucharist',
      'wedding',
      'reconciliation',
      'anointing_sick',
      'holy_orders',
      'matrimony',
    ];

    if (!validSacramentTypes.includes(sacramentType)) {
      return res.status(400).json({ error: 'Invalid sacrament type' });
    }

    // Extract year from sacrament date
    const year = new Date(sacramentDate).getFullYear();

    // Handle scanned copy upload
    let scannedCopyUrl = null;
    let scannedCopyPath = null;

    if (req.file && hasScannedCopy) {
      scannedCopyPath = req.file.path;
      scannedCopyUrl = `/uploads/${req.file.filename}`;
    }

    const record = await SacramentalRecord.create({
      parishId,
      sacramentType,
      personName,
      dateOfBirth,
      placeOfBirth,
      fatherName,
      motherName,
      motherMaidenName,
      godparents,
      sacramentDate,
      sacramentLocation,
      officiatingPriest,
      certificateNumber,
      registerNumber,
      page,
      entry,
      spouseName,
      notes,
      hasScannedCopy,
      scannedCopyUrl,
      scannedCopyPath,
      year,
      digitizedBy: req.user.userId,
      digitizedAt: new Date(),
    });

    res.status(201).json({
      message: 'Sacramental record created successfully',
      record,
    });
  } catch (error) {
    console.error('Error creating sacramental record:', error);
    res.status(500).json({ error: 'Failed to create sacramental record' });
  }
};

// Search sacramental records with filters
exports.searchSacramentalRecords = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      parishId,
      sacramentType,
      personName,
      fatherName,
      motherName,
      year,
      startDate,
      endDate,
      certificateNumber,
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    // Build search filters
    if (parishId) where.parishId = parseInt(parishId);
    if (sacramentType) where.sacramentType = sacramentType;
    if (year) where.year = parseInt(year);
    if (certificateNumber) where.certificateNumber = certificateNumber;

    // Name searches (case-insensitive partial match)
    if (personName) {
      where.personName = { [Op.iLike]: `%${personName}%` };
    }
    if (fatherName) {
      where.fatherName = { [Op.iLike]: `%${fatherName}%` };
    }
    if (motherName) {
      where.motherName = { [Op.iLike]: `%${motherName}%` };
    }

    // Date range filter
    if (startDate || endDate) {
      where.sacramentDate = {};
      if (startDate) where.sacramentDate[Op.gte] = startDate;
      if (endDate) where.sacramentDate[Op.lte] = endDate;
    }

    // Filter by user's parish if not admin
    if (req.user.role === 'parish_admin' || req.user.role === 'parish_staff') {
      const user = await User.findByPk(req.user.userId);
      if (user && user.assignedParishId) {
        where.parishId = user.assignedParishId;
      }
    }

    const { count, rows } = await SacramentalRecord.findAndCountAll({
      where,
      include: [
        {
          model: Parish,
          as: 'parish',
          attributes: ['id', 'name', 'address'],
        },
        {
          model: User,
          as: 'digitizer',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['sacramentDate', 'DESC']],
    });

    res.json({
      records: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Error searching sacramental records:', error);
    res.status(500).json({ error: 'Failed to search sacramental records' });
  }
};

// Get single sacramental record
exports.getSacramentalRecord = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await SacramentalRecord.findByPk(id, {
      include: [
        {
          model: Parish,
          as: 'parish',
          attributes: ['id', 'name', 'address'],
        },
        {
          model: User,
          as: 'digitizer',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
    });

    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.json({ record });
  } catch (error) {
    console.error('Error fetching sacramental record:', error);
    res.status(500).json({ error: 'Failed to fetch sacramental record' });
  }
};

// Update sacramental record
exports.updateSacramentalRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const record = await SacramentalRecord.findByPk(id);
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }

    // Handle scanned copy upload
    if (req.file) {
      // Delete old file if exists
      if (record.scannedCopyPath && fs.existsSync(record.scannedCopyPath)) {
        fs.unlinkSync(record.scannedCopyPath);
      }

      updateData.scannedCopyPath = req.file.path;
      updateData.scannedCopyUrl = `/uploads/${req.file.filename}`;
      updateData.hasScannedCopy = true;
    }

    await record.update(updateData);

    res.json({
      message: 'Sacramental record updated successfully',
      record,
    });
  } catch (error) {
    console.error('Error updating sacramental record:', error);
    res.status(500).json({ error: 'Failed to update sacramental record' });
  }
};

// Delete sacramental record
exports.deleteSacramentalRecord = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await SacramentalRecord.findByPk(id);
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }

    // Delete scanned copy file if exists
    if (record.scannedCopyPath && fs.existsSync(record.scannedCopyPath)) {
      fs.unlinkSync(record.scannedCopyPath);
    }

    await record.destroy();

    res.json({ message: 'Sacramental record deleted successfully' });
  } catch (error) {
    console.error('Error deleting sacramental record:', error);
    res.status(500).json({ error: 'Failed to delete sacramental record' });
  }
};

// Get sacramental record statistics
exports.getSacramentalRecordStats = async (req, res) => {
  try {
    const { parishId, year } = req.query;

    const where = {};
    if (parishId) where.parishId = parseInt(parishId);
    if (year) where.year = parseInt(year);

    // Filter by user's parish if not admin
    if (req.user.role === 'parish_admin' || req.user.role === 'parish_staff') {
      const user = await User.findByPk(req.user.userId);
      if (user && user.assignedParishId) {
        where.parishId = user.assignedParishId;
      }
    }

    // Count by sacrament type
    const byType = await SacramentalRecord.findAll({
      where,
      attributes: [
        'sacramentType',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['sacramentType'],
      raw: true,
    });

    // Count by year
    const byYear = await SacramentalRecord.findAll({
      where,
      attributes: [
        'year',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['year'],
      order: [['year', 'DESC']],
      raw: true,
    });

    // Total with scanned copies
    const scannedCount = await SacramentalRecord.count({
      where: { ...where, hasScannedCopy: true },
    });

    const totalCount = await SacramentalRecord.count({ where });

    res.json({
      stats: {
        total: totalCount,
        withScannedCopy: scannedCount,
        byType,
        byYear,
      },
    });
  } catch (error) {
    console.error('Error fetching sacramental record stats:', error);
    res.status(500).json({ error: 'Failed to fetch sacramental record stats' });
  }
};

// Bulk upload sacramental records (for digitization projects)
exports.bulkUploadSacramentalRecords = async (req, res) => {
  try {
    const { records } = req.body;

    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ error: 'Records array is required' });
    }

    // Validate all records have required fields
    const requiredFields = ['parishId', 'sacramentType', 'personName', 'sacramentDate'];
    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      for (const field of requiredFields) {
        if (!record[field]) {
          return res.status(400).json({
            error: `Record ${i + 1} is missing required field: ${field}`,
          });
        }
      }
      // Extract year
      records[i].year = new Date(record.sacramentDate).getFullYear();
      records[i].digitizedBy = req.user.userId;
      records[i].digitizedAt = new Date();
    }

    const createdRecords = await SacramentalRecord.bulkCreate(records);

    res.status(201).json({
      message: `Successfully created ${createdRecords.length} sacramental records`,
      count: createdRecords.length,
    });
  } catch (error) {
    console.error('Error bulk uploading sacramental records:', error);
    res.status(500).json({ error: 'Failed to bulk upload sacramental records' });
  }
};

// Export sacramental records (for reports)
exports.exportSacramentalRecords = async (req, res) => {
  try {
    const { parishId, sacramentType, year, startDate, endDate, format = 'json' } = req.query;

    const where = {};
    if (parishId) where.parishId = parseInt(parishId);
    if (sacramentType) where.sacramentType = sacramentType;
    if (year) where.year = parseInt(year);

    if (startDate || endDate) {
      where.sacramentDate = {};
      if (startDate) where.sacramentDate[Op.gte] = startDate;
      if (endDate) where.sacramentDate[Op.lte] = endDate;
    }

    const records = await SacramentalRecord.findAll({
      where,
      include: [
        {
          model: Parish,
          as: 'parish',
          attributes: ['id', 'name'],
        },
      ],
      order: [['sacramentDate', 'ASC']],
    });

    if (format === 'csv') {
      // Convert to CSV
      const csvRows = [];
      const headers = [
        'ID',
        'Sacrament Type',
        'Person Name',
        'Date of Birth',
        'Father Name',
        'Mother Name',
        'Sacrament Date',
        'Certificate Number',
        'Parish',
      ];
      csvRows.push(headers.join(','));

      for (const record of records) {
        csvRows.push(
          [
            record.id,
            record.sacramentType,
            `"${record.personName}"`,
            record.dateOfBirth || '',
            `"${record.fatherName || ''}"`,
            `"${record.motherName || ''}"`,
            record.sacramentDate,
            record.certificateNumber || '',
            `"${record.parish?.name || ''}"`,
          ].join(',')
        );
      }

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=sacramental_records.csv');
      return res.send(csvRows.join('\n'));
    }

    // Default JSON format
    res.json({ records });
  } catch (error) {
    console.error('Error exporting sacramental records:', error);
    res.status(500).json({ error: 'Failed to export sacramental records' });
  }
};
