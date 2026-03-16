const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MassSchedule = sequelize.define('MassSchedule', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  parishId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'parishes',
      key: 'id',
    },
    allowNull: false,
  },
  dayOfWeek: {
    type: DataTypes.ENUM('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'),
    allowNull: false,
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  priestId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id',
    },
    allowNull: true, // Can be null if no priest assigned yet
  },
  intentionCutoffTime: {
    type: DataTypes.TIME,
    allowNull: true, // Can be null if no cutoff time specified
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'mass_schedules',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['parish_id'] },
    { fields: ['day_of_week'] },
    { fields: ['start_time'] },
    { fields: ['priest_id'] },
    { fields: ['is_active'] },
  ],
});

module.exports = MassSchedule;