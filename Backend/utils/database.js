const mongoose = require('mongoose');
const config = require('../config/config');

// Connect to the database
const connectDatabase = async () => {
  try {
    await mongoose.connect(config.databaseURL, {
    });
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDatabase;
