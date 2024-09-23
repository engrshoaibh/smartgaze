const express = require('express');
const adminController = require('../controllers/adminController');
const authMiddleware = require('../utils/authMiddleware');

const router = express.Router();

router.get('/users/getTeachers', authMiddleware.protect, authMiddleware.restrictTo('admin'), adminController.getTeachers);
router.get('/users/:id', authMiddleware.protect, authMiddleware.restrictTo('admin'), adminController.getUserById);
router.put('/users/:id', authMiddleware.protect, authMiddleware.restrictTo('admin'), adminController.updateUser);
router.delete('/users/:id', authMiddleware.protect, authMiddleware.restrictTo('admin'), adminController.deleteUser);

module.exports = router;
