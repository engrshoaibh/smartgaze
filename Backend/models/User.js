const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
// Schema for User
// Schema for User
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'teacher', 'student'], required: true },
  profilePic: String,  
  
  // New field for Roll Number
  rollno: { type: String, unique: true },  // Unique Roll Number
  
  // Student-specific fields
  class: { type: String },  
  section: { type: String }, 
  batch: { type: String },   
  
  // Teacher-specific fields
  department: { type: String }, 
  
  // Reference to Class Schema
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
