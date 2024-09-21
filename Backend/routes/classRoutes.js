const express = require('express');
const classController = require('../controllers/classController');
const authMiddleware = require('../utils/authMiddleware');

const router = express.Router();

router.post('/create', authMiddleware.protect, classController.createClass);
router.get('/:id', authMiddleware.protect, classController.getClassDetails);

module.exports = router;
