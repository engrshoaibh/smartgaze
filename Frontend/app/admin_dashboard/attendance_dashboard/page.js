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

// Expanded attendance records with more entries
const attendanceRecords = [
  { class: 'Class A', teacher: 'Mr. Smith', date: '2023-09-01', present: 28, absent: 2 },
  { class: 'Class B', teacher: 'Mr. Smith', date: '2023-09-02', present: 27, absent: 3 },
  { class: 'Class A', teacher: 'Ms. Johnson', date: '2023-09-03', present: 29, absent: 1 },
  { class: 'Class C', teacher: 'Ms. Johnson', date: '2023-09-04', present: 26, absent: 4 },
  // Additional entries (50 more)
  { class: 'Class B', teacher: 'Ms. Johnson', date: '2023-09-05', present: 25, absent: 5 },
  { class: 'Class C', teacher: 'Mr. Smith', date: '2023-09-06', present: 27, absent: 3 },
  { class: 'Class A', teacher: 'Mr. Smith', date: '2023-09-07', present: 28, absent: 2 },
  { class: 'Class B', teacher: 'Ms. Johnson', date: '2023-09-08', present: 26, absent: 4 },
  { class: 'Class C', teacher: 'Ms. Johnson', date: '2023-09-09', present: 25, absent: 5 },
  { class: 'Class A', teacher: 'Mr. Smith', date: '2023-09-10', present: 29, absent: 1 },
  { class: 'Class B', teacher: 'Mr. Smith', date: '2023-09-11', present: 27, absent: 3 },
  { class: 'Class C', teacher: 'Mr. Smith', date: '2023-09-12', present: 26, absent: 4 },
  { class: 'Class A', teacher: 'Ms. Johnson', date: '2023-09-13', present: 28, absent: 2 },
  { class: 'Class B', teacher: 'Mr. Smith', date: '2023-09-14', present: 27, absent: 3 },
  { class: 'Class C', teacher: 'Ms. Johnson', date: '2023-09-15', present: 25, absent: 5 },
  { class: 'Class A', teacher: 'Mr. Smith', date: '2023-09-16', present: 29, absent: 1 },
  { class: 'Class B', teacher: 'Ms. Johnson', date: '2023-09-17', present: 26, absent: 4 },
  { class: 'Class C', teacher: 'Mr. Smith', date: '2023-09-18', present: 28, absent: 2 },
  { class: 'Class A', teacher: 'Ms. Johnson', date: '2023-09-19', present: 27, absent: 3 },
  { class: 'Class B', teacher: 'Mr. Smith', date: '2023-09-20', present: 25, absent: 5 },
  { class: 'Class C', teacher: 'Ms. Johnson', date: '2023-09-21', present: 29, absent: 1 },
  { class: 'Class A', teacher: 'Mr. Smith', date: '2023-09-22', present: 26, absent: 4 },
  { class: 'Class B', teacher: 'Ms. Johnson', date: '2023-09-23', present: 28, absent: 2 },
  { class: 'Class C', teacher: 'Mr. Smith', date: '2023-09-24', present: 27, absent: 3 },
  { class: 'Class A', teacher: 'Ms. Johnson', date: '2023-09-25', present: 25, absent: 5 },
  { class: 'Class B', teacher: 'Mr. Smith', date: '2023-09-26', present: 29, absent: 1 },
  { class: 'Class C', teacher: 'Ms. Johnson', date: '2023-09-27', present: 26, absent: 4 },
  { class: 'Class A', teacher: 'Mr. Smith', date: '2023-09-28', present: 28, absent: 2 },
  { class: 'Class B', teacher: 'Ms. Johnson', date: '2023-09-29', present: 27, absent: 3 },
  { class: 'Class C', teacher: 'Mr. Smith', date: '2023-09-30', present: 25, absent: 5 },
  { class: 'Class A', teacher: 'Ms. Johnson', date: '2023-10-01', present: 29, absent: 1 },
  { class: 'Class B', teacher: 'Mr. Smith', date: '2023-10-02', present: 26, absent: 4 },
  { class: 'Class C', teacher: 'Ms. Johnson', date: '2023-10-03', present: 28, absent: 2 },
  { class: 'Class A', teacher: 'Mr. Smith', date: '2023-10-04', present: 27, absent: 3 },
  { class: 'Class B', teacher: 'Ms. Johnson', date: '2023-10-05', present: 25, absent: 5 },
  { class: 'Class C', teacher: 'Mr. Smith', date: '2023-10-06', present: 29, absent: 1 },
  { class: 'Class A', teacher: 'Ms. Johnson', date: '2023-10-07', present: 26, absent: 4 },
  { class: 'Class B', teacher: 'Mr. Smith', date: '2023-10-08', present: 28, absent: 2 },
  { class: 'Class C', teacher: 'Ms. Johnson', date: '2023-10-09', present: 27, absent: 3 },
  { class: 'Class A', teacher: 'Mr. Smith', date: '2023-10-10', present: 25, absent: 5 },
  { class: 'Class B', teacher: 'Ms. Johnson', date: '2023-10-11', present: 29, absent: 1 },
  { class: 'Class C', teacher: 'Mr. Smith', date: '2023-10-12', present: 26, absent: 4 },
  { class: 'Class A', teacher: 'Ms. Johnson', date: '2023-10-13', present: 28, absent: 2 },
  { class: 'Class B', teacher: 'Mr. Smith', date: '2023-10-14', present: 27, absent: 3 },
  { class: 'Class C', teacher: 'Ms. Johnson', date: '2023-10-15', present: 25, absent: 5 },
  { class: 'Class A', teacher: 'Mr. Smith', date: '2023-10-16', present: 29, absent: 1 },
  { class: 'Class B', teacher: 'Ms. Johnson', date: '2023-10-17', present: 26, absent: 4 },
  { class: 'Class C', teacher: 'Mr. Smith', date: '2023-10-18', present: 28, absent: 2 },
  { class: 'Class A', teacher: 'Ms. Johnson', date: '2023-10-19', present: 27, absent: 3 },
  { class: 'Class B', teacher: 'Mr. Smith', date: '2023-10-20', present: 25, absent: 5 },
  { class: 'Class C', teacher: 'Ms. Johnson', date: '2023-10-21', present: 29, absent: 1 },
  { class: 'Class A', teacher: 'Mr. Smith', date: '2023-10-22', present: 26, absent: 4 },
  { class: 'Class B', teacher: 'Ms. Johnson', date: '2023-10-23', present: 28, absent: 2 },
  { class: 'Class C', teacher: 'Mr. Smith', date: '2023-10-24', present: 27, absent: 3 },
  { class: 'Class A', teacher: 'Ms. Johnson', date: '2023-10-25', present: 25, absent: 5 },
  { class: 'Class B', teacher: 'Mr. Smith', date: '2023-10-26', present: 29, absent: 1 },
  { class: 'Class C', teacher: 'Ms. Johnson', date: '2023-10-27', present: 26, absent: 4 },
  { class: 'Class A', teacher: 'Mr. Smith', date: '2023-10-28', present: 28, absent: 2 },
  { class: 'Class B', teacher: 'Ms. Johnson', date: '2023-10-29', present: 27, absent: 3 },
  { class: 'Class C', teacher: 'Mr. Smith', date: '2023-10-30', present: 25, absent: 5 },
  { class: 'Class A', teacher: 'Ms. Johnson', date: '2023-10-31', present: 29, absent: 1 },
];

