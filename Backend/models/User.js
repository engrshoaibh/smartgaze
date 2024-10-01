
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'teacher', 'student'], required: true },
  profilePic: String,  

  // Conditional Roll Number: Only required for students
  rollno: {
    type: String,
    validate: {
      validator: function (value) {
        // Validate rollno only for students
        if (this.role === 'student' && !value) {
          return false;  // If role is student, rollno must be provided
        }
        return true;
      },
      message: 'Roll number is required for students.'
    }
  },
  
  // Student-specific fields
  class: { type: String },  
  section: { type: String }, 
  batch: { type: String },   
  
  // Teacher-specific fields
  department: { type: String }, 
   // Reference to Class Schema
   classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
});

// Create a partial index on rollno that enforces uniqueness only when rollno is not null
userSchema.index({ rollno: 1 }, { unique: true, partialFilterExpression: { rollno: { $exists: true, $ne: null } } });

// Combined pre('save') hook to handle both password encryption and removing rollno for teachers
userSchema.pre('save', async function (next) {
  // Remove rollno if the role is 'teacher'
  if (this.role === 'teacher') {
    this.rollno = undefined;
  }

  // Only hash the password if it has been modified (or is new)
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }

  next();
});

// Password check method
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model('User', userSchema);

 



