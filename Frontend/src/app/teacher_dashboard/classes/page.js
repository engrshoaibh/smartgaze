"use client";

import { useState, useEffect } from 'react';
import { FaTrashAlt, FaPlusCircle } from 'react-icons/fa'; // Importing icons from React Icons
import Sidebar from '../components/side_nav';
import Header from '../components/header';
import { getAllAssignedClasses, addStudentToClass, getStudents } from '../../../../../Backend/utils/api'; // Import the API functions

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null; // Don't render the modal if it's not open

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
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [selectedClass, setSelectedClass] = useState(null); // Store the class ID for adding students
  const [students, setStudents] = useState([]); // List of students to add

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await getAllAssignedClasses();
        setClasses(response.data.classes);
      } catch (err) {
        setError('Failed to fetch classes.');
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await getStudents();
      setStudents(response.data.student); // Set all students initially
    } catch (error) {
      setError('Failed to fetch students.');
    }
  };

  const handleAddClass = async (classId) => {
    setSelectedClass(classId);
    setIsModalOpen(true); // Open the modal
  };

  const handleAddStudentToClass = async (classId, studentId) => {
    try {
      console.log("Adding Class ID", classId, studentId);

      await addStudentToClass(classId, studentId); // Call the API to add student
      setIsModalOpen(false); // Close the modal

    } catch (error) {
      setError('Failed to add student to class.');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  const getAvailableStudents = () => {
    if (!selectedClass) return students; // If no class is selected, return all students
    const selectedClassItem = classes.find(classItem => classItem._id === selectedClass);
    const enrolledStudentIds = selectedClassItem.students.map(student => student.id);

    // Return students not already enrolled in the selected class
    return students.filter(student => !enrolledStudentIds.includes(student.id));
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 p-6">
        <Header />
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6">Class Management</h2>

          <div className="overflow-x-auto mb-6">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="px-4 py-2 text-left text-gray-700 font-semibold">Class Name</th>
                  <th className="px-4 py-2 text-left text-gray-700 font-semibold">Section</th>
                  <th className="px-4 py-2 text-left text-gray-700 font-semibold">Course Code</th>
                  <th className="px-4 py-2 text-left text-gray-700 font-semibold">Course Name</th>
                  <th className="px-4 py-2 text-left text-gray-700 font-semibold">Students</th>
                  <th className="px-4 py-2 text-left text-gray-700 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {classes.length > 0 ? (
                  classes.map((classItem) => (
                    <tr key={classItem._id} className="border-b">
                      <td className="px-4 py-2 text-gray-700">{classItem.name}</td>
                      <td className="px-4 py-2 text-gray-700">{classItem.section}</td>
                      <td className="px-4 py-2 text-gray-700">{classItem.courseCode}</td>
                      <td className="px-4 py-2 text-gray-700">{classItem.courseName}</td>
                      <td className="px-4 py-2 text-gray-700">{classItem.students.length}</td>
                      <td className="px-4 py-2">
                    
                        <button
                          className="text-green-500 hover:text-green-700 flex items-center"
                          onClick={() => handleAddClass(classItem._id)}
                        >
                          <FaPlusCircle className="h-5 w-5 mr-1" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-gray-500">
                      {loading ? (
                        <div>Loading classes...</div>
                      ) : (
                        <div>No classes found.</div>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Modal for adding students */}
          <Modal isOpen={isModalOpen} onClose={closeModal}>
            <h3 className="text-lg mb-4">Add Students to Class</h3>
            <div className="overflow-y-auto max-h-60">
            {getAvailableStudents().length === 0 ? (
                  <p>No Student Available To Add</p>
                ) : (
                  getAvailableStudents().map((student) => (
                    <li key={student.id} className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div className="flex items-center space-x-4">
                        <img
                          src={student.profilePic}
                          alt={`${student.name}'s profile`}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <span className="text-gray-800 font-medium">{student.name}</span>
                      </div>
                      <button
                        onClick={() => handleAddStudentToClass(selectedClass, student._id)}
                        className="text-blue-500 font-medium hover:text-blue-600 transition-colors"
                      >
                        Add
                      </button>
                    </li>
                  ))
                )}
            </div>
          </Modal>
          
        </div>
      </main>
    </div>
  );
}
