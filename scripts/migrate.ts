#!/usr/bin/env ts-node

/**
 * Migration CLI Tool
 * Enterprise database migration management
 */

import { migrate, rollback, status, MigrationManager } from './migrations/migration-manager';

const command = process.argv[2];
const args = process.argv.slice(3);

async function main() {
  try {
    switch (command) {
      case 'up':
      case 'migrate':
        console.log('🚀 Running database migrations...');
        await migrate();
        break;

      case 'down':
      case 'rollback':
        const version = args[0];
        if (version) {
          console.log(`🔄 Rolling back to version: ${version}`);
        } else {
          console.log('🔄 Rolling back last migration...');
        }
        await rollback(version);
        break;

      case 'status':
        console.log('📊 Checking migration status...');
        await status();
        break;

      case 'create':
        const name = args[0];
        if (!name) {
          console.error('❌ Migration name is required');
          console.log('Usage: npm run migrate create "migration_name"');
          process.exit(1);
        }
        await createMigration(name);
        break;

      case 'reset':
        console.log('⚠️ Resetting database (development only)...');
        await resetDatabase();
        break;

      case 'seed':
        console.log('🌱 Seeding database...');
        await seedDatabase();
        break;

      default:
        showHelp();
        break;
    }
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
}

async function createMigration(name: string) {
  const manager = new MigrationManager();
  
  try {
    await manager.initialize();
    
    // Template for new migration
    const upSql = `-- Migration: ${name}
-- Created: ${new Date().toISOString()}

-- Add your migration SQL here
-- Example:
-- CREATE TABLE example_table (
--   id SERIAL PRIMARY KEY,
--   name VARCHAR(255) NOT NULL,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );
`;

    const downSql = `-- Rollback: ${name}
-- Created: ${new Date().toISOString()}

-- Add your rollback SQL here
-- Example:
-- DROP TABLE IF EXISTS example_table;
`;

    const version = await manager.createMigration(name, upSql, downSql);
    console.log(`✅ Migration created: ${version}`);
    console.log('📝 Edit the migration file to add your SQL statements');
    
  } finally {
    await manager.cleanup();
  }
}

async function resetDatabase() {
  if (process.env.NODE_ENV === 'production') {
    console.error('❌ Database reset is not allowed in production');
    process.exit(1);
  }

  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();

  try {
    // Drop all tables
    await prisma.$executeRaw`
      DO $$ DECLARE
        r RECORD;
      BEGIN
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema()) LOOP
          EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
        END LOOP;
      END $$;
    `;

    console.log('🗑️ All tables dropped');

    // Run migrations from scratch
    await migrate();
    
    console.log('✅ Database reset complete');
    
  } finally {
    await prisma.$disconnect();
  }
}

async function seedDatabase() {
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();

  try {
    console.log('🌱 Starting database seeding...');

    // Create admin user
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@hospital.com' },
      update: {},
      create: {
        email: 'admin@hospital.com',
        password: '$2b$10$hashedpassword', // Should be properly hashed
        firstName: 'System',
        lastName: 'Administrator',
        role: 'ADMIN',
        department: 'IT',
        isActive: true,
      },
    });

    console.log('👤 Admin user created');

    // Create sample service items
    const consultationService = await prisma.serviceItem.upsert({
      where: { code: 'OPD_CONSULTATION' },
      update: {},
      create: {
        code: 'OPD_CONSULTATION',
        name: 'OPD Consultation',
        description: 'Outpatient Department Consultation',
        category: 'CONSULTATION',
        unitPrice: 150.00,
        taxRate: 0.00,
        isActive: true,
      },
    });

    const labTests = [
      {
        code: 'CBC',
        name: 'Complete Blood Count',
        category: 'HEMATOLOGY',
        normalRange: 'WBC: 4.5-11.0, RBC: 4.0-5.5',
        unit: 'cells/μL',
      },
      {
        code: 'BMP',
        name: 'Basic Metabolic Panel',
        category: 'CHEMISTRY',
        normalRange: 'Glucose: 70-100 mg/dL',
        unit: 'mg/dL',
      },
      {
        code: 'HBA1C',
        name: 'Hemoglobin A1c',
        category: 'CHEMISTRY',
        normalRange: '< 5.7%',
        unit: '%',
      },
    ];

    for (const test of labTests) {
      await prisma.labTest.upsert({
        where: { code: test.code },
        update: {},
        create: test,
      });
    }

    console.log('🧪 Lab tests created');

    // Create sample insurance provider
    await prisma.insuranceProvider.upsert({
      where: { code: 'SAMPLE_INSURANCE' },
      update: {},
      create: {
        name: 'Sample Insurance Company',
        code: 'SAMPLE_INSURANCE',
        address: '123 Insurance St, City, State',
        phone: '+1-800-INSURANCE',
        email: 'claims@sampleinsurance.com',
        contactPerson: 'Claims Manager',
        active: true,
      },
    });

    console.log('🏥 Insurance provider created');

    console.log('✅ Database seeding completed');

  } catch (error) {
    console.error('❌ Seeding error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

function showHelp() {
  console.log(`
🏥 Hospital Management System - Migration Tool

Usage: npm run migrate <command> [options]

Commands:
  up, migrate                 Run all pending migrations
  down, rollback [version]    Rollback to specific version or last migration
  status                      Show migration status
  create <name>               Create a new migration
  reset                       Reset database (development only)
  seed                        Seed database with sample data

Examples:
  npm run migrate up
  npm run migrate status
  npm run migrate create "add_patient_indexes"
  npm run migrate rollback
  npm run migrate rollback 2025-01-01T00-00-00_initial_schema
  npm run migrate reset
  npm run migrate seed

Environment Variables:
  DATABASE_URL               Database connection string
  NODE_ENV                   Environment (production prevents reset)

For more information, see: docs/database/migrations.md
  `);
}

if (require.main === module) {
  main();
}
