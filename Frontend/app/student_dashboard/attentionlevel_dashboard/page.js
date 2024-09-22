'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../components/side_nav';
import Header from '../components/header';
import { Line } from 'react-chartjs-2'; // For visualizing attention levels
import 'chart.js/auto';

// Mock function to simulate fetching attention data for the logged-in student
const getStudentAttentionData = (selectedClass) => {
  // Simulate different attention data for each class
  const data = {
    'Class A': [70, 75, 80, 85],
    'Class B': [60, 65, 70, 75],
    'Class C': [50, 55, 60, 65],
  };

  return {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], // Time periods (e.g., weeks)
    datasets: [
      {
        label: 'Attention Level',
        data: data[selectedClass] || [],
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1,
      },
    ],
  };
};

const AttentionLevelDashboard = () => {
  const [classes] = useState(['Class A', 'Class B', 'Class C']); // Available classes
  const [selectedClass, setSelectedClass] = useState('Class A'); // Default class
  const [attentionData, setAttentionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState({ start: '', end: '' });

  // Fetch attention data for the logged-in student based on class selection
  useEffect(() => {
    const fetchAttentionData = async () => {
      if (!selectedClass) return;

      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated delay

      const data = getStudentAttentionData(selectedClass);
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

  // Filter attention data by time range (optional for future use)
  const handleFilterChange = () => {
    if (!timeRange.start || !timeRange.end) return; // No filtering if time range is incomplete

    const filteredData = {
      ...attentionData,
      labels: attentionData.labels.filter((label, index) => {
        const weekIndex = index + 1;
        return (
          weekIndex >= parseInt(timeRange.start.split('-')[1]) &&
          weekIndex <= parseInt(timeRange.end.split('-')[1])
        );
      }),
      datasets: [
        {
          ...attentionData.datasets[0],
          data: attentionData.datasets[0].data.filter((_, index) => {
            const weekIndex = index + 1;
            return (
              weekIndex >= parseInt(timeRange.start.split('-')[1]) &&
              weekIndex <= parseInt(timeRange.end.split('-')[1])
            );
          }),
        },
      ],
    };

    setAttentionData(filteredData);
  };

  // Simulate exporting report
  const exportReport = () => {
    if (timeRange.start && timeRange.end && selectedClass) {
      console.log('Exporting report...');
      // Implement report generation logic here
    } else {
      console.log('Please select a class and time range to export the report.');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6">
        <Header />
        <div className="flex justify-center items-center mt-8">
          <div className="w-full md:w-3/4 bg-white p-8 rounded-lg shadow-lg">
            <h1 className="text-3xl font-semibold mb-6 text-center text-gray-700">Attention Level Dashboard</h1>
            
            {/* Class Selection */}
            <div className="mb-6">
              <label className="block text-gray-700">Select Class</label>
              <select
                value={selectedClass}
                onChange={handleClassChange}
                className="border border-gray-300 rounded-md px-2 py-1 w-full"
              >
                {classes.map((className, index) => (
                  <option key={index} value={className}>
                    {className}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Range Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Select Time Range</h3>
              <div className="flex justify-between">
                <div className="w-1/2 pr-2">
                  <label className="block text-gray-700">Start Date</label>
                  <input
                    type="date"
                    name="start"
                    value={timeRange.start}
                    onChange={handleTimeRangeChange}
                    className="border border-gray-300 rounded-md px-2 py-1 w-full"
                  />
                </div>
                <div className="w-1/2 pl-2">
                  <label className="block text-gray-700">End Date</label>
                  <input
                    type="date"
                    name="end"
                    value={timeRange.end}
                    onChange={handleTimeRangeChange}
                    className="border border-gray-300 rounded-md px-2 py-1 w-full"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleFilterChange}
              className="bg-blue-500 text-white px-4 py-2 rounded-md mb-6"
            >
              Apply Filters
            </button>

            {/* Data Visualization */}
            {!loading && attentionData && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-4">Attention Level Trend</h2>
                <Line data={attentionData} />
              </div>
            )}

            {/* Loading State */}
            {loading && <p className="text-center text-gray-500">Loading data...</p>}

            {/* Export Report Button */}
            <div className="mt-6">
              <button
                onClick={exportReport}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
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
