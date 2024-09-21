const express = require('express');
const attendanceController = require('../controllers/attendanceController.js');
const authMiddleware = require('../utils/authMiddleware');

const router = express.Router();

router.post('/mark', authMiddleware.protect, authMiddleware.restrictTo('teacher', 'admin'), attendanceController.markAttendance);
router.get('/class/:classId', authMiddleware.protect, attendanceController.getClassAttendance);

module.exports = router;
