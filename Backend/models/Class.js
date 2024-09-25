const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Class Name
  section: { type: String, required: true }, // Section Name
  courseCodes: [{ type: String, required: true }], // Array of Course Codes (e.g., ['CS101', 'CS201'])
  courseNames: [{ type: String, required: true }], // Array of Course Names (e.g., ['Introduction to Computer Science', 'Data Structures'])
  description: { type: String }, // Class Description
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Assigned Teacher
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Students enrolled in class
});

module.exports = mongoose.model('Class', classSchema);
