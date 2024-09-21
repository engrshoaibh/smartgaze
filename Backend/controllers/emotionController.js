const Emotion = require('../models/Emotion');

// Mark emotional state for a student in a class
exports.markEmotion = async (req, res) => {
  try {
    const emotion = await Emotion.create(req.body);
    res.status(201).json({
      status: 'success',
      data: { emotion }
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

// Get emotional states for a class
exports.getClassEmotions = async (req, res) => {
  try {
    const emotions = await Emotion.find({ class: req.params.classId });
    res.status(200).json({
      status: 'success',
      data: { emotions }
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};
