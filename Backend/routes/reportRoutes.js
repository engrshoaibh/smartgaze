 const express = require('express');
const reportController = require('../controllers/reportController');
const authMiddleware = require('../utils/authMiddleware');

const router = express.Router();

router.get('/class/:classId/attendance', authMiddleware.protect, reportController.getClassAttendanceReport);
router.get('/class/:classId/emotions', authMiddleware.protect, reportController.getClassEmotionReport);

module.exports = router;
