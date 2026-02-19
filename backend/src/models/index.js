const { sequelize } = require('../config/database');
const User = require('./User');
const Parish = require('./Parish');
const Booking = require('./Booking');
const MassIntention = require('./MassIntention');
const MassSchedule = require('./MassSchedule');

// Define associations
User.hasMany(Booking, {
  foreignKey: 'userId',
  as: 'bookings',
  onDelete: 'CASCADE',
});
Booking.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

Parish.hasMany(Booking, {
  foreignKey: 'parishId',
  as: 'bookings',
});
Booking.belongsTo(Parish, {
  foreignKey: 'parishId',
  as: 'parish',
});

User.hasMany(MassIntention, {
  foreignKey: 'submittedBy',
  as: 'intentions',
  onDelete: 'CASCADE',
});
MassIntention.belongsTo(User, {
  foreignKey: 'submittedBy',
  as: 'submitter',
});

Parish.hasMany(MassIntention, {
  foreignKey: 'parishId',
  as: 'intentions',
});
MassIntention.belongsTo(Parish, {
  foreignKey: 'parishId',
  as: 'parish',
});

// Mass Schedule associations
Parish.hasMany(MassSchedule, {
  foreignKey: 'parishId',
  as: 'massSchedules',
});
MassSchedule.belongsTo(Parish, {
  foreignKey: 'parishId',
  as: 'parish',
});

User.hasMany(MassSchedule, {
  foreignKey: 'priestId',
  as: 'assignedMassSchedules',
});
MassSchedule.belongsTo(User, {
  foreignKey: 'priestId',
  as: 'assignedPriest',
});

// Association for parish admins
User.belongsTo(Parish, {
  foreignKey: 'assignedParishId',
  as: 'assignedParish',
});

// Sync database
const syncDatabase = async (options = {}) => {
  try {
    // Set force: true to drop and recreate tables (DANGER: deletes all data)
    // Set alter: true to modify tables to match models
    await sequelize.sync(options);
    console.log('✅ Database models synchronized successfully.');
    
    if (options.force) {
      console.log('⚠️  WARNING: All tables were dropped and recreated!');
    }
  } catch (error) {
    console.error('❌ Database sync failed:', error);
    throw error;
  }
};

module.exports = {
  sequelize,
  User,
  Parish,
  Booking,
  MassIntention,
  syncDatabase,
};