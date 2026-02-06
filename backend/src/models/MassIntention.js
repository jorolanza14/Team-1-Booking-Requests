const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MassIntention = sequelize.define('MassIntention', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  submittedBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  parishId: {
    type: DataTypes.INTEGER,
    allowNull: false,  // Made required for RCDOK structure
    references: {
      model: 'parishes',
      key: 'id',
    },
  },
  massDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  intentionType: {
    type: DataTypes.ENUM('deceased', 'thanksgiving', 'petition'),
    allowNull: false,
  },
  intentionFor: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  specialNotes: {
    type: DataTypes.TEXT,
  },
  offeringAmount: {
    type: DataTypes.DECIMAL(10, 2),
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'completed'),
    defaultValue: 'pending',
  },
}, {
  tableName: 'mass_intentions',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['submitted_by'] },
    { fields: ['parish_id'] },  // Added index for parish
    { fields: ['mass_date'] },
    { fields: ['intention_type'] },
    { fields: ['status'] },
  ],
});

module.exports = MassIntention;