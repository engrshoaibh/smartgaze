const express = require('express');
const emotionController = require('../controllers/emotionController');
const authMiddleware = require('../utils/authMiddleware');

const router = express.Router();

router.get('/totalCountOfEmotions', authMiddleware.protect, authMiddleware.restrictTo('teacher', 'admin'), emotionController.totalCountOfEmotions);
router.get('/class/:classId', authMiddleware.protect, emotionController.getClassEmotions);

module.exports = router;
