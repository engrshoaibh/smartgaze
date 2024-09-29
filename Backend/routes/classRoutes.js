const express = require('express');
const classController = require('../controllers/classController');
const authMiddleware = require('../utils/authMiddleware');

const router = express.Router();

// Class routes
router.post('/create', authMiddleware.protect, classController.createClass);  // Create class
router.get('/:id', authMiddleware.protect, classController.getClassDetails);  // Get class details

// Schedule routes
router.post('/:id/schedule', authMiddleware.protect, classController.createOrUpdateSchedule);  // Create or update schedule
router.get('/:id/schedule/:courseCode', authMiddleware.protect, classController.getCourseSchedule);  
// Add and remove students from course
router.post('/:id/courses/:courseCode/students', authMiddleware.protect, classController.addStudentToCourse);  // Add student to course
router.delete('/:id/courses/:courseCode/students/:studentId', authMiddleware.protect, classController.removeStudentFromCourse);  // Remove student from course

module.exports = router;
