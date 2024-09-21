const express = require('express');
const teacherController = require('../controllers/teacherController');
const authMiddleware = require('../utils/authMiddleware');

const router = express.Router();


router.get('/my-classes', authMiddleware.protect, authMiddleware.restrictTo('teacher'), teacherController.getMyClasses);
router.get('/class/:classId/attendance', authMiddleware.protect, authMiddleware.restrictTo('teacher'), teacherController.getClassAttendance);
router.get('/class/:classId/emotions', authMiddleware.protect, authMiddleware.restrictTo('teacher'), teacherController.getClassEmotions);

module.exports = router;