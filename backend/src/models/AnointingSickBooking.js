const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AnointingSickBooking = sequelize.define('AnointingSickBooking', {
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
  // Sick person's information
  sickPersonName: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  // Contact person information
  contactPersonName: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  contactEmail: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  contactPhone: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  // Location information
  location: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  locationAddress: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  // Preferred schedule
  preferredDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  preferredTimeSlot: {
    type: DataTypes.STRING(100),
    allowNull: true,
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
  tableName: 'anointing_sick_bookings',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['parish_id'] },
    { fields: ['user_id'] },
    { fields: ['preferred_date'] },
    { fields: ['status'] },
    { fields: ['sick_person_name'] },
  ],
});

module.exports = AnointingSickBooking;
