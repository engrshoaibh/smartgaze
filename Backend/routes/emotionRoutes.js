const express = require('express');
const emotionController = require('../controllers/emotionController');
const authMiddleware = require('../utils/authMiddleware');

const router = express.Router();

router.post('/mark', authMiddleware.protect, authMiddleware.restrictTo('teacher', 'admin'), emotionController.markEmotion);
router.get('/class/:classId', authMiddleware.protect, emotionController.getClassEmotions);

module.exports = router;
