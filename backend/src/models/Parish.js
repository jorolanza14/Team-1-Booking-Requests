const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Parish = sequelize.define('Parish', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  contactEmail: {
    type: DataTypes.STRING(255),
    validate: {
      isEmail: true,
    },
  },
  contactPhone: {
    type: DataTypes.STRING(20),
  },
  schedule: {
    type: DataTypes.JSONB, // Store mass schedules and availability
    allowNull: true,
  },
  servicesOffered: {
    type: DataTypes.ARRAY(DataTypes.STRING), // e.g., ['baptism', 'wedding', 'confirmation']
    allowNull: true,
    defaultValue: [],
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'parishes',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['name'] },
    { fields: ['is_active'] },
  ],
});

module.exports = Parish;