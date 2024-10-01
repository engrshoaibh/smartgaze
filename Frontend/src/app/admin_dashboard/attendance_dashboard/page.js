'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/side_nav';
import Header from '../../components/header';
import 'chart.js/auto';
import jsPDF from 'jspdf';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import { CSVLink } from 'react-csv';
import AttendanceChart from './components/AttendanceChart';
import { getTeachers, getClasses, getAttendance } from '../../../../../Backend/utils/api';

const AttendanceDashboard = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
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

  const fetchTeachers = async () => {
    const response = await getTeachers();
    const teacherList = response.data.teachers.map(record => ({
      id: record._id, 
      name: record.name,
    }));
    setTeachers(teacherList);
  };

  const fetchClasses = async () => {
    try {
      const response = await getClasses();
      const classList = [...new Set(response.data.class.map(record => record.name))];
      setClasses(classList);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const apiResponse = await getAttendance();
      const Records = convertAttendanceData(apiResponse);
      setAttendanceRecords(Records);
      setFilteredRecords(Records);
      setGraphFilteredRecords(Records);
      prepareChartData(Records);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
    fetchClasses();
    fetchAttendance();
  }, []);

  const prepareChartData = (records) => {
    const dateLabels = [...new Set(records.map(record => record.date))].sort();
    const presentData = dateLabels.map(date => records.filter(record => record.date === date).reduce((sum, record) => sum + record.present, 0));
    const absentData = dateLabels.map(date => records.filter(record => record.date === date).reduce((sum, record) => sum + record.absent, 0));

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

  const filterRecords = useCallback(() => {
    let records = [...attendanceRecords];
  
    // Only filter by class if a specific class is selected
    if (selectedClass ) {
      records = records.filter(record => record.class === selectedClass);
    }
  
    // Only filter by teacher if a specific teacher is selected
    if (selectedTeacher) {
      records = records.filter(record => record.teacher === selectedTeacher);
    }
  
    // Only filter by start date if a start date is provided
    if (startDate) {
      records = records.filter(record => new Date(record.date) >= startDate);
    }
  
    // Only filter by end date if an end date is provided
    if (endDate) {
      records = records.filter(record => new Date(record.date) <= endDate);
    }
  
    // Set the filtered records
    setFilteredRecords(records);
  }, [attendanceRecords, selectedClass, selectedTeacher, startDate, endDate]);
  
  const handleFilterChange = () => {
    setLoading(true);
    filterRecords();
    setLoading(false);
  };

  const handleGraphFilterChange = () => {
    let records = [...attendanceRecords];

    if (selectedGraphClass) {
      records = records.filter(record => record.class === selectedGraphClass);
    }
    if (selectedGraphTeacher) {
      records = records.filter(record => record.teacher === selectedGraphTeacher);
    }

    setGraphFilteredRecords(records);
    prepareChartData(records);
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
    const recordsForReport = filteredRecords.filter(record => record.class === className && record.date === date);
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

  const convertAttendanceData = (data) => {
    return data.map(record => ({
      class: record.class_id.name,
      teacher: record.teacher_id.name,
      teacher_id: record.teacher_id._id,
      date: new Date(record.class_id.createdAt).toISOString().split('T')[0],
      time: record.time,
      present: record.class_id.courses[0].students.length,
      absent: record.studentsAbsent.length,
    }));
  };

  const tableHeaders = ['Time', 'Class', 'Teacher', 'Present', 'Absent'];

  return (
    <div className="flex min-h-screen dark:bg-gray-900 bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6">
        <Header />

        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 mt-20 " style={{ height: '450px' }}>
          {/* Chart Section */}
          <AttendanceChart
            loading={loading}
            attendanceData={attendanceData}
            classes={classes}
            teachers={teachers}
            selectedGraphClass={selectedGraphClass}
            selectedGraphTeacher={selectedGraphTeacher}
            onGraphClassChange={onGraphClassChange}
            onGraphTeacherChange={onGraphTeacherChange}
          />

          {/* Filters Section */}
          <div className="w-full lg:w-1/3 p-4 rounded-lg shadow-lg dark:bg-gray-800 bg-white text-black dark:text-white">
            <div className="flex space-x-4 mb-4">
              <div className="flex-1">
                <select
                  value={selectedClass}
                  onChange={(e) => {
                    setSelectedClass(e.target.value);
                    handleFilterChange();  // Call handleFilterChange after setting selected class
                  }}
                  className="border dark:border-gray-700 bg-gray-300 text-black dark:bg-gray-700 dark:text-white border-gray-300 rounded-md px-2 py-1 w-full"
                >
                  <option value="">All Classes</option>
                  {classes.map((className, idx) => (
                    <option key={idx} value={className}>
                      {className}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <select
                  value={selectedTeacher}
                  onChange={(e) => {
                    setSelectedTeacher(e.target.value);
                    handleFilterChange();
                  }}
                  className="border dark:border-gray-700 bg-gray-300 text-black dark:bg-gray-700 dark:text-white border-gray-300 rounded-md px-2 py-1 w-full"
                >
                  <option value="">All Teachers</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>

              </div>

            </div>

            {/* New Row for Date Range */}
            <div className="mb-4">
              <label className="block text-black dark:text-white">Date Range</label>
              <div className="flex space-x-2">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => {
                    setStartDate(date);
                    handleFilterChange();  // Call handleFilterChange after setting start date
                  }}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  className="border dark:border-gray-700 bg-gray-300 text-black dark:bg-gray-700 dark:text-white border-gray-300 rounded-md px-2 py-1 w-full text-sm"
                  placeholderText="Start Date"
                />

                <DatePicker
                  selected={endDate}
                  onChange={(date) => {
                    setEndDate(date);
                    handleFilterChange();  // Call handleFilterChange after setting end date
                  }}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  className="border dark:border-gray-700 bg-gray-300 text-black dark:bg-gray-700 dark:text-white border-gray-300 rounded-md px-2 py-1 w-full text-sm"
                  placeholderText="End Date"
                />
              </div>
            </div>



            {/* Reports List */}
            {filteredRecords.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold text-black dark:text-white">Attendance Reports:</h3>
                <ul className="list-disc list-inside">
                  {filteredRecords.map((record, idx) => (
                    <li
                      key={idx}
                      onClick={() => handleReportClick(record.class, record.date)}
                      className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
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
            <div className="p-6 w-full max-w-md mx-auto rounded-lg dark:bg-gray-800 bg-white text-black dark:text-white">
              <h2 className="text-2xl font-semibold mb-4">
                {selectedReport[0].class} Attendance Report
              </h2>
              <p>Date: {selectedReport[0].date}</p>

              <table className="min-w-full border-collapse border dark:border-gray-700 border-gray-200">
                <thead>
                  <tr>
                    {tableHeaders.map((header, idx) => (
                      <th key={idx} className="p-2 border dark:border-gray-700 border-gray-200 text-black dark:text-white">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {selectedReport.map((record, index) => (
                    <tr key={index}>
                      <td className="p-2 border dark:border-gray-700 border-gray-200 text-black dark:text-white">{record.time}</td>
                      <td className="p-2 border dark:border-gray-700 border-gray-200 text-black dark:text-white">{record.class}</td>
                      <td className="p-2 border dark:border-gray-700 border-gray-200 text-black dark:text-white">{record.teacher}</td>
                      <td className="p-2 border dark:border-gray-700 border-gray-200 text-black dark:text-white">{record.present}</td>
                      <td className="p-2 border dark:border-gray-700 border-gray-200 text-black dark:text-white">{record.absent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex space-x-4 mt-4">
                <button
                  onClick={() => exportToPDF(selectedReport)}
                  className="px-4 py-2 rounded bg-gray-300 text-black dark:bg-gray-700 dark:text-white"
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
                  className="px-4 py-2 rounded bg-gray-300 text-black dark:bg-gray-700 dark:text-white"
                >
                  Export as CSV
                </CSVLink>
                <button
                  onClick={() => setModalIsOpen(false)}
                  className="px-4 py-2 rounded bg-gray-300 text-black dark:bg-gray-700 dark:text-white"
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
