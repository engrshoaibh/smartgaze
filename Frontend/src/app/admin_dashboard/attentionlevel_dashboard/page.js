'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../components/side_nav';
import Header from '../components/header';
import { Line } from 'react-chartjs-2'; // For visualizing attention levels
import 'chart.js/auto';

const AttentionLevelDashboard = () => {
  const [classes, setClasses] = useState(['Class A', 'Class B', 'Class C']); // Example classes
  const [selectedClass, setSelectedClass] = useState('');
  const [attentionData, setAttentionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState({ start: '', end: '' });

  // Fetch attention data when a class is selected
  useEffect(() => {
    const fetchAttentionData = async () => {
      if (!selectedClass) return; // Exit if no class is selected

      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated delay

      // Mock attention data for the selected class
      const data = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
          {
            label: 'Attention Level',
            data: [70, 75, 80, 90], // Simulated attention levels
            fill: false,
            borderColor: 'rgba(75,192,192,1)',
            tension: 0.1,
          },
        ],
      };

      setAttentionData(data);
      setLoading(false);
    };

    fetchAttentionData();
  }, [selectedClass]);

  // Handle class selection
  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
    setAttentionData(null); // Reset data on class change
  };

  // Handle time range selection
  const handleTimeRangeChange = (e) => {
    const { name, value } = e.target;
    setTimeRange((prev) => ({ ...prev, [name]: value }));
  };

  // Simulate exporting report
  const exportReport = () => {
    if (selectedClass && timeRange.start && timeRange.end) {
      console.log('Exporting report...');
      // Implement report generation logic here
    } else {
      console.log('Please select a class and time range to export the report.');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 p-6">
        <Header />
        <div className="flex justify-center items-center mt-20">
          <div className="w-full md:w-3/4 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
            <h1 className="text-3xl font-semibold mb-6 text-center text-gray-700 dark:text-gray-200">
              Attention Level Dashboard
            </h1>

            {/* Class Selection */}
            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300">Select Class</label>
              <select
                value={selectedClass}
                onChange={handleClassChange}
                className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 w-full transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">-- Select Class --</option>
                {classes.map((className, index) => (
                  <option key={index} value={className}>{className}</option>
                ))}
              </select>
            </div>

            {/* Time Range Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">Select Time Range</h3>
              <div className="flex justify-between">
                <div className="w-1/2 pr-2">
                  <label className="block text-gray-700 dark:text-gray-300">Start Date</label>
                  <input
                    type="date"
                    name="start"
                    value={timeRange.start}
                    onChange={handleTimeRangeChange}
                    className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 w-full transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="w-1/2 pl-2">
                  <label className="block text-gray-700 dark:text-gray-300">End Date</label>
                  <input
                    type="date"
                    name="end"
                    value={timeRange.end}
                    onChange={handleTimeRangeChange}
                    className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 w-full transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Data Visualization */}
            {!loading && attentionData && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Attention Level Trend</h2>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                  <Line data={attentionData} />
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading && <p className="text-center text-gray-500 dark:text-gray-400">Loading data...</p>}

            {/* Export Report Button */}
            <div className="mt-6">
              <button
                onClick={exportReport}
                className="w-1/3 bg-gradient-to-br from-[#1E2B3A] to-[#3E5259] text-white py-2 rounded-lg font-semibold 
                             hover:bg-gradient-to-br hover:from-[#2B3B4D] hover:to-[#4F6770] 
                             active:bg-gradient-to-br active:from-[#0E1B2A] active:to-[#2E4047] 
                             transition duration-300"
              >
                Export Report
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AttentionLevelDashboard;
