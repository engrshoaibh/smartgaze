 
const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  try {
    const { name, email, phoneNumber, password, role, classInfo, section, batch, department, profileImage } = req.body;

    // Prepare user data based on role
    let userData;
    if (role === 'student') {
      userData = {
        name,
        email,
        phoneNumber,
        password,
        role,
        class: classInfo, // Class, Section, and Batch for students
        section,
        batch,
        profilePic: profileImage // Add profile image to user data
      };
    } else if (role === 'teacher') {
      userData = {
        name,
        email,
        phoneNumber,
        password,
        role,
        department, // Department for teachers
        profilePic: profileImage // Add profile image to user data
      };
    } else {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid role. Must be either "student" or "teacher".'
      });
    }

    // Create the new user
    const newUser = await User.create(userData);

    // Respond with success
    res.status(201).json({
      status: 'success',
      data: { user: newUser }
    });

  } catch (err) {
    // Handle error during signup
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({ status: 'fail', message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ status: 'success', token, user });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};
