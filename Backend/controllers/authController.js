
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
exports.signup = async (req, res) => {
  try {
    const { name, email, phoneNumber, password, role, classInfo, section, batch, department, profileImage } = req.body;


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
    // Setup Nodemailer transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
          user: 'gaze.smart1@gmail.com',
          pass: 'smartgaze@123'
      }
  });
    

    // Email options
    const mailOptions = {
      from: 'gaze.smart1@gmail.com',
      to: newUser.email, 
      subject: 'Welcome to Our Service',
      text: `Hello ${newUser.name},\n\nYour account has been created successfully.\n\nYour credentials are:\nEmail: ${newUser.email}\nPassword: ${password}\n\nPlease keep this information safe.\n\nThank you for joining us!`,
      html: `<p>Hello ${newUser.name},</p>
         <p>Your account has been created successfully.</p>
         <p>Your credentials are:</p>
         <p>Email: <strong>${newUser.email}</strong><br>Password: <strong>${password}</strong></p>
         <p>Please keep this information safe.</p>
         <p>Thank you for joining us!</p>`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

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
