const express = require('express');
const adminController = require('../controllers/adminController');
const authMiddleware = require('../utils/authMiddleware');

const router = express.Router();

router.post('/create-user', authMiddleware.protect, authMiddleware.restrictTo('admin'), adminController.createUser);
router.get('/users', authMiddleware.protect, authMiddleware.restrictTo('admin'), adminController.getAllUsers);
router.get('/users/:id', authMiddleware.protect, authMiddleware.restrictTo('admin'), adminController.getUserById);
router.put('/users/:id', authMiddleware.protect, authMiddleware.restrictTo('admin'), adminController.updateUser);
router.delete('/users/:id', authMiddleware.protect, authMiddleware.restrictTo('admin'), adminController.deleteUser);

module.exports = router;
