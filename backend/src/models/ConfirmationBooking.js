const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ConfirmationBooking = sequelize.define('ConfirmationBooking', {
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
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  // Confirmand's information
  confirmandName: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  fatherName: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  motherName: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  // Contact information
  contactEmail: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  contactPhone: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  // Preferred schedule
  preferredDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  preferredTimeSlot: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  // Optional priest
  preferredPriest: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  // Additional information
  additionalNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  // Status tracking
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'declined', 'completed', 'rescheduled'),
    defaultValue: 'pending',
    allowNull: false,
  },
  adminNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  approvedBy: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id',
    },
    allowNull: true,
  },
  approvedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'confirmation_bookings',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['parish_id'] },
    { fields: ['user_id'] },
    { fields: ['preferred_date'] },
    { fields: ['status'] },
    { fields: ['confirmand_name'] },
  ],
});

module.exports = ConfirmationBooking;
