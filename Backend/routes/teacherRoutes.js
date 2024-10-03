const express = require('express');
const teacherController = require('../controllers/teacherController');
const authMiddleware = require('../utils/authMiddleware');

const router = express.Router();


router.get('/my-classes', authMiddleware.protect, authMiddleware.restrictTo('teacher'), teacherController.getMyClasses);
router.get('/users/getStudents', authMiddleware.protect, authMiddleware.restrictTo('teacher'), teacherController.getStudents);
router.post('/users/getStudentsByClass', authMiddleware.protect, authMiddleware.restrictTo('teacher'), teacherController.getStudentsByClass);
router.get('/getMyClassesAttendance', authMiddleware.protect, authMiddleware.restrictTo('teacher'), teacherController.getAllCoursesAttendance);
// router.get('/class/:classId/emotions', authMiddleware.protect, authMiddleware.restrictTo('teacher'), teacherController.getClassEmotions);

module.exports = router;