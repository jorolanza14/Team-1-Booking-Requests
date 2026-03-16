const { sequelize } = require('../config/database');
const { User, Parish, SystemConfiguration } = require('../models');
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV || 'development'}`
});

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Create default diocese admin user
    const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@diocese.kalookan.org';
    
    let adminUser = await User.findOne({ where: { email: adminEmail } });
    
    if (!adminUser) {
      adminUser = await User.create({
        email: adminEmail,
        password: process.env.DEFAULT_ADMIN_PASSWORD || 'ChangeMe123!',
        firstName: process.env.DEFAULT_ADMIN_FIRST_NAME || 'Diocese',
        lastName: process.env.DEFAULT_ADMIN_LAST_NAME || 'Administrator',
        role: 'diocese_admin',
        phone: '',
        isActive: true,
      });
      console.log('✅ Created default diocese admin user:', adminEmail);
    } else {
      console.log('ℹ️  Admin user already exists:', adminEmail);
    }

    // Create sample parishes
    const sampleParishes = [
      {
        name: 'St. Patrick Cathedral',
        address: 'Kalookan City, Metro Manila',
        contactEmail: 'stpatrick@diocese.kalookan.org',
        contactPhone: '(02) 8123-4567',
        description: 'The cathedral church of the Diocese of Kalookan',
        servicesOffered: ['baptism', 'wedding', 'confirmation', 'eucharist', 'reconciliation', 'anointing_sick', 'mass_intention', 'funeral_mass'],
      },
      {
        name: 'Our Lady of Grace Parish',
        address: 'Grace Park, Kalookan City',
        contactEmail: 'olgrace@diocese.kalookan.org',
        contactPhone: '(02) 8234-5678',
        description: 'Serving the Grace Park community since 1950',
        servicesOffered: ['baptism', 'wedding', 'confirmation', 'eucharist', 'reconciliation', 'mass_intention'],
      },
      {
        name: 'St. John the Baptist Parish',
        address: 'Balintawak, Quezon City',
        contactEmail: 'stjohn@diocese.kalookan.org',
        contactPhone: '(02) 8345-6789',
        description: 'A vibrant parish community in Balintawak',
        servicesOffered: ['baptism', 'wedding', 'confirmation', 'eucharist', 'reconciliation', 'mass_intention', 'funeral_mass'],
      },
      {
        name: 'Holy Family Parish',
        address: 'Monumento, Caloocan City',
        contactEmail: 'holyfamily@diocese.kalookan.org',
        contactPhone: '(02) 8456-7890',
        description: 'Serving families in the Monumento area',
        servicesOffered: ['baptism', 'wedding', 'confirmation', 'eucharist', 'reconciliation', 'anointing_sick', 'mass_intention'],
      },
      {
        name: 'Sacred Heart Parish',
        address: 'Navotas City',
        contactEmail: 'sacredheart@diocese.kalookan.org',
        contactPhone: '(02) 8567-8901',
        description: 'Fishing community parish in Navotas',
        servicesOffered: ['baptism', 'wedding', 'confirmation', 'eucharist', 'reconciliation', 'mass_intention'],
      },
    ];

    const createdParishes = [];
    for (const parishData of sampleParishes) {
      let parish = await Parish.findOne({ where: { name: parishData.name } });
      
      if (!parish) {
        parish = await Parish.create(parishData);
        console.log(`✅ Created parish: ${parish.name}`);
        createdParishes.push(parish);
      } else {
        console.log(`ℹ️  Parish already exists: ${parish.name}`);
        createdParishes.push(parish);
      }
    }

    // Create system configurations for each parish
    const configTypes = [
      'baptism',
      'wedding',
      'confirmation',
      'eucharist',
      'reconciliation',
      'anointing_sick',
      'mass_intention',
      'funeral_mass',
    ];

    for (const parish of createdParishes) {
      for (const configType of configTypes) {
        let config = await SystemConfiguration.findOne({
          where: { parishId: parish.id, configType },
        });

        if (!config) {
          // Default configuration based on sacrament type
          const defaultConfig = {
            parishId: parish.id,
            configType,
            dailyLimit: configType === 'wedding' ? 2 : 10,
            weeklyLimit: configType === 'wedding' ? 10 : 50,
            monthlyLimit: configType === 'wedding' ? 40 : 200,
            timeSlots: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
            blackoutDates: [],
            massSchedules: [
              { day: 'Sunday', time: '06:00' },
              { day: 'Sunday', time: '08:00' },
              { day: 'Sunday', time: '10:00' },
              { day: 'Wednesday', time: '06:00' },
              { day: 'Friday', time: '06:00' },
            ],
            bookingCutoffDays: 7,
            maxAdvanceBookingDays: 180,
            cutoffTime: '23:59',
            autoApprove: false,
            requiredDocuments: getRequiredDocuments(configType),
            maxGodparents: configType === 'baptism' ? 3 : (configType === 'wedding' ? 6 : 2),
            instructions: getDefaultInstructions(configType),
            isActive: true,
          };

          await SystemConfiguration.create(defaultConfig);
          console.log(`✅ Created ${configType} configuration for ${parish.name}`);
        }
      }
    }

    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Database seeding completed successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('📋 Summary:');
    console.log(`   - Admin User: ${adminEmail}`);
    console.log(`   - Parishes: ${createdParishes.length}`);
    console.log(`   - Configurations: ${createdParishes.length * configTypes.length}`);
    console.log('');
    console.log('⚠️  IMPORTANT: Change the default admin password!');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Helper function to get required documents per sacrament
function getRequiredDocuments(configType) {
  const documents = {
    baptism: ['birth_certificate', 'baptismal_preparation_certificate'],
    wedding: ['cenomar', 'birth_certificate', 'baptismal_certificate', 'confirmation_certificate', 'pre_cana_certificate'],
    confirmation: ['baptismal_certificate', 'confirmation_preparation_certificate'],
    eucharist: ['baptismal_certificate', 'first_communion_preparation_certificate'],
    reconciliation: [],
    anointing_sick: [],
    mass_intention: [],
    funeral_mass: ['death_certificate', 'burial_permit'],
  };
  return documents[configType] || [];
}

// Helper function to get default instructions per sacrament
function getDefaultInstructions(configType) {
  const instructions = {
    baptism: 'Please bring the original birth certificate and baptismal preparation certificate on the day of baptism. At least one parent and godparent must be present.',
    wedding: 'Couple must attend Pre-Cana seminar at least 6 months before the wedding. Submit all requirements at least 3 months before the wedding date.',
    confirmation: 'Confirmands must complete the confirmation preparation program. Bring baptismal certificate and confirmation preparation certificate.',
    eucharist: 'Child must complete First Communion preparation. Parents and godparents must attend the orientation session.',
    reconciliation: 'Confession is available every Saturday at 4:00 PM or by appointment with the parish priest.',
    anointing_sick: 'For emergency anointing, please call the parish office immediately. Available 24/7 for critical cases.',
    mass_intention: 'Mass intentions are scheduled based on availability. You will be notified of the confirmed date and time.',
    funeral_mass: 'Please coordinate with the parish office as soon as possible. Bring death certificate and burial permit.',
  };
  return instructions[configType] || 'Please contact the parish office for more information.';
}

seedDatabase();
