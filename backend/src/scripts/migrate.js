/**
 * Database Migration Script
 * Creates all necessary tables for the Diocese application
 */

require('dotenv').config({ 
  path: `.env.${process.env.NODE_ENV || 'development'}` 
});

const { sequelize } = require('../config/database');
const { User } = require('../models');

async function runMigrations() {
  console.log('🚀 Starting database migration...');

  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Synchronize all models
    // Note: force: false means it won't drop existing tables
    // Set force: true only in development to reset the database
    await sequelize.sync({ 
      force: false, // Change to true only in development if you want to reset
      alter: true   // This allows modifying existing tables
    });
    
    console.log('✅ Database synchronized successfully.');
    
    // Create default admin user if none exists
    const adminUser = await User.findOne({ 
      where: { email: 'admin@diocese-kalookan.com' } 
    });
    
    if (!adminUser) {
      await User.create({
        email: 'admin@diocese-kalookan.com',
        password: 'AdminPass123!', // In production, this should be set via environment
        firstName: 'System',
        lastName: 'Administrator',
        phone: '+639123456789',
        role: 'admin',
        isActive: true
      });
      
      console.log('✅ Default admin user created.');
    } else {
      console.log('ℹ️ Admin user already exists.');
    }

    console.log('\n🎉 Database migration completed successfully!');
    console.log('📋 Next steps:');
    console.log('   - Run `npm run dev` to start the server');
    console.log('   - Access the API at http://localhost:3000');
    console.log('   - Use the /health endpoint to verify everything is working');

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Run the migration
runMigrations();