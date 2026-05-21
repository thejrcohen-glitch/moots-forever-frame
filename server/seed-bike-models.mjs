#!/usr/bin/env node

/**
 * Seed script for Moots bike models
 * Run with: node seed-bike-models.mjs
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const BIKE_MODELS = [
  {
    modelId: 'routt_45',
    name: 'Routt 45',
    category: 'gravel',
    description: 'The workhorse gravel bike. 45mm tire clearance, 1x drivetrain optimized, perfect for high-speed gravel and light bikepacking.',
    useCase: 'Fast gravel, light bikepacking',
    terrainFocus: 'High-speed gravel, fire roads',
    keyFeatures: '45mm tire clearance, 1x optimized, lightweight titanium',
  },
  {
    modelId: 'routt_rsl',
    name: 'Routt RSL',
    category: 'gravel',
    description: 'Race-spec gravel bike. Lightweight titanium, aggressive geometry, 40mm tire clearance. Built for UCI gravel racing.',
    useCase: 'Racing, speed-focused gravel',
    terrainFocus: 'Gravel races, fast terrain',
    keyFeatures: 'Lightweight, aggressive geometry, 40mm tires',
  },
  {
    modelId: 'routt_60',
    name: 'Routt 60',
    category: 'adventure',
    description: 'Adventure and bikepacking specialist. 60mm tire clearance, 2x drivetrain, rack mounts. The ultimate long-range titanium bike.',
    useCase: 'Bikepacking, adventure, touring',
    terrainFocus: 'Mixed terrain, long-distance',
    keyFeatures: '60mm tire clearance, 2x drivetrain, rack mounts',
  },
  {
    modelId: 'vamoots_rsl',
    name: 'Vamoots RSL',
    category: 'gravel',
    description: 'Women-specific race gravel bike. Optimized geometry for female riders, 40mm tire clearance, race-ready.',
    useCase: 'Women\'s racing, speed-focused',
    terrainFocus: 'Gravel races, fast terrain',
    keyFeatures: 'Women-specific geometry, lightweight, 40mm tires',
  },
  {
    modelId: 'psychlo_x_rsl',
    name: 'Psychlo X RSL',
    category: 'gravel',
    description: 'Cross-country mountain bike on titanium. Aggressive geometry, 50mm+ tire clearance, full suspension compatible.',
    useCase: 'Cross-country, technical gravel',
    terrainFocus: 'Technical terrain, singletrack',
    keyFeatures: 'Aggressive geometry, 50mm+ tires, XC focused',
  },
  {
    modelId: 'scrambler',
    name: 'Scrambler',
    category: 'adventure',
    description: 'Monster cross machine. Combines road speed with off-road capability. 50mm+ tire clearance, slack geometry.',
    useCase: 'Monster cross, adventure',
    terrainFocus: 'Mixed terrain, technical gravel',
    keyFeatures: 'Monster cross geometry, 50mm+ tires, slack angles',
  },
];

async function seedBikeModels() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'moots',
  });

  try {
    console.log('🚀 Seeding bike models...');

    for (const model of BIKE_MODELS) {
      await connection.execute(
        `INSERT INTO bike_models (modelId, name, category, description, useCase, terrainFocus, keyFeatures) 
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE 
         name = VALUES(name),
         category = VALUES(category),
         description = VALUES(description),
         useCase = VALUES(useCase),
         terrainFocus = VALUES(terrainFocus),
         keyFeatures = VALUES(keyFeatures)`,
        [
          model.modelId,
          model.name,
          model.category,
          model.description,
          model.useCase,
          model.terrainFocus,
          model.keyFeatures,
        ]
      );

      console.log(`✓ Seeded ${model.name}`);
    }

    console.log('✅ Bike models seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding bike models:', error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

seedBikeModels();