const AttendanceDashboard = () => {
  const [attendanceData, setAttendanceData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [filteredRecords, setFilteredRecords] = useState([]);

  useEffect(() => {
    // Initialize classes and teachers lists
    const classList = [...new Set(attendanceRecords.map((record) => record.class))];
    setClasses(classList);
    const teacherList = [...new Set(attendanceRecords.map((record) => record.teacher))];
    setTeachers(teacherList);
    fetchAttendanceData();
  }, []);

  const fetchAttendanceData = async () => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      prepareChartData(attendanceRecords);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const prepareChartData = (records) => {
    // Aggregate data for the chart
    const dateLabels = [...new Set(records.map((record) => record.date))].sort();
    const presentData = dateLabels.map((date) => {
      return records
        .filter((record) => record.date === date)
        .reduce((sum, record) => sum + record.present, 0);
    });
    const absentData = dateLabels.map((date) => {
      return records
        .filter((record) => record.date === date)
        .reduce((sum, record) => sum + record.absent, 0);
    });

    setAttendanceData({
      labels: dateLabels,
      datasets: [
        {
          label: 'Present Students',
          data: presentData,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          fill: false,
          tension: 0.1,
        },
        {
          label: 'Absent Students',
          data: absentData,
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
    let records = [...attendanceRecords];

    if (selectedClass) {
      records = records.filter((record) => record.class === selectedClass);
    }
    if (selectedTeacher) {
      records = records.filter((record) => record.teacher === selectedTeacher);
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
    doc.text('Attendance Report', 14, 15);
    doc.setFontSize(10);

    let yPosition = 25;
    filteredRecords.forEach((record, index) => {
      const line = `Date: ${record.date}, Class: ${record.class}, Teacher: ${record.teacher}, Present: ${record.present}, Absent: ${record.absent}`;
      doc.text(line, 14, yPosition + index * 7);
    });

    doc.save('attendance_report.pdf');
  };

  const tableHeaders = ['Date', 'Class', 'Teacher', 'Present', 'Absent'];

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
              <Line data={attendanceData} options={{ maintainAspectRatio: true }} />
            )}
          </div>

          {/* Filters Section */}
          <div className="w-full lg:w-1/3 bg-white p-4 rounded-lg shadow-lg">
            <div className="flex flex-col space-y-4 mb-4">
              <div>
                <label className="block text-gray-700">Filter by Class</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="border border-gray-300 rounded-md px-2 py-1 w-full"
                >
                  <option value="">-- All Classes --</option>
                  {classes.map((className, idx) => (
                    <option key={idx} value={className}>
                      {className}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700">Filter by Teacher</label>
                <select
                  value={selectedTeacher}
                  onChange={(e) => setSelectedTeacher(e.target.value)}
                  className="border border-gray-300 rounded-md px-2 py-1 w-full"
                >
                  <option value="">-- All Teachers --</option>
                  {teachers.map((teacher, idx) => (
                    <option key={idx} value={teacher}>
                      {teacher}
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
              <h2 className="text-2xl font-semibold mb-4">Attendance Report</h2>
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
                          <td className="py-2 px-4 border">{record.class}</td>
                          <td className="py-2 px-4 border">{record.teacher}</td>
                          <td className="py-2 px-4 border">{record.present}</td>
                          <td className="py-2 px-4 border">{record.absent}</td>
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
                      filename="attendance_report.csv"
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

export default AttendanceDashboard;
