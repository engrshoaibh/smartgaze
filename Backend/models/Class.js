const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Predefined time slots
const timeSlots = [
  '08:00 - 09:00',
  '09:00 - 10:00',
  '10:00 - 11:00',
  '11:00 - 12:00',
  '12:00 - 01:00',
  '01:00 - 02:00',
  '02:00 - 03:00',
  '03:00 - 04:00',
  '04:00 - 05:00',
];

const classSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  }, // Class Name
  section: { 
    type: String, 
    required: true 
  }, // Section Name
  courses: [
    {
      courseCode: { 
        type: String, 
        required: true, 
        trim: true 
      }, // Course Code
      courseName: { 
        type: String, 
        required: true, 
        trim: true 
      }, // Course Name
      students: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Student' // Reference to students enrolled in this course
        }
      ]
    }
  ],
  description: { 
    type: String 
  }, // Class Description
  teacher: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }, // Assigned Teacher
  schedule: [
    {
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        required: true
      }, // Day of the week
      timeSlot: {
        type: String,
        enum: timeSlots, // Use the predefined time slots
        required: true
      }, // Predefined time slot
      courseCode: { 
        type: String, 
        required: true 
      },
      courseName: { 
        type: String, 
        required: true 
      } 
    }
  ]
}, { timestamps: true });

classSchema.pre('save', function (next) {
  const classInstance = this;

  // Check for schedule conflicts
  const scheduleMap = new Map();

  classInstance.schedule.forEach((entry) => {
    const key = `${entry.day}-${entry.timeSlot}`;

    if (scheduleMap.has(key)) {
      const error = new Error(`Schedule conflict: Course ${entry.courseCode} is already scheduled on ${entry.day} at ${entry.timeSlot}`);
      return next(error);
    }
    scheduleMap.set(key, true);
  });

  next();
});

module.exports = mongoose.model('Class', classSchema);
