"use client";
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  FaChartLine,
  FaUserCheck,
  FaSmile,
  FaBrain,
  FaUserPlus,
  FaCogs,
  FaChevronRight,
  FaChevronLeft,
  FaChalkboardTeacher
} from 'react-icons/fa';

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const isActiveRoute = (href) => pathname === href;

  return (
    <div
      className={`group flex flex-col ${
        isExpanded ? 'w-64' : 'w-20'
      } bg-white text-black transition-all duration-300 shadow-lg relative`}
    >
      <div className="flex items-center p-4 relative">
        <div className="flex items-center">
          <img
            src="/images/smart gaze.jpg"
            alt="Logo"
            className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-700"
          />
          {isExpanded && (
            <span className="ml-3 text-lg font-normal text-gray-700">Smart Gaze</span>
          )}
        </div>
        <button
          onClick={toggleSidebar}
          className="p-1 text-gray-600 dark:text-gray-300 focus:outline-none absolute -right-3 top-3 bg-gray-200 dark:bg-gray-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          {isExpanded ? <FaChevronLeft className="text-sm" /> : <FaChevronRight className="text-sm" />}
        </button>
      </div>

      <nav className="flex-1 mt-4">
        <ul className="space-y-2 p-2">
          {[
            { name: 'Main Dashboard', icon: FaChartLine, href: '/teacher_dashboard' },
            { name: 'Attendance Dashboard', icon: FaUserCheck, href: '/teacher_dashboard/attendance_dashboard' },
            { name: 'Emotional State Dashboard', icon: FaSmile, href: '/teacher_dashboard/emotionalstate_dashboard' },
            { name: 'Attention Level Dashboard',  icon: FaBrain, href: '/teacher_dashboard/attentionlevel_dashboard' },
            { name: 'Class Management', icon: FaChalkboardTeacher, href: '/teacher_dashboard/classes' },
      
          ].map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                  isActiveRoute(item.href)
                    ? 'bg-gradient-to-br from-[#1E2B3A] to-[#3E5259] text-white shadow-md'
                    : 'hover:bg-gray-200 hover:text-white dark:hover:bg-gray-800 dark:hover:text-white'
                }`}
              >
                <item.icon className="text-lg mr-3" />
                {isExpanded && <span className="text-sm font-normal">{item.name}</span>}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
