const mongoose = require('mongoose');

const customizationSchema = new mongoose.Schema({
  imageInterval: {
    type: Number,
    required: true,
    min: 1 // Assuming imageInterval should be at least 1
  },
  threshold: {
    type: Number,
    required: true,
    min: 0, // Assuming threshold is a percentage, so 0-100
    max: 100
  }
});

const Customization = mongoose.model('Customization', customizationSchema);

module.exports = Customization;
