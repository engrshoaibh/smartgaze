import { useState, useEffect } from 'react';
import ImageUpload from './ImageUpload';
import preDefinedData from './preDefinedData';

const UpdateProfileForm = () => {
    const { batches, departments, departmentClasses } = preDefinedData;

    const [classes, setClasses] = useState([]);
    const [sections] = useState(['Select Section', 'A', 'B']);
    const [text, setText] = useState("Edit Student Profile");
    const [role, setRole] = useState('student');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false); // Toggle for form
    const [profileImage, setProfileImage] = useState(null);
    const [errors, setErrors] = useState({}); // State to handle form errors

    const [formValues, setFormValues] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        classInfo: '',
        section: '',
        batch: '',
        department: ''
    });

    // Watch for changes in department selection to update class options
    useEffect(() => {
        if (formValues.department && formValues.department !== '') {
            setClasses(departmentClasses[formValues.department] || [{ value: '', label: 'Select Class' }]);
        } else {
            setClasses([]);
        }
    }, [formValues.department]);

    const handleRoleChange = (e) => {
        setRole(e.target.value);
        setText(e.target.value === 'teacher' ? "Edit Teacher Profile" : "Edit Student Profile");
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormValues((prevValues) => ({ ...prevValues, [id]: value }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formValues.name) newErrors.name = "Name is required.";
        if (!formValues.email) newErrors.email = "Email is required.";
        if (!formValues.phoneNumber) newErrors.phoneNumber = "Phone number is required.";
        if (role === 'student' && !formValues.department) newErrors.department = "Department is required.";
        if (role === 'student' && !formValues.classInfo) newErrors.classInfo = "Class is required.";
        if (role === 'student' && !formValues.batch) newErrors.batch = "Batch is required.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitted(true);

        if (validateForm()) {
            const formData = { ...formValues, role, profileImage };

            // Submit the form (e.g., send formData to backend)
            // const response = await update(formData);

            // Example handling after form submission
            if (response?.status === "success") {
                setIsFormOpen(false);
            }
        }
    }

    const closeModal = () => {
        setIsFormOpen(false);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-xl relative">
            <button onClick={closeModal} type="button" className="absolute top-0 right-0 m-4 text-gray-500 hover:text-gray-700">&times;</button>
            <h2 className="text-xl font-semibold mb-4 text-center text-gray-800 dark:text-gray-200">{text}</h2>

            <div className="flex flex-col justify-center items-center">
                <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-4">Upload Image</label>
                <ImageUpload image={profileImage} setImage={setProfileImage} />
                {isSubmitted && !profileImage && <p className="text-red-500 text-sm">Please upload an image</p>}
            </div>

            <div className="flex flex-wrap">
                <div className="w-full md:w-1/2 pl-2 pr-1">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Select Role</label>
                        <select
                            id="role"
                            value={role}
                            onChange={handleRoleChange}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="student">Student</option>
                            <option value="teacher">Teacher</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Name</label>
                        <input
                            type="text"
                            id="name"
                            value={formValues.name}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border ${isSubmitted && errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg text-gray-800 dark:text-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                            placeholder="Enter name"
                        />
                        {isSubmitted && errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={formValues.email}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border ${isSubmitted && errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg text-gray-800 dark:text-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                            placeholder="Enter email"
                        />
                        {isSubmitted && errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Phone Number</label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            value={formValues.phoneNumber}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border ${isSubmitted && errors.phoneNumber ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg text-gray-800 dark:text-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                            placeholder="Enter phone number"
                        />
                        {isSubmitted && errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
                    </div>
                </div>

                {/* Right Side: Department, Class, Section */}
                <div className="w-full md:w-1/2 pr-2 pl-1">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Department</label>
                        <select
                            id="department"
                            value={formValues.department}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border ${isSubmitted && errors.department ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg text-gray-800 dark:text-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        >
                            {departments.map((dept) => (
                                <option key={dept.value} value={dept.value}>
                                    {dept.label}
                                </option>
                            ))}
                        </select>
                        {isSubmitted && errors.department && <p className="text-red-500 text-sm">{errors.department}</p>}
                    </div>

                    {/* Show class and section only for students */}
                    {role === 'student' && (
                        <>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Class</label>
                                <select
                                    id="classInfo"
                                    value={formValues.classInfo}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border ${isSubmitted && errors.classInfo ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg text-gray-800 dark:text-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                >
                                    {classes.length > 0 ? (
                                        classes.map((cls) => (
                                            <option key={cls.value} value={cls.value}>
                                               
                                               {cls.label}
                                            </option>
                                        ))
                                    ) : (
                                        <option value="">Select Department First</option>
                                    )}
                                </select>
                                {isSubmitted && errors.classInfo && <p className="text-red-500 text-sm">{errors.classInfo}</p>}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Section</label>
                                <select
                                    id="section"
                                    value={formValues.section}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    {sections.map((section) => (
                                        <option key={section} value={section}>
                                            {section}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Batch</label>
                                <select
                                    id="batch"
                                    value={formValues.batch}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border ${isSubmitted && errors.batch ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg text-gray-800 dark:text-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                >
                                    <option value="">Select Batch</option>
                                    {batches.map((batch) => (
                                        <option key={batch.value} value={batch.value}>
                                            {batch.label}
                                        </option>
                                    ))}
                                </select>
                                {isSubmitted && errors.batch && <p className="text-red-500 text-sm">{errors.batch}</p>}
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="mt-6">
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Submit
                </button>
            </div>
        </form>
    );
};

export default UpdateProfileForm;
