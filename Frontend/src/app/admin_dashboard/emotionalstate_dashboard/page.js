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
// Emotion labels
const emotionLabels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral'];

const emotionalRecords = [
  { class: 'Class A', date: '2023-09-01', time: '09:00 AM', happy: 10, sad: 5, angry: 2, student: 'Alice' },
  { class: 'Class A', date: '2023-09-01', time: '01:00 PM', happy: 12, sad: 3, angry: 1, student: 'Bob' },
  { class: 'Class B', date: '2023-09-02', time: '09:00 AM', happy: 9, sad: 6, angry: 2, student: 'Charlie' },
  { class: 'Class A', date: '2023-09-03', time: '09:00 AM', happy: 15, sad: 2, angry: 1, student: 'Alice' },
  { class: 'Class A', date: '2023-09-03', time: '01:00 PM', happy: 14, sad: 3, angry: 0, student: 'David' },
  { class: 'Class C', date: '2023-09-04', time: '09:00 AM', happy: 10, sad: 4, angry: 2, student: 'Eva' },
  { class: 'Class C', date: '2023-09-04', time: '01:00 PM', happy: 11, sad: 5, angry: 1, student: 'Frank' },
];

const EmotionalDashboard = () => {
  const [emotionalData, setEmotionalData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [graphFilteredRecords, setGraphFilteredRecords] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedGraphClass, setSelectedGraphClass] = useState('');
  const [selectedGraphStudent, setSelectedGraphStudent] = useState('');


  useEffect(() => {
    const classList = [...new Set(emotionalRecords.map((record) => record.class))];
    setClasses(classList);
    const studentList = [...new Set(emotionalRecords.map((record) => record.student))];
    setStudents(studentList);
    fetchEmotionalData();
  }, []);

  const fetchEmotionalData = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setFilteredRecords(emotionalRecords); // Initial full records for both
      setGraphFilteredRecords(emotionalRecords);
      prepareChartData(emotionalRecords);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  // Filter and prepare data for the bar chart
  const prepareChartData = (records) => {
    const dateLabels = [...new Set(records.map((record) => record.date))].sort();

    // Generate emotional data counts for each emotion type
    const emotionData = emotionLabels.map((emotion) => {
      return dateLabels.map((date) => {
        const dailyRecords = records.filter((record) => record.date === date);
        return dailyRecords.reduce((acc, record) => acc + record[emotion.toLowerCase()] || 0, 0); // Sum counts of each emotion
      });
    });

    setEmotionalData({
      labels: dateLabels,
      datasets: emotionLabels.map((emotion, index) => ({
        label: emotion,
        data: emotionData[index],
        backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`,
        borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
        borderWidth: 1,
      })),
    });
  };

  const handleFilterChange = () => {
    setLoading(true);
    let records = [...emotionalRecords];

    if (selectedClass) {
      records = records.filter((record) => record.class === selectedClass);
    }
    if (selectedStudent) {
      records = records.filter((record) => record.student === selectedStudent);
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
    let records = [...emotionalRecords];

    if (selectedGraphClass) {
      records = records.filter((record) => record.class === selectedGraphClass);
    }
    if (selectedGraphStudent) {
      records = records.filter((record) => record.student === selectedGraphStudent);
    }

    setGraphFilteredRecords(records);
    prepareChartData(records); // Update chart data based on graph filtered records
  };

  const onGraphClassChange = (e) => {
    setSelectedGraphClass(e.target.value);
    handleGraphFilterChange();
  };

  const onGraphStudentChange = (e) => {
    setSelectedGraphStudent(e.target.value);
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
    doc.text(`Emotional Report for ${records[0].class} on ${records[0].date}`, 14, 15);
    doc.setFontSize(10);

    records.forEach((record, index) => {
      const line = `Time: ${record.time}, Student: ${record.student}, Present: ${record.present}, Absent: ${record.absent}`;
      doc.text(line, 14, 25 + index * 10);
    });

    doc.save(`emotional_report_${records[0].class}_${records[0].date}.pdf`);
  };

  const tableHeaders = ['Time', 'Class', 'Student', 'Emotion'];

  return (
    <div className="flex min-h-screen dark:bg-gray-900 bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6">
        <Header />

        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 mt-20 " style={{ height: '450px' }}>
          {/* Chart Section */}
          <div className="flex-1 p-4 rounded-lg shadow-lg dark:bg-gray-800 bg-white text-black dark:text-white">
            {loading ? (
              <p className="text-black dark:text-white">Loading data...</p>
            ) : (
              <div>
                {/* Graph Filters */}
                <div className="flex justify-end mb-4">
                  <select
                    value={selectedGraphClass}
                    onChange={onGraphClassChange}
                    className="border dark:border-gray-700 bg-gray-700 text-white border-gray-300 rounded-md px-2 py-1"
                  >
                    <option value="">All Classes</option>
                    {classes.map((className, idx) => (
                      <option key={idx} value={className}>
                        {className}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedGraphStudent}
                    onChange={onGraphStudentChange}
                    className="border dark:border-gray-700 bg-gray-700 text-white border-gray-300 rounded-md px-2 py-1 ml-2"
                  >
                    <option value="">All Students</option>
                    {students.map((student, idx) => (
                      <option key={idx} value={student}>
                        {student}
                      </option>
                    ))}
                  </select>
                </div>

                <Bar data={emotionalData} options={{ maintainAspectRatio: true }} />
              </div>
            )}
          </div>

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
                  className="border dark:border-gray-700 bg-gray-700 text-white border-gray-300 rounded-md px-2 py-1 w-full"
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
                  value={selectedStudent}
                  onChange={(e) => {
                    setSelectedStudent(e.target.value);
                    handleFilterChange();  // Call handleFilterChange after setting selected student
                  }}
                  className="border dark:border-gray-700 bg-gray-700 text-white border-gray-300 rounded-md px-2 py-1 w-full"
                >
                  <option value="">All Students</option>
                  {students.map((student, idx) => (
                    <option key={idx} value={student}>
                      {student}
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
                  className="border dark:border-gray-700 bg-gray-700 text-white border-gray-300 rounded-md px-2 py-1 w-full text-sm"
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
                  className="border dark:border-gray-700 bg-gray-700 text-white border-gray-300 rounded-md px-2 py-1 w-full text-sm"
                  placeholderText="End Date"
                />
              </div>
            </div>

        

            {/* Reports List */}
            {filteredRecords.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold text-black dark:text-white">Emotional Reports:</h3>
                <ul className="list-disc list-inside">
                  {filteredRecords.map((record, idx) => (
                    <li
                      key={idx}
                      onClick={() => handleReportClick(record.class, record.date)}
                      className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      {record.class} (Emotional {record.date})
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
                {selectedReport[0].class} Emotional Report
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
                      <td className="p-2 border dark:border-gray-700 border-gray-200 text-black dark:text-white">{record.student}</td>
                      <td className="p-2 border dark:border-gray-700 border-gray-200 text-black dark:text-white">{record.emotion}</td>
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
                    { label: 'Student', key: 'student' },
                    { label: 'Present', key: 'present' },
                    { label: 'Absent', key: 'absent' },
                  ]}
                  filename={`emotional_report_${selectedReport[0].class}_${selectedReport[0].date}.csv`}
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

export default EmotionalDashboard;
