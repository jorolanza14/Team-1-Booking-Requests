const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const EucharistBooking = sequelize.define('EucharistBooking', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  parishId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'parishes',
      key: 'id',
    },
  },
  // Communicant information
  communicantName: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  communicantDateOfBirth: {
    type: DataTypes.DATEONLY,
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
  // Contact information
  contactNumber: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  contactEmail: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  // Preferred schedule
  preferredDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  preferredTimeSlot: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  preferredPriest: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  // Documents
  documents: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Array of document URLs (baptismal certificate, etc.)',
  },
  // Status
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled'),
    defaultValue: 'pending',
  },
  // Additional notes
  additionalNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  // Admin notes
  adminNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'eucharist_bookings',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['parish_id'] },
    { fields: ['preferred_date'] },
    { fields: ['status'] },
  ],
});

module.exports = EucharistBooking;
