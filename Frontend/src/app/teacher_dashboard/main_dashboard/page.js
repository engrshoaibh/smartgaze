"use client";

import StatisticsCard from '../components/statistics_card';
import AttendanceChart from '../components/attendance_chart'; // Your attendance chart component
import EmotionalChart from '../components/emotional_chart'; // Your emotional chart component
import AttentionLevelChart from '../components/attention_level_chart'; // Your attention level chart component
import Sidebar from '../components/side_nav';
import Header from '../../components/header';
import { FaUserGraduate, FaChalkboardTeacher, FaBriefcase, FaDollarSign } from 'react-icons/fa';

export default function MainDashboard({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 p-4">
        <Header />
        <div className="mt-4 flex flex-col items-center mt-28">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl">
            <StatisticsCard 
              title="Total Students" 
              value="2500" 
              icon={<FaUserGraduate size={24} />} 
            />
            <StatisticsCard 
              title="Total Teachers" 
              value="150" 
              icon={<FaChalkboardTeacher size={24} />} 
            />
            <StatisticsCard 
              title="Total Classes" 
              value="16" 
              icon={<FaBriefcase size={24} />} 
            />

          </div>

          {/* Graphs Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl mt-8">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex flex-col items-center">
              <h2 className="text-xl font-semibold mb-2 text-center">Attendance Chart</h2>
              <AttendanceChart />
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex flex-col items-center">
              <h2 className="text-xl font-semibold mb-2 text-center">Emotional Status</h2>
              <EmotionalChart />
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex flex-col items-center">
              <h2 className="text-xl font-semibold mb-2 text-center">Attention Level</h2>
              <AttentionLevelChart />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
