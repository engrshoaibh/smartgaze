const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

module.exports = {
  databaseURL: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET ,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  port: process.env.PORT || 3000
};
