'use client';

import { useState, useEffect } from 'react';
import { createClass, getTeachers } from '../../../../../Backend/utils/api';
import Sidebar from '../components/side_nav';
import Header from '../components/header';
import SuccessMessage from '../components/SuccessMessage';

const CreateClass = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const courseOptions = [
    { code: 'CS101', name: 'Introduction to Computer Science' },
    { code: 'CS201', name: 'Data Structures and Algorithms' },
    { code: 'CS301', name: 'Object-Oriented Programming' },
    { code: 'WD101', name: 'Web Development Fundamentals' },
    { code: 'MA102', name: 'Mobile App Development' },
  ];

  const sectionOptions = ['A', 'B'];
  const departmentClasses = {
    cs: [
      { value: '', label: 'Select Class' },
      { value: 'bse', label: 'Bachelor of Software Engineering (BSE)' },
      { value: 'bcs', label: 'Bachelor of Computer Science (BCS)' },
      { value: 'bai', label: 'Bachelor of Artificial Intelligence (BAI)' },
      { value: 'bds', label: 'Bachelor of Data Science (BDS)' }
    ],
    ee: [
      { value: '', label: 'Select Class' },
      { value: 'bsee', label: 'Bachelor of Science in Electrical Engineering (BSEE)' }
    ],
    me: [
      { value: '', label: 'Select Class' },
      { value: 'bsme', label: 'Bachelor of Science in Mechanical Engineering (BSME)' }
    ],
    ce: [
      { value: '', label: 'Select Class' },
      { value: 'bsce', label: 'Bachelor of Science in Civil Engineering (BSCE)' }
    ],
    ba: [
      { value: '', label: 'Select Class' },
      { value: 'bba', label: 'Bachelor of Business Administration (BBA)' }
    ],
    math: [
      { value: '', label: 'Select Class' },
      { value: 'bsmath', label: 'Bachelor of Science in Mathematics (BS Math)' }
    ],
    phy: [
      { value: '', label: 'Select Class' },
      { value: 'bsphy', label: 'Bachelor of Science in Physics (BS Physics)' }
    ],
    che: [
      { value: '', label: 'Select Class' },
      { value: 'bsche', label: 'Bachelor of Science in Chemistry (BS Chemistry)' }
    ],
    bio: [
      { value: '', label: 'Select Class' },
      { value: 'bsbio', label: 'Bachelor of Science in Biology (BS Biology)' }
    ],
    soc: [
      { value: '', label: 'Select Class' },
      { value: 'bapsych', label: 'Bachelor of Arts in Psychology (BAP)' },
      { value: 'bas', label: 'Bachelor of Arts in Sociology (BAS)' },
      { value: 'bses', label: 'Bachelor of Science in Environmental Science (BSES)' },
      { value: 'bed', label: 'Bachelor of Education (BEd)' }
    ],
    hum: [
      { value: '', label: 'Select Class' },
      { value: 'baeng', label: 'Bachelor of Arts in English Literature (BA English)' }
    ],
    law: [
      { value: '', label: 'Select Class' },
      { value: 'llb', label: 'Bachelor of Laws (LLB)' }
    ],
    arch: [
      { value: '', label: 'Select Class' },
      { value: 'barch', label: 'Bachelor of Architecture (BArch)' }
    ],
    media: [
      { value: '', label: 'Select Class' },
      { value: 'bms', label: 'Bachelor of Media Studies (BMS)' }
    ]
  };
  const [teacherOptions, setTeacherOptions] = useState([]);
  const [teacherFilterData, setTeacherFilterData] = useState([]);
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    className: '',
    sectionName: '',
    description: '',
    teacher: '',
  });
  const [courseList, setCourseList] = useState([{ courseCode: '', courseName: '' }]);
  const [selectedClassName, setSelectedClassName] = useState('');
  useEffect(() => {
    if (formData.className) {
      filterTeacherProgramWise();
    }
  }, [formData.className]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const data = await getTeachers();
        setTeacherOptions(data.data.teachers);
        console.log(data);
        
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    };

    fetchTeachers();
  }, []);
  useEffect(() => {

    const studentClasses = [{ value: '', label: 'Select Class' }];
    for (const classes of Object.values(departmentClasses)) {
      studentClasses.push(...classes.slice(1));
    }
    console.log(studentClasses);

    setClasses(studentClasses);
  }, []);

  const handleCourseCodeChange = (e, index) => {
    const selectedCode = e.target.value;
    const selectedCourse = courseOptions.find(course => course.code === selectedCode);

    const updatedCourses = [...courseList];
    updatedCourses[index] = {
      courseCode: selectedCode,
      courseName: selectedCourse ? selectedCourse.name : '',
    };

    setCourseList(updatedCourses);
  };

  const handleCourseNameChange = (e, index) => {
    const selectedName = e.target.value;
    const selectedCourse = courseOptions.find(course => course.name === selectedName);

    const updatedCourses = [...courseList];
    updatedCourses[index] = {
      courseCode: selectedCourse ? selectedCourse.code : '',
      courseName: selectedName,
    };

    setCourseList(updatedCourses);
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'className') {
      if (value === selectedClassName) {
        filterTeacherProgramWise();
      } else {
        setSelectedClassName(value);
      }
    }
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const addCourseFields = () => {
    if (courseList.length < 5) {
      setCourseList([...courseList, { courseCode: '', courseName: '' }]);
    }
  };

  const removeCourseFields = (index) => {
    if (courseList.length > 1) {
      const updatedCourses = courseList.filter((_, i) => i !== index);
      setCourseList(updatedCourses);
    }
  };
  const filterTeacherProgramWise = () => {
    const program = formData.className;
    console.log("ClassName", program);
    
    if (!program) return; 

    const filterTeacher = [];

    teacherOptions.forEach((teacher) => {
      for (const departmentKey in departmentClasses) {
        if (teacher.department === departmentKey) {
          const classes = departmentClasses[departmentKey];
       
          for (const item of classes) {
          
            if (item.value === program) {
              console.log("CS Teacher",teacher.department)
              filterTeacher.push(teacher);
            }
          }
        }
      }
    });
    
    setTeacherFilterData(filterTeacher);
    
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.className || !formData.sectionName || !formData.teacher ||
      courseList.some(course => !course.courseCode || !course.courseName)) {
      alert('Please fill out all required fields.');
      return;
    }

    const submissionData = {
      name: formData.className,
      section: formData.sectionName,
      courses: courseList.map(course => ({
        courseCode: course.courseCode,
        courseName: course.courseName,
        students: [] // Initially empty
      })),
      description: formData.description,
      teacher: formData.teacher,
      schedule: [] // Initially empty
    };
    console.log(submissionData)
    try {
      const token = localStorage.getItem('token');
      const response = await createClass(submissionData, token);
      if(response.status === "success"){
        setIsSuccess(true);
      }
      
    } catch (error) {
      console.error('Error creating class:', error);
    }
  };



  const getAvailableCourseOptions = (index) => {
    const selectedCourseCodes = courseList.map(course => course.courseCode).filter(code => code);
    return courseOptions.filter(course => !selectedCourseCodes.includes(course.code) || course.code === courseList[index].courseCode);
  };

  if (isSuccess) {
    return <SuccessMessage 
    onDismiss={() => setIsSuccess(false)} 
    title={"Class Created Successfully!"} 
    message={"The class has been created and assigned to the teacher."}
    />;
  }
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 p-6">
        <Header />
        <div className="flex justify-center items-center mt-2">
          <div className="w-full md:w-1/2 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
            <h1 className="text-xl font-semibold mb-4 text-center text-gray-800 dark:text-gray-200">Create Class</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Class Name</label>
  
                  <select
                    name="className"
                    value={formData.className}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {classes.map((cls) => (
                      <option key={cls.value} value={cls.value}>
                        {cls.label}
                      </option>
                    ))}
                  </select>
                </div>
  
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Section Name</label>
                  <select
                    name="sectionName"
                    value={formData.sectionName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
  
              {/* Dynamic Course Fields */}
              {courseList.map((course, index) => (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" key={index}>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Course Code</label>
                    <select
                      name="courseCode"
                      value={course.courseCode}
                      onChange={(e) => handleCourseCodeChange(e, index)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Course Code</option>
                      {getAvailableCourseOptions(index).map((courseOption) => (
                        <option key={courseOption.code} value={courseOption.code}>
                          {courseOption.code}
                        </option>
                      ))}
                    </select>
                  </div>
  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Course Name</label>
                    <select
                      name="courseName"
                      value={course.courseName}
                      onChange={(e) => handleCourseNameChange(e, index)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Course Name</option>
                      {getAvailableCourseOptions(index).map((courseOption) => (
                        <option key={courseOption.name} value={courseOption.name}>
                          {courseOption.name}
                        </option>
                      ))}
                    </select>
                  </div>
  
                  {/* Remove Button */}
                  <div className="flex items-center justify-end">
                    {courseList.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCourseFields(index)}
                        className="text-red-500 hover:text-red-700 font-semibold text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
  
              {/* Add Course Button */}
              {courseList.length < 5 && (
                <div className="flex justify-center mt-2">
                  <button
                    type="button"
                    onClick={addCourseFields}
                    className="text-blue-500 hover:text-blue-700 font-semibold text-sm flex items-center"
                  >
                    <span className="mr-2">+</span> Add Another Course
                  </button>
                </div>
              )}
  
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter Class Description"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                ></textarea>
              </div>
  
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Assign Teacher</label>
                <select
                  name="teacher"
                  value={formData.teacher}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Teacher</option>
                  {teacherFilterData.map((teacher) => (
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
