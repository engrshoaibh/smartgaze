const Class = require('../models/Class');
const Attendance = require('../models/Attendance');
const Emotion = require('../models/Emotion');
const User = require('../models/User');
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

exports.getStudents = async (req, res) => {
  try {
    const student = await User.find({ role: 'student' });
    res.status(200).json({
      status: 'success',
      data: { student }
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

//Add Student to Class

exports.addStudentToClass = async (req, res) => {
  try {
    const classId = req.params.classId;
    const { studentId } = req.body;

    console.log(`Class ID: ${classId}, Student ID: ${studentId}`); // Log IDs for debugging

    const updatedClass = await Class.findByIdAndUpdate(
      classId,
      { $addToSet: { students: studentId } },
      { new: true }
    );

    if (!updatedClass) {
      return res.status(404).json({ status: 'fail', message: 'Class not found' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Student added to class successfully',
      data: { updatedClass }
    });
  } catch (err) {
    console.error('Error adding student to class:', err); // Log error for debugging
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
