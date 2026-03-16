const { sequelize } = require('./src/config/database');

async function migrateTokenBlacklist() {
  try {
    console.log('🔄 Starting token_blacklist table migration...');
    
    // Drop the existing table if it exists
    await sequelize.query('DROP TABLE IF EXISTS token_blacklist CASCADE;');
    console.log('✅ Dropped existing token_blacklist table');
    
    // Recreate the table with correct schema
    await sequelize.query(`
      CREATE TABLE token_blacklist (
        id SERIAL PRIMARY KEY,
        token VARCHAR(500) NOT NULL UNIQUE,
        "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "blacklistedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        reason VARCHAR(255) DEFAULT 'logout'
      );
    `);
    console.log('✅ Created token_blacklist table with correct schema');
    
    // Create index on token
    await sequelize.query(`
      CREATE UNIQUE INDEX token_blacklist_token_idx ON token_blacklist (token);
    `);
    console.log('✅ Created index on token column');
    
    // Create index on expiresAt
    await sequelize.query(`
      CREATE INDEX token_blacklist_expires_at_idx ON token_blacklist ("expiresAt");
    `);
    console.log('✅ Created index on expiresAt column');
    
    console.log('✅ Token blacklist table migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrateTokenBlacklist();
