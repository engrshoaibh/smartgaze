import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import { getUsers } from '../../../../../../Backend/utils/api';
import UpdateProfileForm from './UpdateProfileForm';

const UserRecords = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [records, setRecords] = useState([]);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);

    const fetchRecords = async () => {
        try {
            const response = await getUsers();
            console.log("All Records Here", response.data.users);

            if (response && response.data) {
                setRecords(response.data.users);
            } else {
                throw new Error("Invalid response structure");
            }
        } catch (err) {
            console.error('Error fetching records:', err);
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchRecords();
    }, []);

    // Function to handle search input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Fallback dummy data
    const dummyRecord = [
        {
            id: '1',
            name: 'John Doe',
            email: 'john.doe@example.com',
            phoneNumber: '1234567890',
            department: 'Engineering',
            rollno: '101',
            role: 'student',
            profilePic: 'default_profile_pic.png',
        },
    ];

    // If no records fetched, use dummy data
    const recordsToDisplay = records.length > 0 ? records : dummyRecord;

    // Filter records based on search term
    const filteredRecords = recordsToDisplay.filter(record => {
        const { name, email, department, rollno, role } = record;
        return (
            name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (rollno && rollno.includes(searchTerm)) ||  // Check for roll number only for students
            department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            role.toLowerCase().includes(searchTerm.toLowerCase()) // Check for role
        );
    });

    // Handle editing the record
    const handleEditRecord = (record) => {
        setSelectedRecord(record); // Set the record to be edited
        setIsModalOpen(true); // Open the modal
    };

    // Handle deleting the record
    const handleDeleteRecord = (id) => {
        console.log(`Delete record with id: ${id}`);
        // Implement delete logic here
    };

    // Function to close the modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedRecord(null);
    };

    return (
        <div className="p-4 rounded-lg shadow-lg bg-white dark:bg-gray-800 ">
            <div className="relative mb-4">
                <input
                    type="text"
                    id="search"
                    placeholder="Search by Name, Email, Roll No, Department, or Role"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="border border-gray-300 dark:border-gray-600 rounded-lg px-10 py-2 w-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                />
                <FaSearch className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-400" />
            </div>
            {error && <div className="text-red-500">{error}</div>} {/* Display error message if any */}
            <table className="min-w-full table-auto bg-white dark:bg-gray-800">
                <thead className="bg-gray-200 dark:bg-gray-700">
                    <tr>
                        <th className="px-6 py-4 text-left font-semibold text-xs text-gray-800 dark:text-gray-200">Profile</th>
                        <th className="px-6 py-4 text-left font-semibold text-xs text-gray-800 dark:text-gray-200">Name</th>
                        <th className="px-6 py-4 text-left font-semibold text-xs text-gray-800 dark:text-gray-200">Email</th>
                        <th className="px-6 py-4 text-left font-semibold text-xs text-gray-800 dark:text-gray-200">Phone</th>
                        <th className="px-6 py-4 text-left font-semibold text-xs text-gray-800 dark:text-gray-200">Department</th>
                        <th className="px-6 py-4 text-left font-semibold text-xs text-gray-800 dark:text-gray-200">Roll No</th>
                        <th className="px-6 py-4 text-left font-semibold text-xs text-gray-800 dark:text-gray-200">Role</th>
                        <th className="px-6 py-4 text-left font-semibold text-xs text-gray-800 dark:text-gray-200">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredRecords.length > 0 ? (
                        filteredRecords.map((record) => (
                            <tr key={record.id} className={`hover:bg-gray-100 dark:hover:bg-gray-700 ${record.role === 'student' ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-700'}`}>
                                <td className="border-t px-6 py-4">
                                    <img
                                        src={record.profilePic || 'default_profile_pic.png'}
                                        alt={`${record.name}'s profile`}
                                        className="w-10 h-10 rounded-full"
                                    />
                                </td>
                                <td className="border-t px-6 py-4 text-xs text-gray-800 dark:text-gray-200">{record.name}</td>
                                <td className="border-t px-6 py-4 text-xs text-gray-800 dark:text-gray-200">{record.email}</td>
                                <td className="border-t px-6 py-4 text-xs text-gray-800 dark:text-gray-200">{record.phoneNumber}</td>
                                <td className="border-t px-6 py-4 text-xs text-gray-800 dark:text-gray-200">{record.department}</td>
                                <td className="border-t px-6 py-4 text-xs text-gray-800 dark:text-gray-200">{record.rollno || '-'}</td>
                                <td className="border-t px-6 py-4 text-xs text-gray-800 dark:text-gray-200">{record.role}</td>
                                <td className="border-t px-6 py-4 flex space-x-2">
                                    <button
                                        onClick={() => handleEditRecord(record)}
                                        className="text-yellow-500 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteRecord(record.id)}
                                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="border-t px-6 py-4 text-center text-gray-500 dark:text-gray-400 text-xs">
                                No records found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Modal for UpdateProfileForm */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="fixed inset-0 bg-gray-800 opacity-50"></div> {/* Modal background */}
                    <div className="rounded-lg p-6 relative z-10 w-full max-w-2xl ">
                        <UpdateProfileForm
                            record={selectedRecord}
                            closeModal={closeModal} // Pass the closeModal function
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserRecords;
