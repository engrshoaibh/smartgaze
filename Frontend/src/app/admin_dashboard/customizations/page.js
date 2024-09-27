'use client';  // Properly mark this component as a Client Component

import { useState } from 'react';
import { FaClock, FaPercentage, FaCamera,  } from 'react-icons/fa';
import { BsArrowDownSquareFill  } from "react-icons/bs";
import Sidebar from '../components/side_nav';
import Header from '../components/header';

export default function MainDashboard() {
  const [attendanceFrequency, setAttendanceFrequency] = useState('30 mins');
  const [attendanceThreshold, setAttendanceThreshold] = useState('50%');
  const [imageCaptureInterval, setImageCaptureInterval] = useState('10 mins');

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-gray-200">
      <Sidebar />
      <main className="flex-1 p-6">
        <Header />

        {/* Form Section */}
        <div className="space-y-8 mt-16">
          
          {/* Customize attendance frequency */}
          <div className="flex items-center justify-between max-w-lg mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <label htmlFor="attendance-frequency" className="text-base font-semibold flex items-center gap-2">
              <FaClock className="text-blue-500" /> Frequency
            </label>
            <div className="relative w-60">
              <select
                id="attendance-frequency"
                className="cursor-pointer p-3 border border-gray-300 rounded-md w-full bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 text-base hover:bg-gray-100 dark:hover:bg-gray-600 transition duration-300 appearance-none"
                value={attendanceFrequency}
                onChange={(e) => setAttendanceFrequency(e.target.value)}
              >
                <option value="30 mins">30 mins</option>
                <option value="1 hour">1 hour</option>
                <option value="2 hours">2 hours</option>
                <option value="4 hours">4 hours</option>
              </select>
              <BsArrowDownSquareFill size={20} className="absolute top-4 right-3 text-black-500 dark:text-gray-300 pointer-events-none" /> {/* Chevron icon */}
            </div>
          </div>

          {/* Customize attendance threshold */}
          <div className="flex items-center justify-between max-w-lg mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <label htmlFor="attendance-threshold" className="text-base font-semibold flex items-center gap-2">
              <FaPercentage className="text-green-500" /> Threshold
            </label>
            <div className="relative w-60">
              <select
                id="attendance-threshold"
                className="cursor-pointer p-3 border border-gray-300 rounded-md w-full bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 text-base hover:bg-gray-100 dark:hover:bg-gray-600 transition duration-300 appearance-none"
                value={attendanceThreshold}
                onChange={(e) => setAttendanceThreshold(e.target.value)}
              >
                <option value="50%">50%</option>
                <option value="75%">75%</option>
                <option value="90%">90%</option>
                <option value="100%">100%</option>
              </select>
              <BsArrowDownSquareFill size={20} className="absolute top-4 right-3 text-black-500 dark:text-gray-300 pointer-events-none" /> {/* Chevron icon */}
            </div>
          </div>

          {/* Take Image After Specific Interval */}
          <div className="flex items-center justify-between max-w-lg mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <label htmlFor="image-capture-interval" className="text-base font-semibold flex items-center gap-2">
              <FaCamera className="text-red-500" /> Image Interval
            </label>
            <div className="relative w-60">
              <select
                id="image-capture-interval"
                className="cursor-pointer p-3 border border-gray-300 rounded-md w-full bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 text-base hover:bg-gray-100 dark:hover:bg-gray-600 transition duration-300 appearance-none"
                value={imageCaptureInterval}
                onChange={(e) => setImageCaptureInterval(e.target.value)}
              >
                <option value="10 mins">10 mins</option>
                <option value="20 mins">20 mins</option>
                <option value="30 mins">30 mins</option>
                <option value="40 mins">40 mins</option>
                <option value="50 mins">50 mins</option>
              </select>
              <BsArrowDownSquareFill size={20} className="absolute top-4 right-3 text-black-500 dark:text-gray-300 pointer-events-none" /> {/* Chevron icon */}            </div>
          </div>

          {/* Confirm Changes Button */}
          <div className="flex justify-center mt-12">
            <button className="w-64 bg-gradient-to-br from-[#1E2B3A] to-[#3E5259] text-white py-3 rounded-lg font-semibold 
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
