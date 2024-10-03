// components/AttendanceChart.js

import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const AttendanceChart = ({
    loading,
    attendanceData,
    courses,
    students,
    selectedGraphCourse,
    selectedGraphStudent,
    onGraphCourseChange,
    onGraphStudentChange,
}) => {
    return (
        <div className="flex-1 p-4 rounded-lg shadow-lg dark:bg-gray-800 bg-white text-black dark:text-white">
            {loading ? (
                <p className="text-black dark:text-white">Loading data...</p>
            ) : (
                <div>
                    {/* Graph Filters */}
                    <div className="flex justify-end mb-4">
                        <select
                            value={selectedGraphCourse}
                            onChange={onGraphCourseChange}
                            className="border dark:border-gray-700 bg-gray-300 text-black dark:bg-gray-700 dark:text-white border-gray-300 rounded-md px-2 py-1"
                        >
                            <option value="">All Courses</option>
                            {courses.map((className, idx) => (
                                <option key={idx} value={className}>
                                    {className}
                                </option>
                            ))}
                        </select>

                        <select
                            value={selectedGraphStudent}
                            onChange={onGraphStudentChange}
                            className="border dark:border-gray-700 bg-gray-300 text-black dark:bg-gray-700 dark:text-white border-gray-300 rounded-md px-2 py-1 ml-2"
                        >
                            <option value="">All Students</option>
                                {students.map((student) => (
                                    <option key={student.id} value={student.id}>
                                        {student.name}
                                    </option>
                                ))}
                          

                        </select>
                    </div>

                    <Bar data={attendanceData} options={{ maintainAspectRatio: true }} />
                </div>
            )}
        </div>
    );
};

export default AttendanceChart;
