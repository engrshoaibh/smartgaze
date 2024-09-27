const User = require('../models/User');
const Customization = require('../models/Customization');

//customizations
exports.customizations = async (req, res) => {
  try {
    const { imageInterval, threshold } = req.body;

    // Find the first document (assuming there's only one) and update it, or create a new one if it doesn't exist
    const updatedCustomization = await Customization.findOneAndUpdate(
      {}, // Empty filter to find the first (and only) document
      { imageInterval, threshold }, // Fields to update
      { new: true, upsert: true } // Create if not exists, return the updated document
    );

    // If the customization was updated successfully, return the updated document
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
