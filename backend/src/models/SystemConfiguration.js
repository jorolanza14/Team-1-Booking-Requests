const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SystemConfiguration = sequelize.define('SystemConfiguration', {
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
  configType: {
    type: DataTypes.ENUM(
      'baptism',
      'wedding',
      'confirmation',
      'eucharist',
      'reconciliation',
      'anointing_sick',
      'mass_intention',
      'funeral_mass'
    ),
    allowNull: false,
  },
  // Booking limits
  dailyLimit: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Maximum bookings allowed per day',
  },
  weeklyLimit: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Maximum bookings allowed per week',
  },
  monthlyLimit: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Maximum bookings allowed per month',
  },
  // Time slots configuration (JSON array of time strings)
  timeSlots: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: [],
    comment: 'Available time slots, e.g., ["09:00", "10:00", "14:00"]',
  },
  // Blackout dates (JSON array of date strings or ranges)
  blackoutDates: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: [],
    comment: 'Unavailable dates, e.g., ["2024-12-25", {"start": "2024-04-01", "end": "2024-04-07"}]',
  },
  // Mass schedules
  massSchedules: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: [],
    comment: 'Regular mass schedules, e.g., [{"day": "Sunday", "time": "06:00"}, {"day": "Sunday", "time": "09:00"}]',
  },
  // Cutoff settings
  bookingCutoffDays: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 7,
    comment: 'Minimum days in advance a booking must be made',
  },
  maxAdvanceBookingDays: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 180,
    comment: 'Maximum days in advance a booking can be made',
  },
  // Cutoff time for same-day bookings
  cutoffTime: {
    type: DataTypes.STRING(10),
    allowNull: true,
    defaultValue: '23:59',
    comment: 'Time after which same-day bookings are not allowed',
  },
  // Auto-approval settings
  autoApprove: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Whether bookings are auto-approved',
  },
  // Required documents
  requiredDocuments: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: [],
    comment: 'List of required document types, e.g., ["birth_certificate", "baptismal_certificate"]',
  },
  // Maximum number of godparents/sponsors allowed
  maxGodparents: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 2,
    comment: 'Maximum number of godparents/sponsors allowed',
  },
  // Additional notes/instructions for parishioners
  instructions: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  // Whether the configuration is active
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'system_configurations',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['parish_id'] },
    { fields: ['config_type'] },
    { fields: ['is_active'] },
  ],
});

module.exports = SystemConfiguration;
