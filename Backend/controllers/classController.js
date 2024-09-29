 
const Class = require('../models/Class');

exports.createClass = async (req, res) => {
  try {
    const newClass = await Class.create(req.body);
    res.status(201).json({
      status: 'success',
      data: { class: newClass }
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.getClassDetails = async (req, res) => {
  try {
    const classDetails = await Class.findById(req.params.id)
      .populate('teacher students');
    res.status(200).json({ status: 'success', data: { class: classDetails } });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: 'Class not found' });
  }
};

// Add a student to a course in a class
exports.addStudentToCourse = async (req, res) => {
  const { id, courseCode } = req.params;
  const { studentId } = req.body;  // Expecting studentId in the request body

  try {
    const classInstance = await Class.findById(id);

    if (!classInstance) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Find the course by courseCode
    const course = classInstance.courses.find(c => c.courseCode === courseCode);

    if (!course) {
      return res.status(404).json({ message: 'Course not found in this class' });
    }

    // Check if the student is already enrolled
    if (course.students.includes(studentId)) {
      return res.status(400).json({ message: 'Student is already enrolled in this course' });
    }

    // Add student to the course
    course.students.push(studentId);
    await classInstance.save();

    res.status(200).json({
      message: 'Student added to the course successfully',
      course
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding student to course', error: error.message });
  }
};

// Remove a student from a course in a class
exports.removeStudentFromCourse = async (req, res) => {
  const { id, courseCode, studentId } = req.params;

  try {
    const classInstance = await Class.findById(id);

    if (!classInstance) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Find the course by courseCode
    const course = classInstance.courses.find(c => c.courseCode === courseCode);

    if (!course) {
      return res.status(404).json({ message: 'Course not found in this class' });
    }

    // Check if the student is enrolled
    if (!course.students.includes(studentId)) {
      return res.status(400).json({ message: 'Student is not enrolled in this course' });
    }

    // Remove the student from the course
    course.students = course.students.filter(s => s.toString() !== studentId);
    await classInstance.save();

    res.status(200).json({
      message: 'Student removed from the course successfully',
      course
    });
  } catch (error) {
    res.status(500).json({ message: 'Error removing student from course', error: error.message });
  }
};

exports.createOrUpdateSchedule = async (req, res) => {
  const { id } = req.params;
  const { courseCode,courseName, day, timeSlot } = req.body;

  try {
      // Find the class instance
      const classInstance = await Class.findById(id);

      if (!classInstance) {
          return res.status(404).json({ message: 'Class not found' });
      }


      const hasConflict = classInstance.schedule.some(scheduleEntry => 
          scheduleEntry.day === day && scheduleEntry.timeSlot === timeSlot
      );

      if (hasConflict) {
          return res.status(400).json({ message: `Conflict: A course is already scheduled on ${day} at ${timeSlot}` });
      }

      // Add the new schedule entry
      classInstance.schedule.push({ courseCode,courseName, day, timeSlot });

      // Save the class instance to trigger the pre-save hook
      await classInstance.save();

      res.status(200).json({ message: 'Schedule updated successfully', updatedClass: classInstance });
  } catch (error) {
      res.status(500).json({ message: 'Error updating schedule', error: error.message });
  }
};



exports.getCourseSchedule = async (req, res) => {
  const { id, courseCode } = req.params; // Extract classId and courseCode from request params

  try {
    const classInstance = await Class.findById(id).exec();

    if (!classInstance) {
      return res.status(404).json({ message: 'Class not found' });
    }
    const courseSchedules = classInstance.schedule.filter(schedule => schedule.courseCode === courseCode);

    if (courseSchedules.length === 0) {
      return res.status(404).json({ message: `No schedule found for course code ${courseCode}` });
    }
    res.status(200).json(courseSchedules);
  } catch (error) {
    console.error('Error fetching course schedules:', error);
    res.status(500).json({ message: 'Error fetching course schedules', error });
  }
};