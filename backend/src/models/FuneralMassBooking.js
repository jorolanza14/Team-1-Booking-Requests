const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const FuneralMassBooking = sequelize.define('FuneralMassBooking', {
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
  // Deceased information
  deceasedFullName: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  dateOfDeath: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  placeOfDeath: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  // Representative information
  representativeName: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  contactNumber: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  contactEmail: {
    type: DataTypes.STRING(255),
    allowNull: true,
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
    allowNull: true,
  },
  preferredTimeSlot: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  preferredPriest: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  // Documents
  documents: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Array of document URLs (death certificate, etc.)',
  },
  // Status
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled'),
    defaultValue: 'pending',
  },
  // Additional notes
  additionalNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  // Admin notes
  adminNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'funeral_mass_bookings',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['parish_id'] },
    { fields: ['preferred_date'] },
    { fields: ['status'] },
  ],
});

module.exports = FuneralMassBooking;
