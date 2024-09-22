"use client";

import { useState } from 'react';
import Sidebar from '../components/side_nav';
import Header from '../components/header';

export default function Students() {
  const [students, setStudents] = useState([
    { id: 1, rollNo: '001', name: 'John Doe', age: 20, class: '10th' },
    { id: 2, rollNo: '002', name: 'Jane Smith', age: 21, class: '11th' }
  ]);

  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentRollNo, setNewStudentRollNo] = useState('');
  const [newStudentAge, setNewStudentAge] = useState('');
  const [newStudentClass, setNewStudentClass] = useState('');

  // Add new student
  const handleAddStudent = () => {
    if (newStudentName.trim() && newStudentRollNo.trim() && newStudentAge.trim() && newStudentClass.trim()) {
      const newStudent = {
        id: students.length + 1,
        rollNo: newStudentRollNo,
        name: newStudentName,
        age: parseInt(newStudentAge),
        class: newStudentClass
      };
      setStudents([...students, newStudent]);
      setNewStudentName(''); // Clear inputs
      setNewStudentRollNo('');
      setNewStudentAge('');
      setNewStudentClass('');
    }
  };

  // Remove student
  const handleRemoveStudent = (id) => {
    const filteredStudents = students.filter(student => student.id !== id);
    setStudents(filteredStudents);
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar /> 
      <main className="flex-1 p-6">
        <Header />
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6">Student Management</h2>

          {/* Student List Table */}
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="px-4 py-2 text-left text-gray-700 font-semibold">Roll No</th>
                  <th className="px-4 py-2 text-left text-gray-700 font-semibold">Name</th>
                  <th className="px-4 py-2 text-left text-gray-700 font-semibold">Age</th>
                  <th className="px-4 py-2 text-left text-gray-700 font-semibold">Class</th>
                  <th className="px-4 py-2 text-left text-gray-700 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.length > 0 ? (
                  students.map((student) => (
                    <tr key={student.id} className="border-b">
                      <td className="px-4 py-2 text-gray-700">{student.rollNo}</td>
                      <td className="px-4 py-2 text-gray-700">{student.name}</td>
                      <td className="px-4 py-2 text-gray-700">{student.age}</td>
                      <td className="px-4 py-2 text-gray-700">{student.class}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleRemoveStudent(student.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-gray-500">
                      No students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Add Student */}
          <div className="mt-6">
            <h3 className="text-lg mb-3">Add New Student:</h3>
            <div className="grid grid-cols-4 gap-3">
              <input
                type="text"
                value={newStudentRollNo}
                onChange={(e) => setNewStudentRollNo(e.target.value)}
                placeholder="Roll No"
                className="px-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              <input
                type="text"
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                placeholder="Name"
                className="px-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              <input
                type="number"
                value={newStudentAge}
                onChange={(e) => setNewStudentAge(e.target.value)}
                placeholder="Age"
                className="px-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              <input
                type="text"
                value={newStudentClass}
                onChange={(e) => setNewStudentClass(e.target.value)}
                placeholder="Class"
                className="px-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
            <button
              onClick={handleAddStudent}
              className="mt-4 bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded-md text-white"
            >
              Add Student
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
