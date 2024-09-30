import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import { deleteUser, getUsers } from '../../../../../../Backend/utils/api';
import UpdateProfileForm from './UpdateProfileForm';

const UserRecords = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [records, setRecords] = useState([]);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 3;

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
    }, [isModalOpen]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const filteredRecords = records.filter(record => {
        const { name, email, department, rollno, role } = record;
        return (
            name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (rollno && rollno.includes(searchTerm)) ||
            department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            role.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
    const paginatedRecords = filteredRecords.slice(
        (currentPage - 1) * recordsPerPage,
        currentPage * recordsPerPage
    );

    const handleEditRecord = (record) => {
        setSelectedRecord(record);
        setIsModalOpen(true);
    };

    const handleDeleteRecord = async (id) => {
        const updatedRecords = records.filter(record => record._id !== id);
        setRecords(updatedRecords); 
        const response = await deleteUser(id);
        console.log(response);
        
        if (response.status === 204) {
            alert("Record Deleted Successfully 😲");
        } else {
            setRecords(records); // Restore original records
            alert("Failed to delete record.");
        }
    };

    // Function to handle the update of a record
    const handleUpdateRecord = (updatedRecord) => {
        setRecords(prevRecords => 
            prevRecords.map(record => 
                record._id === updatedRecord._id ? updatedRecord : record
            )
        );
        closeModal();
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedRecord(null);
    };

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
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
            {error && <div className="text-red-500">{error}</div>}
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
                    {paginatedRecords.length > 0 ? (
                        paginatedRecords.map((record) => (
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
                                        onClick={() => handleDeleteRecord(record._id)}
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

            {paginatedRecords.length > 0 ? (
                <div className="flex justify-center space-x-2 mt-4">
                    <button
                        className={`px-3 py-1 border ${currentPage === 1 ? 'text-gray-400' : 'text-blue-600'}`}
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            className={`px-3 py-1 border ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'text-blue-600'}`}
                            onClick={() => goToPage(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        className={`px-3 py-1 border ${currentPage === totalPages ? 'text-gray-400' : 'text-blue-600'}`}
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            ) : null}

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="fixed inset-0 bg-gray-800 opacity-50"></div>
                    <div className="rounded-lg p-6 relative z-10 w-full max-w-2xl ">
                        <UpdateProfileForm
                            record={selectedRecord}
                            closeModal={closeModal}
                            onUpdateRecord={handleUpdateRecord} // Pass the handler to the form
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserRecords;
