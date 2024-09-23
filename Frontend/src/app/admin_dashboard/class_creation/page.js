'use client';

import { useState, useEffect } from 'react';
import { createClass, getTeachers } from '../../../../../Backend/utils/api';
import Sidebar from '../components/side_nav';
import Header from '../components/header';

const CreateClass = () => {
  const courseOptions = [
    { code: 'CS101', name: 'Introduction to Computer Science' },
    { code: 'CS201', name: 'Data Structures and Algorithms' },
    { code: 'CS301', name: 'Object-Oriented Programming' },
    { code: 'WD101', name: 'Web Development Fundamentals' },
    { code: 'MA102', name: 'Mobile App Development' },
  ];

  const sectionOptions = ['A', 'B'];

  const [teacherOptions, setTeacherOptions] = useState([]); // Initialize with an empty array
  const [formData, setFormData] = useState({
    courseCode: '',
    courseName: '',
    className: '',
    sectionName: '',
    description: '',
    teacher: '' // This will hold the teacher's _id
  });

  useEffect(() => {
    // Fetch the list of teachers when the component mounts
    const fetchTeachers = async () => {
      try {
        const data = await getTeachers();
        setTeacherOptions(data.data.teachers); // Assuming the response contains the array of teachers in `data.teachers`
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    };

    fetchTeachers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // If courseCode changes, also update courseName automatically
    if (name === 'courseCode') {
      const selectedCourse = courseOptions.find(course => course.code === value);
      setFormData((prevFormData) => ({
        ...prevFormData,
        courseCode: value,
        courseName: selectedCourse ? selectedCourse.name : '', 
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page refresh
    // Validation
    if (!formData.className || !formData.sectionName || !formData.courseCode || !formData.teacher) {
      alert('Please fill out all required fields.');
      return;
    }
  
    const submissionData = {
      name: formData.className,  // Map `className` to `name` expected by the backend
      section: formData.sectionName,  // Map `sectionName` to `section` expected by the backend
      courseCode: formData.courseCode,
      courseName: formData.courseName,
      description: formData.description,
      teacher: formData.teacher, // This will now be the teacher's _id
    };

    try {
      const token = localStorage.getItem('token');
      const response = await createClass(submissionData, token); // Pass the correctly mapped data
      console.log(response);
      // Reset the form if needed, or show a success message
      setFormData({
        courseCode: '',
        courseName: '',
        className: '',
        sectionName: '',
        description: '',
        teacher: ''
      });
    } catch (error) {
      console.error('Error creating class:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6">
        <Header />
        <div className="flex justify-center items-center mt-8">
          <div className="w-full md:w-1/2 bg-white p-8 rounded-lg shadow-lg">
            <h1 className="text-3xl font-semibold mb-6 text-center text-gray-700">Create Class</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Class Name</label>
                  <input
                    type="text"
                    name="className"
                    value={formData.className}
                    onChange={handleChange}
                    placeholder="Enter Class Name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Section Name</label>
                  <select
                    name="sectionName"
                    value={formData.sectionName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Section</option>
                    {sectionOptions.map((section) => (
                      <option key={section} value={section}>
                        {section}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Course Code</label>
                  <select
                    name="courseCode"
                    value={formData.courseCode}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Course Code</option>
                    {courseOptions.map((course) => (
                      <option key={course.code} value={course.code}>
                        {course.code}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Course Name</label>
                  <select
                    name="courseName"
                    value={formData.courseName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled // Disable input, as it will be set automatically
                  >
                    <option value="">Select Course Name</option>
                    {courseOptions.map((course) => (
                      <option key={course.name} value={course.name}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter Class Description"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Assign Teacher</label>
                <select
                  name="teacher"
                  value={formData.teacher}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Teacher</option>
                  {teacherOptions.map((teacher) => (
                    <option key={teacher._id} value={teacher._id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-center mt-6">
                <button
                  type="submit"
                  className="w-1/3 bg-gradient-to-br from-[#1E2B3A] to-[#3E5259] text-white py-2 rounded-lg font-semibold 
                             hover:bg-gradient-to-br hover:from-[#2B3B4D] hover:to-[#4F6770] 
                             active:bg-gradient-to-br active:from-[#0E1B2A] active:to-[#2E4047] 
                             transition duration-300"
                >
                  Create Class
                </button>
              </div>

            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateClass;
