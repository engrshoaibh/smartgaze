const Class = require('../models/Class');
const Attendance = require('../models/Attendance');
const Emotion = require('../models/Emotion');

// Get all classes of the logged-in teacher
exports.getMyClasses = async (req, res) => {
  try {
    const classes = await Class.find({ teacher: req.user._id });
    res.status(200).json({
      status: 'success',
      data: { classes }
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

// Get attendance for a class
exports.getClassAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({ class: req.params.classId });
    res.status(200).json({
      status: 'success',
      data: { attendance }
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

// Get emotions for a class
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
