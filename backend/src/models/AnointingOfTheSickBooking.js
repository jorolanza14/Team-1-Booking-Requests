const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AnointingOfTheSickBooking = sequelize.define('AnointingOfTheSickBooking', {
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
  // Sick person information
  sickPersonName: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  sickPersonAge: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  // Contact person information
  contactPersonName: {
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
  // Location
  location: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Hospital or Home address',
  },
  locationType: {
    type: DataTypes.ENUM('hospital', 'home', 'other'),
    defaultValue: 'home',
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
  // Urgency level
  urgency: {
    type: DataTypes.ENUM('routine', 'urgent', 'emergency'),
    defaultValue: 'routine',
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
  tableName: 'anointing_sick_bookings',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['parish_id'] },
    { fields: ['preferred_date'] },
    { fields: ['status'] },
  ],
});

module.exports = AnointingOfTheSickBooking;
