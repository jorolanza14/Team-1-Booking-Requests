const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SacramentalRecord = sequelize.define('SacramentalRecord', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  parishId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'parishes',
      key: 'id',
    },
  },
  // Sacrament type
  sacramentType: {
    type: DataTypes.ENUM(
      'baptism',
      'confirmation',
      'eucharist',
      'wedding',
      'reconciliation',
      'anointing_sick',
      'holy_orders',
      'matrimony'
    ),
    allowNull: false,
  },
  // Primary person information
  personName: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  placeOfBirth: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  // Parents information
  fatherName: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  motherName: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  motherMaidenName: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  // Godparents/Sponsors
  godparents: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: [],
  },
  // Sacrament details
  sacramentDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  sacramentLocation: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  officiatingPriest: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  // Certificate information
  certificateNumber: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  registerNumber: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  page: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  entry: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  // For wedding - spouse information
  spouseName: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  // Scanned document
  hasScannedCopy: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  scannedCopyUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  scannedCopyPath: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  // Additional notes
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  // Record metadata
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  // Created by (for digitization tracking)
  digitizedBy: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id',
    },
    allowNull: true,
  },
  digitizedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'sacramental_records',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['parish_id'] },
    { fields: ['sacrament_type'] },
    { fields: ['person_name'] },
    { fields: ['sacrament_date'] },
    { fields: ['year'] },
    { fields: ['father_name'] },
    { fields: ['mother_name'] },
    { fields: ['certificate_number'] },
    // Combined index for searching
    {
      name: 'sacramental_records_search',
      fields: ['person_name', 'sacrament_type', 'year'],
    },
  ],
});

module.exports = SacramentalRecord;
