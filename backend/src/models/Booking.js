const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Booking = sequelize.define('Booking', {
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
  bookingType: {
    type: DataTypes.ENUM('baptism', 'wedding', 'confirmation'),
    allowNull: false,
  },
  requestedDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled'),
    defaultValue: 'pending',
  },
  notes: {
    type: DataTypes.TEXT,
  },
  documents: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  additionalInfo: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
}, {
  tableName: 'bookings',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['parish_id'] },
    { fields: ['booking_type'] },
    { fields: ['requested_date'] },
    { fields: ['status'] },
  ],
});

module.exports = Booking;