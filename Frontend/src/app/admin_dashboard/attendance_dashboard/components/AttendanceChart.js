// components/AttendanceChart.js

import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const AttendanceChart = ({
    loading,
    attendanceData,
    classes,
    teachers,
    selectedGraphClass,
    selectedGraphTeacher,
    onGraphClassChange,
    onGraphTeacherChange,
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
                            value={selectedGraphClass}
                            onChange={onGraphClassChange}
                            className="border dark:border-gray-700 bg-gray-300 text-black dark:bg-gray-700 dark:text-white border-gray-300 rounded-md px-2 py-1"
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
                            className="border dark:border-gray-700 bg-gray-300 text-black dark:bg-gray-700 dark:text-white border-gray-300 rounded-md px-2 py-1 ml-2"
                        >
                            <option value="">All Teachers</option>
                                {teachers.map((teacher) => (
                                    <option key={teacher.id} value={teacher.id}>
                                        {teacher.name}
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
