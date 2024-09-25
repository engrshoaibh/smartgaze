'use client';

import React, { useState, useEffect, useContext } from 'react';
import Sidebar from '../components/side_nav';
import Header from '../components/header';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import jsPDF from 'jspdf';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import { CSVLink } from 'react-csv';
import { ThemeContext } from '../../../context/ThemeContext';   // Import ThemeContext for dark mode

const attendanceRecords = [
  { class: 'Class A', teacher: 'Mr. Smith', date: '2023-09-01', time: '09:00 AM', present: 28, absent: 2 },
  { class: 'Class A', teacher: 'Mr. Smith', date: '2023-09-01', time: '01:00 PM', present: 26, absent: 4 },
  { class: 'Class B', teacher: 'Mr. Smith', date: '2023-09-02', time: '09:00 AM', present: 27, absent: 3 },
  { class: 'Class A', teacher: 'Ms. Johnson', date: '2023-09-03', time: '09:00 AM', present: 29, absent: 1 },
  { class: 'Class A', teacher: 'Ms. Johnson', date: '2023-09-03', time: '01:00 PM', present: 30, absent: 0 },
  { class: 'Class C', teacher: 'Ms. Johnson', date: '2023-09-04', time: '09:00 AM', present: 26, absent: 4 },
  { class: 'Class C', teacher: 'Ms. Johnson', date: '2023-09-04', time: '01:00 PM', present: 24, absent: 6 },
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
  const [graphFilteredRecords, setGraphFilteredRecords] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedGraphClass, setSelectedGraphClass] = useState('');
  const [selectedGraphTeacher, setSelectedGraphTeacher] = useState('');

  const { theme } = useContext(ThemeContext); // Get the current theme

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
      setFilteredRecords(attendanceRecords); // Initial full records for both
      setGraphFilteredRecords(attendanceRecords);
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
    setLoading(false);
  };

  const handleGraphFilterChange = () => {
    let records = [...attendanceRecords];

    if (selectedGraphClass) {
      records = records.filter((record) => record.class === selectedGraphClass);
    }
    if (selectedGraphTeacher) {
      records = records.filter((record) => record.teacher === selectedGraphTeacher);
    }

    setGraphFilteredRecords(records);
    prepareChartData(records); // Update chart data based on graph filtered records
  };

  const onGraphClassChange = (e) => {
    setSelectedGraphClass(e.target.value);
    handleGraphFilterChange();
  };

  const onGraphTeacherChange = (e) => {
    setSelectedGraphTeacher(e.target.value);
    handleGraphFilterChange();
  };

  const handleReportClick = (className, date) => {
    const recordsForReport = filteredRecords.filter(
      (record) => record.class === className && record.date === date
    );
    setSelectedReport(recordsForReport);
    setModalIsOpen(true);
  };

  const exportToPDF = (records) => {
    const doc = new jsPDF();
    doc.text(`Attendance Report for ${records[0].class} on ${records[0].date}`, 14, 15);
    doc.setFontSize(10);

    records.forEach((record, index) => {
      const line = `Time: ${record.time}, Teacher: ${record.teacher}, Present: ${record.present}, Absent: ${record.absent}`;
      doc.text(line, 14, 25 + index * 10);
    });

    doc.save(`attendance_report_${records[0].class}_${records[0].date}.pdf`);
  };

  const tableHeaders = ['Time', 'Class', 'Teacher', 'Present', 'Absent'];

  return (
    <div className={`flex min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'}`}>
      <Sidebar />
      <main className="flex-1 p-6">
        <Header />

        <div className={`flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 mt-20 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`} style={{ height: '450px' }}>
          {/* Chart Section */}
          <div className={`flex-1 p-4 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
            {loading ? (
              <p>Loading data...</p>
            ) : (
              <div>
                {/* Graph Filters */}
                <div className="flex justify-end mb-4">
                  <select
                    value={selectedGraphClass}
                    onChange={onGraphClassChange}
                    className={`border ${theme === 'dark' ? 'border-gray-700 bg-gray-700 text-white' : 'border-gray-300'} rounded-md px-2 py-1`}
                  >
                    <option value="">All Classes</option>
                    {classes.map((className, idx) => (
                      <option key={idx} value={className}>
                        {className}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedGraphTeacher}
                    onChange={onGraphTeacherChange}
                    className={`border ${theme === 'dark' ? 'border-gray-700 bg-gray-700 text-white' : 'border-gray-300'} rounded-md px-2 py-1 ml-2`}
                  >
                    <option value="">All Teachers</option>
                    {teachers.map((teacher, idx) => (
                      <option key={idx} value={teacher}>
                        {teacher}
                      </option>
                    ))}
                  </select>
                </div>

                <Bar data={attendanceData} options={{ maintainAspectRatio: true }} />
              </div>
            )}
          </div>

          {/* Filters Section */}
          <div className={`w-full lg:w-1/3 p-4 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
            <div className="flex space-x-4 mb-4">
              {/* Existing Filters */}
              <div className="flex-1">
                <label className="block">Filter by Class</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className={`border ${theme === 'dark' ? 'border-gray-700 bg-gray-700 text-white' : 'border-gray-300'} rounded-md px-2 py-1 w-full`}
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
                <label className="block">Filter by Teacher</label>
                <select
                  value={selectedTeacher}
                  onChange={(e) => setSelectedTeacher(e.target.value)}
                  className={`border ${theme === 'dark' ? 'border-gray-700 bg-gray-700 text-white' : 'border-gray-300'} rounded-md px-2 py-1 w-full`}
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
                <label className="block">Date Range</label>
                <div className="flex space-x-2">
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    className={`border ${theme === 'dark' ? 'border-gray-700 bg-gray-700 text-white' : 'border-gray-300'} rounded-md px-2 py-1 w-full text-sm`}
                    placeholderText="Start Date"
                  />
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    className={`border ${theme === 'dark' ? 'border-gray-700 bg-gray-700 text-white' : 'border-gray-300'} rounded-md px-2 py-1 w-full text-sm`}
                    placeholderText="End Date"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleFilterChange}
              className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-300 text-black'}`}
            >
              Apply Filters
            </button>

            {/* Reports List */}
            {filteredRecords.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold">Attendance Reports:</h3>
                <ul className="list-disc list-inside">
                  {filteredRecords.map((record, idx) => (
                    <li
                      key={idx}
                      onClick={() => handleReportClick(record.class, record.date)}
                      className="cursor-pointer hover:text-blue-600"
                    >
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
            <div className={`p-6 w-full max-w-md mx-auto rounded-lg ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
              <h2 className="text-2xl font-semibold mb-4">
                {selectedReport[0].class} Attendance Report
              </h2>
              <p>Date: {selectedReport[0].date}</p>

              <table className={`min-w-full border-collapse border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <thead>
                  <tr>
                    {tableHeaders.map((header, idx) => (
                      <th key={idx} className={`p-2 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {selectedReport.map((record, index) => (
                    <tr key={index}>
                      <td className={`p-2 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>{record.time}</td>
                      <td className={`p-2 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>{record.class}</td>
                      <td className={`p-2 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>{record.teacher}</td>
                      <td className={`p-2 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>{record.present}</td>
                      <td className={`p-2 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>{record.absent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex space-x-4 mt-4">
                <button
                  onClick={() => exportToPDF(selectedReport)}
                  className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-300 text-black'}`}
                >
                  Export as PDF
                </button>
                <CSVLink
                  data={selectedReport}
                  headers={[
                    { label: 'Time', key: 'time' },
                    { label: 'Date', key: 'date' },
                    { label: 'Class', key: 'class' },
                    { label: 'Teacher', key: 'teacher' },
                    { label: 'Present', key: 'present' },
                    { label: 'Absent', key: 'absent' },
                  ]}
                  filename={`attendance_report_${selectedReport[0].class}_${selectedReport[0].date}.csv`}
                  className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-300 text-black'}`}
                >
                  Export as CSV
                </CSVLink>
                <button
                  onClick={() => setModalIsOpen(false)}
                  className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-300 text-black'}`}
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
