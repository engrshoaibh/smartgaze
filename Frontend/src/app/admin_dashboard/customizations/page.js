'use client';  // Properly mark this component as a Client Component

import { useContext, useState } from 'react';
import Sidebar from '../components/side_nav';
import Header from '../components/header';
import { ThemeContext } from '../../../context/ThemeContext';  // Import ThemeContext
import { FaUser, FaChartLine, FaCalendar } from 'react-icons/fa';

export default function MainDashboard() {
  // Use ThemeContext to manage dark mode globally
  const { theme, toggleTheme } = useContext(ThemeContext);  // Get theme and toggleTheme from context
  const [attendanceFrequency, setAttendanceFrequency] = useState('30 mins');
  const [attendanceThreshold, setAttendanceThreshold] = useState('50%');

  return (
    <div className={`flex min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-gray-200`}>
      <Sidebar />
      <main className="flex-1 p-6">
        <Header />

        {/* Form Section */}
        <div className="space-y-8 mt-16">
          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between max-w-lg mx-auto">
            <label className="text-lg font-semibold">Dark Mode</label>
            <label className="inline-flex relative items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={theme === 'dark'}  // Check if the current theme is dark
                onChange={toggleTheme}  // Call toggleTheme from context
              />
              <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:translate-x-full peer-checked:border-white"></div>
            </label>
          </div>

          {/* Customize attendance frequency */}
          <div className="flex items-center justify-between max-w-lg mx-auto">
            <label htmlFor="attendance-frequency" className="text-lg font-semibold">
              Customize Attendance Instance Frequency
            </label>
            <select
              id="attendance-frequency"
              className="p-2 border border-gray-300 rounded-md w-40 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
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
          <div className="flex items-center justify-between max-w-lg mx-auto">
            <label htmlFor="attendance-threshold" className="text-lg font-semibold">
              Customize Attendance Threshold
            </label>
            <select
              id="attendance-threshold"
              className="p-2 border border-gray-300 rounded-md w-40 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
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
          <div className="flex justify-center mt-12">
            <button className="w-64 bg-gradient-to-br from-[#1E2B3A] to-[#3E5259] text-white py-2 rounded-lg font-semibold 
                             hover:bg-gradient-to-br hover:from-[#2B3B4D] hover:to-[#4F6770] 
                             active:bg-gradient-to-br active:from-[#0E1B2A] active:to-[#2E4047] 
                             transition duration-300">
              Confirm Changes
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
