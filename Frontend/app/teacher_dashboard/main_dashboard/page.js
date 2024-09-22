"use client";

import StatisticsCard from '../components/statistics_card';
import AttendanceChart from '../components/attendance_chart';
import EventCalendar from '../components/calendar';
import Sidebar from '../components/side_nav';
import Header from '../components/header';
import { FaUser, FaChartLine, FaCalendar } from 'react-icons/fa';

export default function main_dashboard({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-4">
        <Header />
        <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatisticsCard
          title="Total Students by Gender"
          value="2500"
          icon={<FaUser />}
          color="text-blue-500"
        />
        <div className="col-span-2">
          <AttendanceChart />
        </div>
      </div>
        </div>
      </main>
    </div>
  );
}