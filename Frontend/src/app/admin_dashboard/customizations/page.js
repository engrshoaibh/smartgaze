"use client";  // Properly mark this component as a Client Component

import { useState } from 'react';
import Sidebar from '../components/side_nav';
import Header from '../components/header';
import { FaUser, FaChartLine, FaCalendar } from 'react-icons/fa';

export default function MainDashboard({ children }) {
  // State for dark mode toggle and dropdowns
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [attendanceFrequency, setAttendanceFrequency] = useState('30 mins');
  const [attendanceThreshold, setAttendanceThreshold] = useState('50%');

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`flex min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      <Sidebar />
      <main className="flex-1 p-4">
        <Header />

        {/* Form Section */}
        <div className="space-y-4 mt-32">
          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between ml-32">
            <label className="text-lg">Dark Mode</label>
            <label className="inline-flex relative items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={isDarkMode} onChange={toggleDarkMode} />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:translate-x-full peer-checked:border-white mr-72"></div>
            </label>
          </div>

          {/* Customize attendance frequency */}
          <div className="flex items-center justify-between ml-32">
            <label className="text-lg">Customize attendance instance frequency</label>
            <select
              className="p-2 border border-gray-300 rounded-md mr-64 w-32"
              value={attendanceFrequency}
              onChange={(e) => setAttendanceFrequency(e.target.value)}
            >
              <option value="30 mins">30 mins</option>
              <option value="1 hour">1 hour</option>
              <option value="2 hours">2 hours</option>
              <option value="4 hours">4 hours</option>
            </select>
          </div>

          {/* Customize attendance threshold */}
          <div className="flex items-center justify-between ml-32">
            <label className="text-lg">Customize attendance threshold</label>
            <select
              className="p-2 border border-gray-300 rounded-md mr-64 w-32"
              value={attendanceThreshold}
              onChange={(e) => setAttendanceThreshold(e.target.value)}
            >
              <option value="50%">50%</option>
              <option value="75%">75%</option>
              <option value="90%">90%</option>
              <option value="100%">100%</option>
            </select>
          </div>

          {/* Confirm Changes Button */}
          <div className="flex justify-center mt-128">
            <button className="w-64 bg-gradient-to-br from-[#1E2B3A] to-[#3E5259] text-white py-2 rounded-lg font-semibold 
                             hover:bg-gradient-to-br hover:from-[#2B3B4D] hover:to-[#4F6770] 
                             active:bg-gradient-to-br active:from-[#0E1B2A] active:to-[#2E4047] 
                             transition duration-300 mt-16">
              Confirm Changes
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
