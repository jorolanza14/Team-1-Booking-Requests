const { sequelize } = require('../config/database');
const User = require('./User');
const Parish = require('./Parish');
const Booking = require('./Booking');
const MassIntention = require('./MassIntention');
const MassSchedule = require('./MassSchedule');
const SystemConfiguration = require('./SystemConfiguration');
const BaptismBooking = require('./BaptismBooking');
const WeddingBooking = require('./WeddingBooking');
const ConfirmationBooking = require('./ConfirmationBooking');
const EucharistBooking = require('./EucharistBooking');
const ReconciliationBooking = require('./ReconciliationBooking');
const AnointingOfTheSickBooking = require('./AnointingOfTheSickBooking');
const FuneralMassBooking = require('./FuneralMassBooking');

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

// System Configuration associations
Parish.hasMany(SystemConfiguration, {
  foreignKey: 'parishId',
  as: 'configurations',
});
SystemConfiguration.belongsTo(Parish, {
  foreignKey: 'parishId',
  as: 'parish',
});

// Sacrament-specific booking associations
// Baptism
User.hasMany(BaptismBooking, { foreignKey: 'userId', as: 'baptismBookings', onDelete: 'CASCADE' });
BaptismBooking.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Parish.hasMany(BaptismBooking, { foreignKey: 'parishId', as: 'baptismBookings' });
BaptismBooking.belongsTo(Parish, { foreignKey: 'parishId', as: 'parish' });

// Wedding
User.hasMany(WeddingBooking, { foreignKey: 'userId', as: 'weddingBookings', onDelete: 'CASCADE' });
WeddingBooking.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Parish.hasMany(WeddingBooking, { foreignKey: 'parishId', as: 'weddingBookings' });
WeddingBooking.belongsTo(Parish, { foreignKey: 'parishId', as: 'parish' });

// Confirmation
User.hasMany(ConfirmationBooking, { foreignKey: 'userId', as: 'confirmationBookings', onDelete: 'CASCADE' });
ConfirmationBooking.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Parish.hasMany(ConfirmationBooking, { foreignKey: 'parishId', as: 'confirmationBookings' });
ConfirmationBooking.belongsTo(Parish, { foreignKey: 'parishId', as: 'parish' });

// Eucharist
User.hasMany(EucharistBooking, { foreignKey: 'userId', as: 'eucharistBookings', onDelete: 'CASCADE' });
EucharistBooking.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Parish.hasMany(EucharistBooking, { foreignKey: 'parishId', as: 'eucharistBookings' });
EucharistBooking.belongsTo(Parish, { foreignKey: 'parishId', as: 'parish' });

// Reconciliation
User.hasMany(ReconciliationBooking, { foreignKey: 'userId', as: 'reconciliationBookings', onDelete: 'CASCADE' });
ReconciliationBooking.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Parish.hasMany(ReconciliationBooking, { foreignKey: 'parishId', as: 'reconciliationBookings' });
ReconciliationBooking.belongsTo(Parish, { foreignKey: 'parishId', as: 'parish' });

// Anointing of the Sick
User.hasMany(AnointingOfTheSickBooking, { foreignKey: 'userId', as: 'anointingSickBookings', onDelete: 'CASCADE' });
AnointingOfTheSickBooking.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Parish.hasMany(AnointingOfTheSickBooking, { foreignKey: 'parishId', as: 'anointingSickBookings' });
AnointingOfTheSickBooking.belongsTo(Parish, { foreignKey: 'parishId', as: 'parish' });

// Funeral Mass
User.hasMany(FuneralMassBooking, { foreignKey: 'userId', as: 'funeralMassBookings', onDelete: 'CASCADE' });
FuneralMassBooking.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Parish.hasMany(FuneralMassBooking, { foreignKey: 'parishId', as: 'funeralMassBookings' });
FuneralMassBooking.belongsTo(Parish, { foreignKey: 'parishId', as: 'parish' });

// Call associate methods if defined in models
if (Parish.associate) Parish.associate({ SystemConfiguration });

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
  MassSchedule,
  SystemConfiguration,
  BaptismBooking,
  WeddingBooking,
  ConfirmationBooking,
  EucharistBooking,
  ReconciliationBooking,
  AnointingOfTheSickBooking,
  FuneralMassBooking,
  syncDatabase,
};
