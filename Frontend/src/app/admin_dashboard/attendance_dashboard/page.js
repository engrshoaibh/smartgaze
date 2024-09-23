'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '../components/side_nav';
import Header from '../components/header';
import { Bar } from 'react-chartjs-2';
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
  const [selectedReport, setSelectedReport] = useState(null); // State for selected report

  useEffect(() => {
    const classList = [...new Set(attendanceRecords.map((record) => record.class))];
    setClasses(classList);
    const teacherList = [...new Set(attendanceRecords.map((record) => record.teacher))];
    setTeachers(teacherList);
    fetchAttendanceData();
  }, []);

  const fetchAttendanceData = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      prepareChartData(attendanceRecords);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const prepareChartData = (records) => {
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
          borderWidth: 1,
        },
        {
          label: 'Absent Students',
          data: absentData,
          backgroundColor: 'rgba(255,99,132,0.4)',
          borderColor: 'rgba(255,99,132,1)',
          borderWidth: 1,
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
  };

  const handleReportClick = (record) => {
    setSelectedReport(record);
    setModalIsOpen(true);
  };

  const exportToPDF = (record) => {
    const doc = new jsPDF();
    doc.text(`Attendance Report for ${record.class} on ${record.date}`, 14, 15);
    doc.setFontSize(10);
    const line = `Teacher: ${record.teacher}, Present: ${record.present}, Absent: ${record.absent}`;
    doc.text(line, 14, 25);
    doc.save(`attendance_report_${record.class}_${record.date}.pdf`);
  };

  const tableHeaders = ['Date', 'Class', 'Teacher', 'Present', 'Absent'];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6">
        <Header />

        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 mt-20" style={{ height: '450px' }}>
          {/* Chart Section */}
          <div className="flex-1 bg-white p-4 rounded-lg shadow-lg ">
            {loading ? (
              <p>Loading data...</p>
            ) : (
              <Bar data={attendanceData} options={{ maintainAspectRatio: true }} />
            )}
          </div>

          {/* Filters Section */}
          <div className="w-full lg:w-1/3 bg-white p-4 rounded-lg shadow-lg ">
            <div className="flex space-x-4 mb-4">
              <div className="flex-1">
                <label className="block text-gray-700">Filter by Class</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="border border-gray-300 rounded-md px-2 py-1 w-full"
                >
                  <option value="">All</option>
                  {classes.map((className, idx) => (
                    <option key={idx} value={className}>
                      {className}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <label className="block text-gray-700">Filter by Teacher</label>
                <select
                  value={selectedTeacher}
                  onChange={(e) => setSelectedTeacher(e.target.value)}
                  className="border border-gray-300 rounded-md px-2 py-1 w-full"
                >
                  <option value="">All</option>
                  {teachers.map((teacher, idx) => (
                    <option key={idx} value={teacher}>
                      {teacher}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <label className="block text-gray-700">Date Range</label>
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
              </div>
            </div>

            <button
              onClick={handleFilterChange}
              className="bg-gray-300 text-black px-4 py-2 rounded"
            >
              Apply Filters
            </button>

            {/* Reports List */}
            {filteredRecords.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold">Attendance Reports:</h3>
                <ul className="list-disc list-inside">
                  {filteredRecords.map((record, idx) => (
                    <li key={idx} onClick={() => handleReportClick(record)} className="cursor-pointer hover:text-blue-600">
                      {record.class} (Attendance {record.date})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Modal for Selected Report */}
        {modalIsOpen && selectedReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-auto">
              <h2 className="text-2xl font-semibold mb-4">
                {selectedReport.class} Attendance Report
              </h2>
              <p>Date: {selectedReport.date}</p>
              <p>Teacher: {selectedReport.teacher}</p>
              <p>Present: {selectedReport.present}</p>
              <p>Absent: {selectedReport.absent}</p>
              <div className="flex space-x-4 mt-4">
                <button
                  onClick={() => exportToPDF(selectedReport)}
                  className="bg-gray-300 text-black px-4 py-2 rounded"
                >
                  Export as PDF
                </button>
                <CSVLink
                  data={[selectedReport]} // Only the selected report
                  headers={[
                    { label: 'Date', key: 'date' },
                    { label: 'Class', key: 'class' },
                    { label: 'Teacher', key: 'teacher' },
                    { label: 'Present', key: 'present' },
                    { label: 'Absent', key: 'absent' },
                  ]}
                  filename={`attendance_report_${selectedReport.class}_${selectedReport.date}.csv`}
                  className="bg-gray-300 text-black px-4 py-2 rounded"
                >
                  Export as CSV
                </CSVLink>
                <button
                  onClick={() => setModalIsOpen(false)}
                  className="bg-gray-300 text-black px-4 py-2 rounded"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AttendanceDashboard;

