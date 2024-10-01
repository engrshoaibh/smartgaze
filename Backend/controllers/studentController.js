 
const Attendance = require('../models/Attendance');
const Emotion = require('../models/Emotion');
const Class = require('../models/Class')
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

exports.getEnrolledCoursesCount = async (req, res) => {
  try {
    // Find courses where the student is enrolled
    const studentId = req.user._id;  
    const courses = await Class.find({ "courses.students": studentId });

    // Count the number of courses found
    const enrolledCoursesCount = courses.length;

    res.status(200).json({
      status: 'success',
      data: {
        enrolledCoursesCount,
        courses,  // Optionally return the courses as well
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};
