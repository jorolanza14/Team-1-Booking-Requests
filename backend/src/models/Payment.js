const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  // Polymorphic association - can belong to different booking types
  bookingType: {
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
  bookingId: {
    type: DataTypes.INTEGER,
    allowNull: false,
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
  // Payment information
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
  donationAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
  // Payment method
  paymentMethod: {
    type: DataTypes.ENUM('cash', 'gcash', 'paymaya', 'bank_transfer', 'check', 'credit_card'),
    allowNull: true,
  },
  // Payment status
  status: {
    type: DataTypes.ENUM('pending', 'paid', 'partial', 'refunded', 'cancelled'),
    defaultValue: 'pending',
    allowNull: false,
  },
  // Proof of payment
  proofOfPaymentUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  proofOfPaymentPath: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  // Payment details
  transactionReference: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  paymentDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  // Notes
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  // Processed by
  processedBy: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id',
    },
    allowNull: true,
  },
  processedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'payments',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['booking_type'] },
    { fields: ['booking_id'] },
    { fields: ['parish_id'] },
    { fields: ['user_id'] },
    { fields: ['status'] },
    { fields: ['payment_date'] },
    // Combined index for polymorphic association
    {
      name: 'payments_booking_lookup',
      fields: ['booking_type', 'booking_id'],
    },
  ],
});

module.exports = Payment;
