const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const BaptismBooking = sequelize.define('BaptismBooking', {
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
  // Child information
  childFullName: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  childDateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  childPlaceOfBirth: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  // Parents information
  fatherName: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  motherName: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  // Godparents information (stored as JSON)
  godparents: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: [],
    comment: 'Array of godparent objects: [{name, contact}]',
  },
  // Contact information
  contactNumber: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  contactEmail: {
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
    comment: 'Array of document URLs (birth certificate, etc.)',
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
  tableName: 'baptism_bookings',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['parish_id'] },
    { fields: ['preferred_date'] },
    { fields: ['status'] },
  ],
});

module.exports = BaptismBooking;
