const express = require('express');
const attendanceController = require('../controllers/attendanceController.js');
const authMiddleware = require('../utils/authMiddleware');

const router = express.Router();

// Route to mark attendance for a specific class
router.post('/mark/class/:classId', authMiddleware.protect, authMiddleware.restrictTo('teacher', 'admin'), attendanceController.markAttendance);

router.get('/getAttendance', authMiddleware.protect, attendanceController.getAttendance);


// Route to get attendance records for a specific student
router.get('/student/:studentId', authMiddleware.protect, attendanceController.getAttendanceByStudent);


// Route to get attendance summary for a specific student
router.get('/student/:studentId/summary', authMiddleware.protect, attendanceController.getStudentAttendanceSummary);

//totalCountOfAttendance
router.get('/totalCountOfAttendance', authMiddleware.protect, attendanceController.totalCountOfAttendance);

module.exports = router;
