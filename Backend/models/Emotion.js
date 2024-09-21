 
const mongoose = require('mongoose');

const emotionSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  emotion: { 
    type: String, 
    enum: ['happiness', 'sadness', 'anger', 'surprise', 'disgust', 'fear', 'neutral'],
    required: true
  },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Emotion', emotionSchema);
