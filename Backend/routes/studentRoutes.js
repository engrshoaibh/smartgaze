const express = require('express');
const studentController = require('../controllers/studentController');

const authMiddleware = require('../utils/authMiddleware');

const router = express.Router();


router.get('/my-attendance', authMiddleware.protect, studentController.getMyAttendance);
router.get('/my-emotions', authMiddleware.protect, studentController.getMyEmotions);



module.exports =  router ;
