const Attendance = require('../models/Attendance');
const Class = require('../models/Class');
const User = require('../models/User');

// Get attendance for a specific class on a given date
exports.getAttendanceByClassAndDate = async (req, res) => {
  try {
    const { classId, date } = req.params;

    const attendance = await Attendance.find({ class_id: classId, date: new Date(date) })
      .populate('class_id')
      .populate('teacher_id')
      .populate('studentsPresent')
      .populate('studentsAbsent');

    if (!attendance) {
      return res.status(404).json({ message: 'No attendance records found for this class and date' });
    }

    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attendance', error });
  }
};

// Get attendance for a specific student across classes and dates
exports.getAttendanceByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const attendanceRecords = await Attendance.find({ studentsPresent: studentId })
      .populate('class_id')
      .populate('teacher_id');

    if (!attendanceRecords || attendanceRecords.length === 0) {
      return res.status(404).json({ message: 'No attendance records found for this student' });
    }

    res.status(200).json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student attendance', error });
  }
};

// Mark attendance for a class on a specific date
exports.markAttendance = async (req, res) => {
  try {
    const { classId } = req.params;
    const { date, time, studentsPresent, studentsAbsent } = req.body;

    // Ensure the class exists
    const classObj = await Class.findById(classId);
    if (!classObj) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Ensure all students are valid
    const presentStudents = await User.find({ _id: { $in: studentsPresent }, role: 'student' });
    const absentStudents = await User.find({ _id: { $in: studentsAbsent }, role: 'student' });

    if (presentStudents.length !== studentsPresent.length || absentStudents.length !== studentsAbsent.length) {
      return res.status(400).json({ message: 'Some student IDs are invalid' });
    }

    // Mark attendance
    const newAttendance = new Attendance({
      class_id: classId,
      teacher_id: req.user._id, // Assuming the teacher is authenticated and their ID is in req.user
      date: new Date(date),
      time,
      present: studentsPresent.length,
      absent: studentsAbsent.length,
      studentsPresent,
      studentsAbsent,
    });

    await newAttendance.save();

    res.status(201).json({ message: 'Attendance marked successfully', attendance: newAttendance });
  } catch (error) {
    res.status(500).json({ message: 'Error marking attendance', error });
  }
};

// Get attendance for all students in a specific class
exports.getClassAttendance = async (req, res) => {
  try {
    const { classId } = req.params;

    const attendanceRecords = await Attendance.find({ class_id: classId })
      .populate('class_id')
      .populate('teacher_id')
      .populate('studentsPresent')
      .populate('studentsAbsent');

    if (!attendanceRecords || attendanceRecords.length === 0) {
      return res.status(404).json({ message: 'No attendance records found for this class' });
    }

    res.status(200).json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching class attendance', error });
  }
};

exports.getAttendance = async (req, res) => {
  try {

    const attendanceRecords = await Attendance.find()
      .populate('class_id')
      .populate('teacher_id')
      .populate('studentsPresent')
      .populate('studentsAbsent');

    if (!attendanceRecords || attendanceRecords.length === 0) {
      return res.status(404).json({ message: 'No attendance records found' });
    }

    res.status(200).json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching class attendance', error });
  }
};
// Get attendance summary for a specific student
exports.getStudentAttendanceSummary = async (req, res) => {
  try {
    const { studentId } = req.params;

    const totalPresent = await Attendance.countDocuments({ studentsPresent: studentId });
    const totalAbsent = await Attendance.countDocuments({ studentsAbsent: studentId });

    res.status(200).json({
      studentId,
      totalPresent,
      totalAbsent,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student attendance summary', error });
  }
};

