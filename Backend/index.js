const express = require('express');
const dotenv = require('dotenv');
const connectDatabase = require('./utils/database');
const config = require('./config/config');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const studentRoutes = require('./routes/studentRoutes')
const teacherRoutes = require('./routes/teacherRoutes')
const classRoutes = require('./routes/classRoutes');
const reportRoutes = require('./routes/reportRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const emotionRoutes = require('./routes/emotionRoutes');
const morgan = require('morgan');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware
// Increase payload size limit for incoming requests
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors()); 
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // Use Morgan logger in development
}

// Connect to the database
connectDatabase();

// Routes
app.use('/api/v1/auth', authRoutes); // Authentication routes
app.use('/api/v1/admin', adminRoutes); // Admin routes
app.use('/api/v1/student', studentRoutes); // Student routes
app.use('/api/v1/teacher', teacherRoutes); // Teacher routes
app.use('/api/v1/class', classRoutes); // Class management routes
app.use('/api/v1/report', reportRoutes); // Report routes for attendance and emotions
app.use('/api/v1/attendance', attendanceRoutes); // Attendance management routes
app.use('/api/v1/emotion', emotionRoutes); // Emotion management routes

// Fallback route for 404 Not Found
app.all('*', (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server`
  });
});

// Start the server
const PORT = config.port || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
