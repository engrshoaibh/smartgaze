"use client";

import { useState } from 'react';
import Sidebar from '../components/side_nav';
import Header from '../components/header';

export default function Classes() {
  const [classes, setClasses] = useState([
    { id: 1, className: 'Math 101', roomNo: 'Room 1', teacher: 'Mr. Smith' },
    { id: 2, className: 'Science 102', roomNo: 'Room 2', teacher: 'Ms. Johnson' }
  ]);

  const [newClassName, setNewClassName] = useState('');
  const [newRoomNo, setNewRoomNo] = useState('');
  const [newTeacher, setNewTeacher] = useState('');

  // Add new class
  const handleAddClass = () => {
    if (newClassName.trim() && newRoomNo.trim() && newTeacher.trim()) {
      const newClass = {
        id: classes.length + 1,
        className: newClassName,
        roomNo: newRoomNo,
        teacher: newTeacher
      };
      setClasses([...classes, newClass]);
      setNewClassName(''); // Clear inputs
      setNewRoomNo('');
      setNewTeacher('');
    }
  };

  // Remove class
  const handleRemoveClass = (id) => {
    const filteredClasses = classes.filter(classItem => classItem.id !== id);
    setClasses(filteredClasses);
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 p-6">
        <Header />
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6">Class Management</h2>

          {/* Class List Table */}
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="px-4 py-2 text-left text-gray-700 font-semibold">Class Name</th>
                  <th className="px-4 py-2 text-left text-gray-700 font-semibold">Room No</th>
                  <th className="px-4 py-2 text-left text-gray-700 font-semibold">Teacher</th>
                  <th className="px-4 py-2 text-left text-gray-700 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {classes.length > 0 ? (
                  classes.map((classItem) => (
                    <tr key={classItem.id} className="border-b">
                      <td className="px-4 py-2 text-gray-700">{classItem.className}</td>
                      <td className="px-4 py-2 text-gray-700">{classItem.roomNo}</td>
                      <td className="px-4 py-2 text-gray-700">{classItem.teacher}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleRemoveClass(classItem.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-500">
                      No classes found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Add Class */}
          <div className="mt-6">
            <h3 className="text-lg mb-3">Add New Class:</h3>
            <div className="grid grid-cols-3 gap-3">
              <input
                type="text"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                placeholder="Class Name"
                className="px-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              <input
                type="text"
                value={newRoomNo}
                onChange={(e) => setNewRoomNo(e.target.value)}
                placeholder="Room No"
                className="px-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              <input
                type="text"
                value={newTeacher}
                onChange={(e) => setNewTeacher(e.target.value)}
                placeholder="Teacher's Name"
                className="px-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
            <button
              onClick={handleAddClass}
              className="mt-4 bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded-md text-white"
            >
              Add Class
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
