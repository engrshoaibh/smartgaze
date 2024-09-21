 
const Attendance = require('../models/Attendance');
const Emotion = require('../models/Emotion');

// Get the student's own attendance records
exports.getMyAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({ student: req.user._id });
    res.status(200).json({
      status: 'success',
      data: { attendance }
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

// Get the student's own emotion records
exports.getMyEmotions = async (req, res) => {
  try {
    const emotions = await Emotion.find({ student: req.user._id });
    res.status(200).json({
      status: 'success',
      data: { emotions }
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};
