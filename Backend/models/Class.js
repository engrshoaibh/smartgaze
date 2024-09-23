const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Class Name
  section: { type: String, required: true }, // Section Name
  courseCode: { type: String, required: true }, // Course Code (e.g., CS301)
  courseName: { type: String, required: true }, // Course Name (e.g., Object-Oriented Programming)
  description: { type: String }, // Class Description
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Assigned Teacher
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Students enrolled in class
});

module.exports = mongoose.model('Class', classSchema);
