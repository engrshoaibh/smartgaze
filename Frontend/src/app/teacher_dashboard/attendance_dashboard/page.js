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
import { getMyClassesAttendance } from '../../../../../Backend/utils/api';

const AttendanceDashboard = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [attendanceData, setAttendanceData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [graphFilteredRecords, setGraphFilteredRecords] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedGraphCourse, setSelectedGraphCourse] = useState('');
  const [selectedGraphStudent, setSelectedGraphStudent] = useState('');



  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const apiResponse = await getMyClassesAttendance();
      const Records = convertAttendanceData(apiResponse);
      const studentList = [...new Set(Records.map(record =>({
        id: record.rollno, 
        name: record.student,
      })
      ))];
      const courseList =  [...new Set(Records.map(record => record.courseCode))];
      setCourses(courseList);
      setStudents(studentList);
      
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
  
    // Only filter by course if a specific course is selected
    if (selectedCourse ) {
      records = records.filter(record => record.courseCode === selectedCourse);
    }
  
    // Only filter by student if a specific student is selected
    if (selectedStudent) {
      records = records.filter(record => record.student === selectedStudent);
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
  }, [attendanceRecords, selectedCourse, selectedStudent, startDate, endDate]);
  
  const handleFilterChange = () => {
    setLoading(true);
    filterRecords();
    setLoading(false);
  };

  const handleGraphFilterChange = () => {
    let records = [...attendanceRecords];

    if (selectedGraphCourse) {
      records = records.filter(record => record.courseCode === selectedGraphCourse);
    }
    if (selectedGraphStudent) {
      records = records.filter(record => record.student === selectedGraphStudent);
    }

    setGraphFilteredRecords(records);
    prepareChartData(records);
  };

  const onGraphCourseChange = (e) => {
    setSelectedGraphCourse(e.target.value);
    handleGraphFilterChange();
  };

  const onGraphStudentChange = (e) => {
    setSelectedGraphStudent(e.target.value);
    handleGraphFilterChange();
  };

  const handleReportClick = (courseName, date) => {
    console.log(courseName);
    
    const recordsForReport = filteredRecords.filter(record => record.courseCode === courseName && record.date === date);
    setSelectedReport(recordsForReport);
    setModalIsOpen(true);
  };

  const exportToPDF = (records) => {
    const doc = new jsPDF();
    doc.text(`Attendance Report for ${records[0].courseCode} on ${records[0].date}`, 14, 15);
    doc.setFontSize(10);

    records.forEach((record, index) => {
      const line = `Time: ${record.time}, Student: ${record.student}, Present: ${record.present}, Absent: ${record.absent}`;
      doc.text(line, 14, 25 + index * 10);
    });

    doc.save(`attendance_report_${records[0].courseCode}_${records[0].date}.pdf`);
  };

  const convertAttendanceData = (apiResponse) => {
    return apiResponse.map(record => {
      const allStudents = [...record.studentsPresent, ...record.studentsAbsent];
  
      return allStudents.map(student => ({
        courseCode: record.courseCode,
        student: student.name,
        rollno: student.rollno,
        date: new Date(record.date).toISOString().split('T')[0],  // Format date as YYYY-MM-DD
        time: record.time,  // Keep the time as is
        present: record.studentsPresent.length,  // Count of present students
        absent: record.studentsAbsent.length,    // Count of absent students
      }));
    }).flat();  // Flatten the array so that each student gets their own attendance record
  };
  

  const tableHeaders = ['Time', 'CourseCode', 'Student', 'Present', 'Absent'];

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
            courses={courses}
            students={students}
            selectedGraphCourse={selectedGraphCourse}
            selectedGraphStudent={selectedGraphStudent}
            onGraphCourseChange={onGraphCourseChange}
            onGraphStudentChange={onGraphStudentChange}
          />

          {/* Filters Section */}
          <div className="w-full lg:w-1/3 p-4 rounded-lg shadow-lg dark:bg-gray-800 bg-white text-black dark:text-white">
            <div className="flex space-x-4 mb-4">
              <div className="flex-1">
                <select
                  value={selectedCourse}
                  onChange={(e) => {
                    setSelectedCourse(e.target.value);
                    handleFilterChange();  // Call handleFilterChange after setting selected class
                  }}
                  className="border dark:border-gray-700 bg-gray-300 text-black dark:bg-gray-700 dark:text-white border-gray-300 rounded-md px-2 py-1 w-full"
                >
                  <option value="">All Courses</option>
                  {courses.map((className, idx) => (
                    <option key={idx} value={className}>
                      {className}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <select
                  value={selectedStudent}
                  onChange={(e) => {
                    setSelectedStudent(e.target.value);
                    handleFilterChange();
                  }}
                  className="border dark:border-gray-700 bg-gray-300 text-black dark:bg-gray-700 dark:text-white border-gray-300 rounded-md px-2 py-1 w-full"
                >
                  <option value="">All Students</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name}
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
                      onClick={() => handleReportClick(record.courseCode, record.date)}
                      className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      {record.courseCode} (Attendance {record.date})
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
                {selectedReport[0].courseCode} Attendance Report
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
                      <td className="p-2 border dark:border-gray-700 border-gray-200 text-black dark:text-white">{record.courseCode}</td>
                      <td className="p-2 border dark:border-gray-700 border-gray-200 text-black dark:text-white">{record.student}</td>
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
                    { label: 'CourseCode', key: 'courseCode' },
                    { label: 'Student', key: 'student' },
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
