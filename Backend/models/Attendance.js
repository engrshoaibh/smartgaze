const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  class_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',  // Reference to the Class model
    required: true,
  },
  teacher_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Reference to the User model (role: teacher)
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  timeSlot: {
    type: String,
    required: true,
  },
  present: {
    type: Number,
    required: true,
    default: 0,
  },
  absent: {
    type: Number,
    required: true,
    default: 0,
  },
  // List of student IDs (role: student) who were present
  studentsPresent: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  // Reference to the User model (role: student)
    },
  ],
  // List of student IDs (role: student) who were absent
  studentsAbsent: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  // Reference to the User model (role: student)
    },
  ],
});

// Indexes to optimize queries
attendanceSchema.index({ class_id: 1, date: 1, time: 1 }); // Index on class_id, date, and time for faster querying

module.exports = mongoose.model('Attendance', attendanceSchema);
