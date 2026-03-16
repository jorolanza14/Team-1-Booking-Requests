const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const BlackoutDate = sequelize.define('BlackoutDate', {
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
  // Service type this blackout applies to (null = all services)
  serviceType: {
    type: DataTypes.ENUM(
      'baptism',
      'wedding',
      'confirmation',
      'eucharist',
      'reconciliation',
      'anointing_sick',
      'funeral_mass',
      'mass_intention'
    ),
    allowNull: true,
  },
  // Blackout date
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  // Reason for blackout
  reason: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  // Recurring settings
  isRecurring: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  recurrencePattern: {
    type: DataTypes.ENUM('yearly', 'monthly', 'weekly'),
    allowNull: true,
  },
  // Created by
  createdBy: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id',
    },
    allowNull: false,
  },
}, {
  tableName: 'blackout_dates',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['parish_id'] },
    { fields: ['service_type'] },
    { fields: ['date'] },
    { fields: ['is_recurring'] },
  ],
});

module.exports = BlackoutDate;
