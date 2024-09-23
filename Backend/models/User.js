const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Schema for User
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phoneNumber: { type: String, required: true }, // New field for phone number
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'teacher', 'student'], required: true },
  profilePic: String,  
  
  // Student-specific fields
  class: { type: String },  // For class name
  section: { type: String }, // Section for students
  batch: { type: String },   // Batch for students
  
  // Teacher-specific fields
  department: { type: String }, // Department for teachers
  
  // Reference to Class Schema for teacher and student
  classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
});

// Encrypt password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Password check method
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model('User', userSchema);
