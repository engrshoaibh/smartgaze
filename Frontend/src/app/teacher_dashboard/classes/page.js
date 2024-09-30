"use client";
import React, { useEffect } from 'react';
import { FaTrashAlt, FaPlusCircle, FaCalendar } from 'react-icons/fa'; // Importing icons
import Sidebar from '../components/side_nav';
import Header from '../../components/header';
import { getAssignedClasses, getStudentsByClass, addStudentToCourse, removeStudentFromCourse, createOrUpdateSchedule ,getCourseSchedule} from '../../../../../Backend/utils/api'; // Ensure you have this function

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="bg-white rounded-lg shadow-lg z-10 p-6 max-w-md w-full">
        <button onClick={onClose} className="text-gray-500 float-right">
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default function Classes() {
  const [classes, setClasses] = React.useState([]); // fetched Classes
  const [isAddRemoveModalOpen, setIsAddRemoveModalOpen] = React.useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = React.useState(false);
  const [students, setStudents] = React.useState([]); // fetched student saved here
  const [searchTerm, setSearchTerm] = React.useState('');
  const [course, setCourse] = React.useState('');
  const [currentClass, setCurrentClass] = React.useState('');
  const [selectedDay, setSelectedDay] = React.useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = React.useState('');


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


  useEffect(() => {
    const fetchClasses = async () => {
      const response = await getAssignedClasses();
      setClasses(response.data.classes);
      console.log("All Courses", response.data.classes);
    };

    fetchClasses();

  }, []);

  const fetchStudents = async (className) => {
    const response = await getStudentsByClass(className); // Fetch students by class name
    setStudents(response.data.students); // Assuming your API returns a students array
  };
  const fetchSchedules = async (classId, courseCode) => {
    
    const response = await getCourseSchedule(classId, courseCode);
    console.log(response[0]);
    
    setSelectedDay(response[0].day);
    setSelectedTimeSlot(response[0].timeSlot)
  }

  const handleManageStudents = (classItem, course) => {
    setCourse(course)
    setCurrentClass(classItem)

    fetchStudents(classItem.name);

    setIsAddRemoveModalOpen(true); // Open the modal
  };
  const AddStudent = async (student) => {
    const studentId = student._id;
    const classId = currentClass._id;
    const courseCode = course.courseCode;
    const response = await addStudentToCourse(classId, courseCode, studentId);

    if (response) {
      // Update the UI to show the student is added in real-time
      setCourse({
        ...course,
        students: [...course.students, studentId], // Add the new student ID to the course's students list
      });
    }
  };

  const RemoveStudent = async (student) => {
    const studentId = student._id;
    const classId = currentClass._id;
    const courseCode = course.courseCode;
    const response = await removeStudentFromCourse(classId, courseCode, studentId);

    if (response) {
      // Update the UI to show the student is removed in real-time
      setCourse({
        ...course,
        students: course.students.filter((id) => id !== studentId), // Remove the student ID from the course's students list
      });
    }
  };

  const handleManageScheduleCourse = (classItem, course) => {

    if (!classItem || !course) {
      console.error('Class or course information is missing.');
      return;
    }
  
    setCourse(course);
    setCurrentClass(classItem);
    fetchSchedules(classItem._id,course.courseCode);
    console.log('Selected Class:', classItem);
    console.log('Selected Course:', course);
  
    setIsScheduleModalOpen(true); // Open the modal for scheduling.
  };
  
  const createSchedule = async () => {
    // Ensure `currentClass` and `course` are available.
    if (!currentClass || !course) {
      console.error('Current class or course is missing.');
      return;
    }
  
    const classId = currentClass._id || currentClass.id; // Adjust for your actual data structure.
    const courseCode = course.courseCode;
    const courseName = course.courseName;
    if (!classId || !courseCode || !selectedDay || !selectedTimeSlot) {
      console.error('Missing schedule information.');
      return;
    }
  
    console.log('Creating schedule for:', {
      classId,
      courseCode,
      selectedDay,
      selectedTimeSlot,
    });
  
    try {
      const response = await createOrUpdateSchedule(classId, courseCode, courseName,selectedDay, selectedTimeSlot);
  
      if (response && response.success) {
        console.log('Schedule created successfully.');
        // Reset state after scheduling is successful.
        setSelectedDay('');
        setSelectedTimeSlot('');
        setCurrentClass('');
        setCourse('');
        setIsScheduleModalOpen(false);
      } else {
        console.error('Failed to create schedule:', response.message);
      }
    } catch (error) {
      console.error('Error creating schedule:', error);
    }
  };
  

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollno.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 p-6">
        <Header />
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100">Class Management</h2>

          <div className="overflow-x-auto mb-6">
            <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700 border-b">
                  <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300 font-semibold">Class Name</th>
                  <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300 font-semibold">Section</th>
                  <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300 font-semibold">Course Code</th>
                  <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300 font-semibold">Course Name</th>
                  <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300 font-semibold">Students</th>
                  <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300 font-semibold">Actions</th>
                  <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300 font-semibold">Schedule</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((classItem) =>
                  classItem.courses.map((course) => (
                    <tr key={`${classItem.name}-${course.courseCode}`} className="border-b dark:border-gray-700">
                      <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{classItem.name.toUpperCase()}</td>
                      <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{classItem.section}</td>
                      <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{course.courseCode}</td>
                      <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{course.courseName}</td>
                      <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{course.students.length}</td>
                      <td className="px-4 py-2">
                        <button
                          className="text-green-500 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 flex items-center"
                          onClick={() => handleManageStudents(classItem, course)} 
                        >
                          <FaPlusCircle className="h-5 w-5 mr-1" />
                        </button>
                      </td>
                      <td className="px-4 py-2">
                        <button
                          className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center"
                          onClick={() => handleManageScheduleCourse(classItem, course)}
                        >
                          <FaCalendar className="h-5 w-5 mr-1" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Modal for adding/removing students */}
          <Modal isOpen={isAddRemoveModalOpen} onClose={() => {
            setIsAddRemoveModalOpen(false);
            setCourse('');
            setCurrentClass('');
          }}>
            <h3 className="text-lg mb-4 text-gray-800 dark:text-black">Manage Students for {course.courseName}</h3>
            <input
              type="text"
              placeholder="Search Students by Name or Roll No..."
              className="border border-gray-300 dark:border-gray-600 p-2 rounded w-full mb-4 dark:bg-gray-800 dark:text-gray-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="overflow-y-auto max-h-60">
              {filteredStudents.map((student) => {
                const isEnrolled = course.students?.includes(student._id);

                return (
                  <li key={student._id} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-4">
                      <img
                        src={student.profilePic}
                        alt={`${student.name}'s profile`}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <span className="text-gray-800 dark:text-gray-100 font-medium">{student.name}</span>
                        <div className="text-gray-600 dark:text-gray-400 text-sm">{student.rollno}</div>
                      </div>
                    </div>

                    {isEnrolled ? (
                      <button
                        className="text-red-500 dark:text-red-400 font-medium hover:text-red-600 dark:hover:text-red-300 transition-colors"
                        onClick={() => RemoveStudent(student)}
                      >
                        <FaTrashAlt className="inline mr-1" /> Remove
                      </button>
                    ) : (
                      <button
                        className="text-blue-500 dark:text-blue-400 font-medium hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
                        onClick={() => AddStudent(student)}
                      >
                        Add
                      </button>
                    )}
                  </li>
                );
              })}
            </div>
          </Modal>

          {/* Modal for scheduling course */}
          <Modal isOpen={isScheduleModalOpen} onClose={() => setIsScheduleModalOpen(false)}>
            <h3 className="text-lg mb-4 text-gray-800 dark:text-black">Schedule Course</h3>

            <div className="mb-4">
              <label className="block text-gray-700 dark:text-black">Select Day:</label>
              <select
                className="border border-gray-300 dark:border-gray-600 p-2 rounded w-full dark:bg-gray-800 dark:text-gray-100"
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
              >
                <option value="">Select a day</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 dark:text-black">Select Time Slot:</label>
              <select
                className="border border-gray-300 dark:border-gray-600 p-2 rounded w-full dark:bg-gray-800 dark:text-gray-100"
                value={selectedTimeSlot}
                onChange={(e) => setSelectedTimeSlot(e.target.value)}
              >
                <option value="">Select a time slot</option>
                {timeSlots.map((slot, index) => (
                  <option key={index} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>

            <button className="bg-blue-500 dark:bg-blue-400 text-white dark:text-gray-900 p-2 rounded" onClick={createSchedule}>
              Schedule
            </button>
          </Modal>
        </div>
      </main>
    </div>
  );

}
