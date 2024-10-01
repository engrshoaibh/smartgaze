const Emotion = require('../models/Emotion');


exports.totalCountOfEmotions = async (req, res) => {
  try {
    const summary = await Emotion.aggregate([
      {
        $group: {
          _id: "$emotion",  // Group by emotion field
          count: { $sum: 1 }  // Count occurrences
        }
      }
    ]);

    res.json(summary); // Send the summary result to the frontend
  } catch (error) {
    console.error('Error fetching emotions summary', error);
    res.status(500).json({ error: 'Failed to fetch emotions summary' });
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
