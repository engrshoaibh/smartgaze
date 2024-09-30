const express = require('express');
const adminController = require('../controllers/adminController');
const authMiddleware = require('../utils/authMiddleware');

const router = express.Router();

router.get('/users/getTeachers', authMiddleware.protect, authMiddleware.restrictTo('admin'), adminController.getTeachers);
router.post('/users/customizations', authMiddleware.protect, authMiddleware.restrictTo('admin'), adminController.customizations);
router.get('/users/getCustomizations', authMiddleware.protect, authMiddleware.restrictTo('admin'), adminController.getCustomizations);
router.get('/users/:id', authMiddleware.protect, authMiddleware.restrictTo('admin'), adminController.getUserById);
router.put('/users/:id', authMiddleware.protect, authMiddleware.restrictTo('admin'), adminController.updateUser);
router.delete('/users/:id', authMiddleware.protect, authMiddleware.restrictTo('admin'), adminController.deleteUser);
router.get('/dashboardStats', adminController.getDashboardStats);

module.exports = router;
