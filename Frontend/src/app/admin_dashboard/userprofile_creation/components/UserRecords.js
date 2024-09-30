import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import { getUsers } from '../../../../../../Backend/utils/api';
import UpdateProfileForm from './UpdateProfileForm'; // Import the UpdateProfileForm

const UserRecords = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [records, setRecords] = useState([]); // State to hold fetched records
    const [error, setError] = useState(null); // State to hold error message
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
    const [selectedRecord, setSelectedRecord] = useState(null); // State to hold selected record for editing

    const fetchRecords = async () => {
        try {
            const response = await getUsers();
            console.log("All Records Here", response.data.users);
            
            if (response && response.data) {
                setRecords(response.data.users); // Set fetched records
            } else {
                throw new Error("Invalid response structure");
            }
        } catch (err) {
            console.error('Error fetching records:', err);
            setError(err.message); // Set error message
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
        <div className="p-4 rounded-lg shadow-lg bg-white transition-colors duration-300">
            <div className="relative mb-4">
                <input
                    type="text"
                    id="search"
                    placeholder="Search by Name, Email, Roll No, Department, or Role"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="border border-gray-300 rounded-lg px-10 py-2 w-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 bg-white text-gray-800"
                />
                <FaSearch className="absolute left-3 top-2.5 text-gray-500" />
            </div>
            {error && <div className="text-red-500">{error}</div>} {/* Display error message if any */}
            <table className="min-w-full table-auto bg-white">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="px-6 py-4 text-left font-semibold text-xs">Profile</th>
                        <th className="px-6 py-4 text-left font-semibold text-xs">Name</th>
                        <th className="px-6 py-4 text-left font-semibold text-xs">Email</th>
                        <th className="px-6 py-4 text-left font-semibold text-xs">Phone</th>
                        <th className="px-6 py-4 text-left font-semibold text-xs">Department</th>
                        <th className="px-6 py-4 text-left font-semibold text-xs">Roll No</th>
                        <th className="px-6 py-4 text-left font-semibold text-xs">Role</th>
                        <th className="px-6 py-4 text-left font-semibold text-xs">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredRecords.length > 0 ? (
                        filteredRecords.map((record) => (
                            <tr key={record.id} className={`hover:bg-gray-100 transition duration-150 ${record.role === 'student' ? 'bg-gray-50' : 'bg-white'}`}>
                                <td className="border-t px-6 py-4">
                                    <img
                                        src={record.profilePic || 'default_profile_pic.png'}
                                        alt={`${record.name}'s profile`}
                                        className="w-10 h-10 rounded-full"
                                    />
                                </td>
                                <td className="border-t px-6 py-4 text-xs">{record.name}</td>
                                <td className="border-t px-6 py-4 text-xs">{record.email}</td>
                                <td className="border-t px-6 py-4 text-xs">{record.phoneNumber}</td>
                                <td className="border-t px-6 py-4 text-xs">{record.department}</td>
                                <td className="border-t px-6 py-4 text-xs">{record.rollno || '-'}</td>
                                <td className="border-t px-6 py-4 text-xs">{record.role}</td>
                                <td className="border-t px-6 py-4 flex space-x-2">
                                    <button
                                        onClick={() => handleEditRecord(record)}
                                        className="text-yellow-500 hover:text-yellow-700"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteRecord(record.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="border-t px-6 py-4 text-center text-gray-500 text-xs">
                                No records found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Modal for UpdateProfileForm */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                        <UpdateProfileForm
                            record={selectedRecord} // Pass the selected record to the form
                            onClose={closeModal} // Pass the closeModal function
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserRecords;
