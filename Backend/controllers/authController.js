
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { mailSender } = require('../utils/mailSender');

function generatePassword() {
  const part1 = Math.floor(1000 + Math.random() * 9000).toString();
  const part2 = Math.floor(100 + Math.random() * 900).toString();
  const password = `${part1}-${part2}`; // Fixed template string syntax
  return password;
}
exports.signup = async (req, res) => {
  try {
    const {
      name,
      email,
      phoneNumber,
      password,
      role,
      classInfo,
      section,
      batch,
      department,
      profileImage
    } = req.body;

    let userData;

    // Check if the user already exists based on email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'fail',
        message: 'User with this email already exists.'
      });
    }

    if (role === 'student') {
      // 1. Count existing students
      const studentCount = await User.countDocuments({ role: 'student' });

      // 2. Generate new Rollno (increment by 1)
      const newRollnoNumber = studentCount + 1; // Rollno starts from 1
      const formattedRollno = String(newRollnoNumber).padStart(3, '0'); // Format Rollno to 3 digits

      // 3. Create StudentID
      const studentID = `${batch.toUpperCase()}-${classInfo.toUpperCase()}-${formattedRollno}`;

      userData = {
        name,
        email,
        phoneNumber,
        password,
        role,
        class: classInfo,
        section,
        batch,
        department,
        rollno: studentID, 
        profilePic: profileImage || 'default_profile_pic.png' // Add default profile image if none provided
      };
    } else if (role === 'teacher') {
      // Don't include rollno for teachers
      userData = {
        name,
        email,
        phoneNumber,
        password,
        role,
        department,
        profilePic: profileImage || 'default_profile_pic.png' // Add default profile image if none provided
      };
      console.log("Teacher Data", userData);

    } else {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid role. Must be either "student" or "teacher".'
      });
    }

    // Create the new user
    const newUser = await User.create(userData);

    // Prepare mail options
    let mailOptions;

    if (role === 'student') {
      mailOptions = {
        from: process.env.EMAIL_USER,
        to: newUser.email,
        subject: 'Welcome to Our Service',
        text: `Hello ${newUser.name},\n\nYour account has been created successfully.\n\nYour credentials are:\nEmail: ${newUser.email}\nPassword: ${password}\nYour Roll Number: ${newUser.rollno}\n\nPlease keep this information safe.\n\nThank you for joining us!`,
        html: `<p>Hello ${newUser.name},</p>
               <p>Your Smart Gaze credentials are:</p>
               <p>Email: <strong>${newUser.email}</strong><br>Password: <strong>${password}</strong><br>Roll Number: <strong>${newUser.rollno}</strong></p>
               <p>Please keep this information safe.</p>
               <p>Thank you for joining us!</p>`,
      };
    } else if (role === 'teacher') {
      mailOptions = {
        from: process.env.EMAIL_USER,
        to: newUser.email,
        subject: 'Welcome to Our Service',
        text: `Hello ${newUser.name},\n\nYour account has been created successfully.\n\nYour credentials are:\nEmail: ${newUser.email}\nPassword: ${password}\n\nPlease keep this information safe.\n\nThank you for joining us!`,
        html: `<p>Hello ${newUser.name},</p>
               <p>Your Smart Gaze credentials are:</p>
               <p>Email: <strong>${newUser.email}</strong><br>Password: <strong>${password}</strong></p>
               <p>Please keep this information safe.</p>
               <p>Thank you for joining us!</p>`,
      };
    }

    await mailSender(mailOptions);

    // Respond with success
    res.status(201).json({
      status: 'success',
      data: { user: newUser }
    });

  } catch (err) {
    // Handle error during signup
    console.error('Signup error:', err); // Log error details for debugging
    res.status(400).json({
      status: 'fail',
      message: 'An error occurred during signup. Please try again later.'
    });
  }
};




exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password)
    let user;

    // If email contains '@', treat it as an email, otherwise, it's rollno
    if (email.includes('@')) {
      // Admin and Teacher login via email
      user = await User.findOne({ email });

      if (!user || !(await user.correctPassword(password, user.password))) {
        return res.status(401).json({
          status: 'fail',
          message: 'Invalid email or password',
        });
      }

      // Ensure role-based login (admin/teacher should use email)
      if (user.role === 'student') {
        return res.status(400).json({
          status: 'fail',
          message: 'Students must log in using roll number',
        });
      }
    } else {
      // Student login via rollno
      const rollno = email; // If it's not an email, treat the input as rollno
      user = await User.findOne({ rollno });

      if (!user || !(await user.correctPassword(password, user.password))) {
        return res.status(401).json({
          status: 'fail',
          message: 'Invalid roll number or password',
        });
      }

      // Ensure role-based login (students should use roll number)
      if (user.role !== 'student') {
        return res.status(400).json({
          status: 'fail',
          message: 'Admins and teachers must log in using email, not roll number',
        });
      }
    }


    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });


    res.status(200).json({
      status: 'success',
      token,
      user,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        status: 'fail',
        message: 'User not Found',
      });
    }

    const newPassword = generatePassword();

    user.password = newPassword;

    await user.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Your Password Has Been Reset',
      text: `Your new password is: ${newPassword}.`,
    };

    await mailSender(mailOptions);

    res.status(200).json({
      status: 'success'
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
};

