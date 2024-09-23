'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '../components/side_nav';
import Header from '../components/header';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import jsPDF from 'jspdf';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import { CSVLink } from 'react-csv';

// Mock data for students
const studentsList = [
  { id: 'student123', name: 'John Doe' },
  { id: 'student456', name: 'Jane Smith' },
  { id: 'student789', name: 'Alice Brown' },
];

const EmotionalStateDashboard = () => {
  const [emotionalData, setEmotionalData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [filteredRecords, setFilteredRecords] = useState([]);

  // Simulated emotional state records
  const emotionalRecords = [
    { date: '2023-09-01', studentId: 'student123', studentName: 'John Doe', engagement: 65, wellBeing: 45 },
    { date: '2023-09-02', studentId: 'student123', studentName: 'John Doe', engagement: 59, wellBeing: 50 },
    { date: '2023-09-03', studentId: 'student123', studentName: 'John Doe', engagement: 80, wellBeing: 70 },
    { date: '2023-09-04', studentId: 'student123', studentName: 'John Doe', engagement: 81, wellBeing: 85 },
    // Additional records for other students
    { date: '2023-09-01', studentId: 'student456', studentName: 'Jane Smith', engagement: 70, wellBeing: 60 },
    { date: '2023-09-02', studentId: 'student456', studentName: 'Jane Smith', engagement: 75, wellBeing: 65 },
    { date: '2023-09-03', studentId: 'student456', studentName: 'Jane Smith', engagement: 78, wellBeing: 68 },
    { date: '2023-09-04', studentId: 'student456', studentName: 'Jane Smith', engagement: 80, wellBeing: 70 },
    // Continue adding records as needed
  ];

  useEffect(() => {
    fetchEmotionalData();
  }, []);

  const fetchEmotionalData = async () => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      prepareChartData(emotionalRecords);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const prepareChartData = (records) => {
    // Aggregate data for the chart
    const dateLabels = [...new Set(records.map((record) => record.date))].sort();
    const engagementData = dateLabels.map((date) => {
      const dailyRecords = records.filter((record) => record.date === date);
      return dailyRecords.reduce((sum, record) => sum + record.engagement, 0) / dailyRecords.length;
    });
    const wellBeingData = dateLabels.map((date) => {
      const dailyRecords = records.filter((record) => record.date === date);
      return dailyRecords.reduce((sum, record) => sum + record.wellBeing, 0) / dailyRecords.length;
    });

    setEmotionalData({
      labels: dateLabels,
      datasets: [
        {
          label: 'Student Engagement',
          data: engagementData,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          fill: false,
          tension: 0.1,
        },
        {
          label: 'Emotional Well-being',
          data: wellBeingData,
          backgroundColor: 'rgba(255,99,132,0.4)',
          borderColor: 'rgba(255,99,132,1)',
          fill: false,
          tension: 0.1,
        },
      ],
    });
  };

  const handleFilterChange = () => {
    setLoading(true);
    let records = [...emotionalRecords];

    if (selectedStudent) {
      records = records.filter((record) => record.studentId === selectedStudent);
    }
    if (startDate) {
      records = records.filter((record) => new Date(record.date) >= startDate);
    }
    if (endDate) {
      records = records.filter((record) => new Date(record.date) <= endDate);
    }

    setFilteredRecords(records);
    prepareChartData(records);
    setLoading(false);
    setModalIsOpen(true); // Open the modal to show the table
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Emotional State Report', 14, 15);
    doc.setFontSize(10);

    let yPosition = 25;
    filteredRecords.forEach((record, index) => {
      const line = `Date: ${record.date}, Student: ${record.studentName}, Engagement: ${record.engagement}, Well-being: ${record.wellBeing}`;
      doc.text(line, 14, yPosition + index * 7);
    });

    doc.save('emotional_state_report.pdf');
  };

  const tableHeaders = ['Date', 'Student', 'Engagement', 'Well-being'];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6">
        <Header />

        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Chart Section */}
          <div className="flex-1 bg-white p-4 rounded-lg shadow-lg">
            {loading ? (
              <p>Loading data...</p>
            ) : (
              <Line data={emotionalData} options={{ maintainAspectRatio: true }} />
            )}
          </div>

          {/* Filters Section */}
          <div className="w-full lg:w-1/3 bg-white p-4 rounded-lg shadow-lg">
            <div className="flex flex-col space-y-4 mb-4">
              <div>
                <label className="block text-gray-700">Filter by Student</label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="border border-gray-300 rounded-md px-2 py-1 w-full"
                >
                  <option value="">-- All Students --</option>
                  {studentsList.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-2">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  className="border border-gray-300 rounded-md px-2 py-1 w-full text-sm"
                  placeholderText="Start Date"
                />
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  className="border border-gray-300 rounded-md px-2 py-1 w-full text-sm"
                  placeholderText="End Date"
                />
              </div>

              <button
                onClick={handleFilterChange}
                className="bg-gray-300 text-black px-4 py-2 rounded"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Modal for Report Table */}
        {modalIsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-3xl mx-auto">
              <h2 className="text-2xl font-semibold mb-4">Emotional State Report</h2>
              {filteredRecords.length > 0 ? (
                <div>
                  <table className="min-w-full bg-white mb-4">
                    <thead>
                      <tr>
                        {tableHeaders.map((header, idx) => (
                          <th key={idx} className="py-2 px-4 border">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRecords.map((record, idx) => (
                        <tr key={idx}>
                          <td className="py-2 px-4 border">{record.date}</td>
                          <td className="py-2 px-4 border">{record.studentName}</td>
                          <td className="py-2 px-4 border">{record.engagement}</td>
                          <td className="py-2 px-4 border">{record.wellBeing}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="flex flex-wrap space-x-4">
                    <button
                      onClick={exportToPDF}
                      className="bg-gray-300 text-black px-4 py-2 rounded mb-2"
                    >
                      Export as PDF
                    </button>
                    <CSVLink
                      data={filteredRecords}
                      headers={tableHeaders.map((header) => ({
                        label: header,
                        key: header.toLowerCase(),
                      }))}
                      filename="emotional_state_report.csv"
                      className="bg-gray-300 text-black px-4 py-2 rounded mb-2"
                    >
                      Export as CSV
                    </CSVLink>
                    <button
                      onClick={() => setModalIsOpen(false)}
                      className="bg-gray-300 text-black px-4 py-2 rounded mb-2"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <p>No records found.</p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default EmotionalStateDashboard;
