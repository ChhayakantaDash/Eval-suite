require('dotenv').config();
const mongoose = require('mongoose');
const Jury = require('./models/Jury');
const Team = require('./models/Team');
const Config = require('./models/Config');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Jury.deleteMany({});
    await Team.deleteMany({});
    await Config.deleteMany({});
    console.log('Cleared existing data');

    // Create sample juries
    const juries = [
      { name: 'Jury Panel 1' },
      { name: 'Jury Panel 2' },
      { name: 'Jury Panel 3' },
      { name: 'Technical Jury' },
      { name: 'Industry Experts' }
    ];

    await Jury.insertMany(juries);
    console.log('Created sample juries');

    // Create sample teams
    const teams = [
      { name: 'Tech Innovators', category: 'Technology' },
      { name: 'Green Solutions', category: 'Environment' },
      { name: 'Health Heroes', category: 'Healthcare' },
      { name: 'EduTech Pioneers', category: 'Education' },
      { name: 'FinTech Warriors', category: 'Finance' },
      { name: 'AI Minds', category: 'Artificial Intelligence' },
      { name: 'Blockchain Builders', category: 'Blockchain' },
      { name: 'IoT Creators', category: 'Internet of Things' },
      { name: 'Data Scientists', category: 'Data Science' },
      { name: 'Mobile Makers', category: 'Mobile Apps' }
    ];

    await Team.insertMany(teams);
    console.log('Created sample teams');

    // Create default configuration
    const config = new Config({
      criteriaList: ['Innovation', 'Creativity', 'Feasibility', 'Presentation'],
      maxMarksPerCriterion: 20,
      competitionName: 'Inter-College Tech Competition 2024',
      collegeName: 'ABC College of Technology',
      clubName: 'Tech Innovation Club'
    });

    await config.save();
    console.log('Created default configuration');

    console.log('✅ Sample data seeded successfully!');
    console.log(`📊 Created ${juries.length} juries and ${teams.length} teams`);
    
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the seed function
if (require.main === module) {
  seedData();
}

module.exports = seedData;