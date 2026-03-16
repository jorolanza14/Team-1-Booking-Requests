const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ParishSlotSetting = sequelize.define('ParishSlotSetting', {
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
  // Service type this setting applies to
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
    allowNull: false,
  },
  // Daily/Weekly limits
  dailyLimit: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  weeklyLimit: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  // Time slots configuration (stored as JSON)
  timeSlots: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: [],
  },
  // Cutoff time for bookings (e.g., mass intention cutoff)
  cutoffTime: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  // Advance booking settings
  minAdvanceDays: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  maxAdvanceDays: {
    type: DataTypes.INTEGER,
    defaultValue: 90,
  },
  // Active status
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'parish_slot_settings',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['parish_id'] },
    { fields: ['service_type'] },
    { fields: ['is_active'] },
    // Unique constraint for parish + service type combination
    {
      name: 'parish_slot_settings_parish_service_unique',
      unique: true,
      fields: ['parish_id', 'service_type'],
    },
  ],
});

module.exports = ParishSlotSetting;
