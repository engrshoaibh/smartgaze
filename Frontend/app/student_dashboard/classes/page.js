"use client";

import { useState } from 'react';
import Sidebar from '../components/side_nav';
import Header from '../components/header';

export default function Classes() {
  const [allClasses, setAllClasses] = useState([
    { id: 1, className: 'Math 101', roomNo: 'Room 1', teacher: 'Mr. Smith' },
    { id: 2, className: 'Science 102', roomNo: 'Room 2', teacher: 'Ms. Johnson' }
  ]);
  const [joinedClasses, setJoinedClasses] = useState([]);

  // Function to add a class to joined list
  const handleJoinClass = (classId) => {
    // Check if class already joined
    if (!joinedClasses.find(joinedClass => joinedClass.id === classId)) {
      const selectedClass = allClasses.find(aClass => aClass.id === classId);
      setJoinedClasses([...joinedClasses, selectedClass]);
    }
  };

  // Function to leave a class (remove from joined list)
  const handleLeaveClass = (classId) => {
    const filteredClasses = joinedClasses.filter(joinedClass => joinedClass.id !== classId);
    setJoinedClasses(filteredClasses);
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 p-6">
        <Header />
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6">My Classes</h2>

          {/* Joined Class List Table */}
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
                {joinedClasses.length > 0 ? (
                  joinedClasses.map((joinedClass) => (
                    <tr key={joinedClass.id} className="border-b">
                      <td className="px-4 py-2 text-gray-700">{joinedClass.className}</td>
                      <td className="px-4 py-2 text-gray-700">{joinedClass.roomNo}</td>
                      <td className="px-4 py-2 text-gray-700">{joinedClass.teacher}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleLeaveClass(joinedClass.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Leave Class
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-500">
                      No classes joined yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* All Classes List (for reference) */}
          <h2>All Available Classes</h2>
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
                {allClasses.length > 0 ? (
                  allClasses.map((aClass) => (
                    <tr key={aClass.id} className="border-b">
                      <td className="px-4 py-2 text-gray-700">{aClass.className}</td>
                      <td className="px-4 py-2 text-gray-700">{aClass.roomNo}</td>
                      <td className="px-4 py-2 text-gray-700">{aClass.teacher}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleJoinClass(aClass.id)}
                          className="text-green-500 hover:text-green-700"
                        >
                          Join Class
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-500">
                      No classes available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}