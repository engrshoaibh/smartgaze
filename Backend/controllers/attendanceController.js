const Attendance = require('../models/Attendance');

// Mark attendance for a class (by teacher or admin)
exports.markAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.create(req.body);
    res.status(201).json({
      status: 'success',
      data: { attendance }
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

// Get all attendance for a class
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
