const User = require('../models/User');
const Class = require('../models/Class');
const Customization = require('../models/Customization');

// Dashboard Stats Function (formerly in mainDashboardController)
exports.getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalTeachers = await User.countDocuments({ role: 'teacher' });
    const totalAdmins = await User.countDocuments({role: 'admin'})
    const totalClasses = await Class.countDocuments();

    return res.status(200).json({
      students: totalStudents,
      teachers: totalTeachers,
      admins: totalAdmins,
      classes: totalClasses,

    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return res.status(500).json({ message: 'Error fetching dashboard stats' });
  }
};

// Existing Functions in adminController
exports.customizations = async (req, res) => {
  try {
    const { imageInterval, threshold } = req.body;

    const updatedCustomization = await Customization.findOneAndUpdate(
      {},
      { imageInterval, threshold },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      message: 'Customization updated successfully',
      customization: updatedCustomization,
    });
  } catch (error) {
    console.error('Error updating customization:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getCustomizations = async (req, res) => {
  try {
    const customizations = await Customization.findOne();
    return res.status(200).json({
      message: 'Customization get successfully',
      customization: customizations,
    });
  } catch (error) {
    console.error('Error getting customization:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher' });
    res.status(200).json({
      status: 'success',
      data: { teachers }
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: ['teacher','student'] });
    res.status(200).json({
      status: 'success',
      data: { users }
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

// Get a single user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ status: 'fail', message: 'User not found' });
    }
    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

// Update user details
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!user) {
      return res.status(404).json({ status: 'fail', message: 'User not found' });
    }
    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ status: 'fail', message: 'User not found' });
    }
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};
