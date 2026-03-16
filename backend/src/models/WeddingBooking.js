const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const WeddingBooking = sequelize.define('WeddingBooking', {
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
  // Groom information
  groomFullName: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  groomDateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  groomContactNumber: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  // Bride information
  brideFullName: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  brideDateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  brideContactNumber: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  // Godparents/sponsors information
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
  // Seminar schedule
  seminarSchedule: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  // Documents
  documents: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Array of document URLs (CENOMAR, birth certs, baptismal certs, etc.)',
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
  tableName: 'wedding_bookings',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['parish_id'] },
    { fields: ['preferred_date'] },
    { fields: ['status'] },
  ],
});

module.exports = WeddingBooking;
