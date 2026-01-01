const mongoose = require('mongoose');
const Journal = require('../models/Journal');
const Art = require('../models/Art');
const Verse = require('../models/Verse');
const journalSeed = require('./journal.json');
const artSeed = require('./art.json');
const verseSeed = require('./verses.json');
const dotenv = require('dotenv');

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/my_journal');
    console.log('Connected to MongoDB for seeding...');
    
    await Journal.deleteMany({});
    await Art.deleteMany({});
    await Verse.deleteMany({});
    console.log('Cleared existing entries.');
    
    await Journal.insertMany(journalSeed);
    await Art.insertMany(artSeed);
    await Verse.insertMany(verseSeed);
    console.log('Successfully seeded all data!');
    
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
