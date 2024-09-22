"use client"; // Properly mark this component as a Client Component

import Sidebar from '../components/side_nav';
import Header from '../components/header';
import { useState, useEffect } from 'react';

const ImageUpload = ({ image, setImage }) => {
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <label htmlFor="file-upload" className="block cursor-pointer">
      <div className="relative">
        <img
          src={image}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover mb-4 border border-gray-300"
        />
        <input
          id="file-upload"
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleImageChange}
        />
      </div>
    </label>
  );
};

export default function MainDashboard() {
  const [role, setRole] = useState('student'); // Default to student
  const [image, setImage] = useState('/images/add.jpg'); // Default image path
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    phone: '',
    class: '',
    section: '',
    batch: '',
    department: ''
  });
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); // Track form submission state
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const isValid = validateForm();
    setIsFormValid(isValid);
  }, [formValues, role, image]);

  useEffect(() => {
    // Reset form values when role changes
    setFormValues({
      name: '',
      email: '',
      phone: '',
      class: '',
      section: '',
      batch: '',
      department: ''
    });
    setErrors({});
    setImage('/images/add.jpg'); // Reset the image to default
    setImageError(false);
    setIsSubmitted(false); // Reset the submitted state when the role changes
  }, [role]);

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormValues({ ...formValues, [id]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formValues.name) newErrors.name = 'Name is required';
    if (!formValues.email) newErrors.email = 'Email is required';
    if (!formValues.phone) newErrors.phone = 'Phone number is required';
    if (formValues.phone && formValues.phone.length !== 11) newErrors.phone = 'Phone number must be 11 digits';
    if (formValues.name && /\d/.test(formValues.name)) newErrors.name = 'Name should not contain digits';
    if (role === 'student') {
      if (!formValues.class) newErrors.class = 'Class is required';
      if (!formValues.section) newErrors.section = 'Section is required';
      if (!formValues.batch) newErrors.batch = 'Batch is required';
    } else if (role === 'teacher') {
      if (!formValues.department) newErrors.department = 'Department is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && image !== '/images/add.jpg';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true); // Mark the form as submitted
    const isValid = validateForm();
    if (isValid) {
      console.log('Form values:', formValues);
      alert('Profile is created');
    } else {
      if (image === '/images/add.jpg') {
        setImageError(true);
      }
      alert('Please fill the form correctly!');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-4">
        <Header />
        <div className="flex justify-center items-center h-full">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-xl">
            <h2 className="text-xl font-semibold mb-4 text-center">Create User Profile</h2>

            {/* Role Dropdown */}
            <div className="mb-4 mt-16">
              <label className="block text-sm font-medium text-gray-600 mb-2">Select Role</label>
              <select
                id="role"
                value={role}
                onChange={handleRoleChange}
                className="w-1/4 px-4 py-2 border border-gray-300 rounded-lg text-gray-800 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>

            <div className="flex flex-wrap">
              {/* Right Side: Name, Email, Phone for Both */}
              <div className="w-full md:w-1/2 pl-2">
                <label className="block text-sm font-semibold text-gray-600 mb-2 py-2">Personal Information</label>

                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-600 mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    value={formValues.name}
                    onChange={handleChange}
                    className={`w-3/4 px-4 py-2 border ${isSubmitted && errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg text-gray-800 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="Enter name"
                  />
                  {isSubmitted && errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>

                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-600 mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={formValues.email}
                    onChange={handleChange}
                    className={`w-3/4 px-4 py-2 border ${isSubmitted && errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg text-gray-800 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="Enter email"
                  />
                  {isSubmitted && errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>

                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-600 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    value={formValues.phone}
                    onChange={handleChange}
                    className={`w-3/4 px-4 py-2 border ${isSubmitted && errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg text-gray-800 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="Enter phone number"
                  />
                  {isSubmitted && errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                </div>
              </div>

              {/* Left Side: Class, Section, Batch for Student or Department for Teacher */}
              <div className="w-full md:w-1/2 pr-2 -mt-28">
                <div className="flex justify-center items-center">
                  <div className="flex justify-center items-center -ml-24">
                    <ImageUpload image={image} setImage={setImage} />
                  </div>
                </div>

                <label className="block text-sm font-semibold text-gray-600 mb-2 py-2">University Information</label>

                {role === 'student' && (
                  <>
                    <div className="mb-2">
                      <label className="block text-sm font-medium text-gray-600 mb-2">Class</label>
                      <input
                        type="text"
                        id="class"
                        value={formValues.class}
                        onChange={handleChange}
                        className={`w-3/4 px-4 py-2 border ${isSubmitted && errors.class ? 'border-red-500' : 'border-gray-300'} rounded-lg text-gray-800 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        placeholder="Enter class"
                      />
                      {isSubmitted && errors.class && <p className="text-red-500 text-sm">{errors.class}</p>}
                    </div>

                    <div className="mb-2">
                      <label className="block text-sm font-medium text-gray-600 mb-2">Section</label>
                      <input
                        type="text"
                        id="section"
                        value={formValues.section}
                        onChange={handleChange}
                        className={`w-3/4 px-4 py-2 border ${isSubmitted && errors.section ? 'border-red-500' : 'border-gray-300'} rounded-lg text-gray-800 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        placeholder="Enter section"
                      />
                      {isSubmitted && errors.section && <p className="text-red-500 text-sm">{errors.section}</p>}
                    </div>

                    <div className="mb-2">
                      <label className="block text-sm font-medium text-gray-600 mb-2">Batch</label>
                      <input
                        type="text"
                        id="batch"
                        value={formValues.batch}
                        onChange={handleChange}
                        className={`w-3/4 px-4 py-2 border ${isSubmitted && errors.batch ? 'border-red-500' : 'border-gray-300'} rounded-lg text-gray-800 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        placeholder="Enter batch"
                      />
                      {isSubmitted && errors.batch && <p className="text-red-500 text-sm">{errors.batch}</p>}
                    </div>
                  </>
                )}

                {role === 'teacher' && (
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-600 mb-2">Department</label>
                    <input
                      type="text"
                      id="department"
                      value={formValues.department}
                      onChange={handleChange}
                      className={`w-3/4 px-4 py-2 border ${isSubmitted && errors.department ? 'border-red-500' : 'border-gray-300'} rounded-lg text-gray-800 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="Enter department"
                    />
                    {isSubmitted && errors.department && <p className="text-red-500 text-sm">{errors.department}</p>}
                  </div>
                )}
              </div>
            </div>

            {/* Create Profile Button */}
            <div className="mt-8 text-center">
              <button
                type="submit"
                className="w-1/3 bg-gradient-to-br from-[#1E2B3A] to-[#3E5259] text-white py-2 rounded-lg font-semibold 
                  hover:bg-gradient-to-br hover:from-[#2B3B4D] hover:to-[#4F6770] 
                  active:bg-gradient-to-br active:from-[#0E1B2A] active:to-[#2E4047] 
                  transition duration-300"
              >
                Create Profile
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
