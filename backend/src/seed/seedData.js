require('dotenv').config();
const mongoose = require('mongoose');
const Precedent = require('../models/Precedent');
const precedentsData = require('./commercialPrecedents.json');

const seedDatabase = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/legal_research_db';

  try {
    await mongoose.connect(mongoURI);
    console.log('[Seed] Connected to MongoDB for seeding...');

    await Precedent.deleteMany({});
    console.log('[Seed] Cleared existing Precedents collection.');

    const created = await Precedent.insertMany(precedentsData);
    console.log(`[Seed] Successfully seeded ${created.length} commercial dispute precedents!`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error.message);
    process.exit(1);
  }
};

seedDatabase();

