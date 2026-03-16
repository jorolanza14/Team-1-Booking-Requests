const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const FuneralMassBooking = sequelize.define('FuneralMassBooking', {
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
  // Deceased person's information
  deceasedFullName: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  dateOfDeath: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  // Representative's information
  representativeName: {
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
  // Wake information
  wakeStartDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  wakeEndDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  wakeLocation: {
    type: DataTypes.STRING(255),
    allowNull: true,
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
  tableName: 'funeral_mass_bookings',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['parish_id'] },
    { fields: ['user_id'] },
    { fields: ['preferred_date'] },
    { fields: ['status'] },
    { fields: ['deceased_full_name'] },
  ],
});

module.exports = FuneralMassBooking;
