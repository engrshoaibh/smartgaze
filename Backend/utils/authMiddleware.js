const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');

// Middleware to protect routes (JWT authentication)
exports.protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]; // Extract token from "Bearer <token>"
    }

    if (!token) {
      return res.status(401).json({ status: 'fail', message: 'You are not logged in!' });
    }

    // Verify the token
    const decoded = jwt.verify(token, config.jwtSecret);

    // Check if the user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({ status: 'fail', message: 'The user no longer exists.' });
    }

    // Grant access to the protected route
    req.user = currentUser;
    next();
  } catch (error) {
    res.status(401).json({ status: 'fail', message: 'Authentication failed!' });
  }
};

// Middleware to restrict access to specific roles (e.g., admin)
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles is an array, e.g., ['admin', 'teacher']
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ status: 'fail', message: 'You do not have permission to perform this action' });
    }
    next();
  };
};
