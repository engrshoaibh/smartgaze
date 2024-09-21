const Attendance = require('../models/Attendance');
const Emotion = require('../models/Emotion');

// Get class attendance report (for admin or teacher)
exports.getClassAttendanceReport = async (req, res) => {
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

// Get class emotion report (for admin or teacher)
exports.getClassEmotionReport = async (req, res) => {
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
