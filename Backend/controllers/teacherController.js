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

exports.getStudentsByClass = async (req, res) => {


  try {
    const className = req.body.className;
    const students = await User.find({ class: className, role: 'student' });
    res.status(200).json({
      status: 'success',
      data: { students }
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};


// Get attendance for a all classes assigned to teacher

exports.getAllCoursesAttendance = async (req, res) => {
  try {
    const teacher_id = req.user._id;
    const attendanceRecords = await Attendance.find({teacher_id})
      .populate('studentsPresent')
      .populate('studentsAbsent');

    if (!attendanceRecords || attendanceRecords.length === 0) {
      return res.status(404).json({ message: 'No attendance records found' });
    }

    res.status(200).json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching class attendance', error });
  }
}
