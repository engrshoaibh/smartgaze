"use client"; // Properly mark this component as a Client Component

import Sidebar from '../components/side_nav';
import Header from '../../components/header';
import { useState, useEffect } from 'react';
import { signup } from '../../../../../Backend/utils/api';
import SuccessMessage from '../components/SuccessMessage';

const ImageUpload = ({ image, setImage }) => {
  const defaultImage = '/images/add_image_icon.jpg';

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // Store the base64 string of the image
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <label htmlFor="file-upload" className="block cursor-pointer">
      <div className="relative">
        <img
          src={image || defaultImage}
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
  const [isSuccess, setIsSuccess] = useState(false);

  const [role, setRole] = useState('student');
  const [image, setImage] = useState(null); // Store the uploaded image
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
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [batches, setBatches] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections] = useState(['Select Section', 'A', 'B']); // Sections for students
  const [text,setText] = useState("Create Student Profile");
  // Initialize batches and departments
  useEffect(() => {
    setBatches([
      { value: '', label: 'Select Batch' },
      { value: 'sp24', label: 'Spring 2024 (SP24)' },
      { value: 'fa24', label: 'Fall 2024 (FA24)' },
      { value: 'fa23', label: 'Fall 2023 (FA23)' },
      { value: 'sp23', label: 'Spring 2023 (SP23)' },
      { value: 'fa22', label: 'Fall 2022 (FA22)' },
      { value: 'sp22', label: 'Spring 2022 (SP22)' },
      { value: 'fa21', label: 'Fall 2021 (FA21)' },
      { value: 'sp21', label: 'Spring 2021 (SP21)' }
    ]);

    // Fetch departments when the component mounts
    setDepartments([
      { value: '', label: 'Select Department' },
      { value: 'cs', label: 'Computer Science' },
      { value: 'ee', label: 'Electrical Engineering' },
      { value: 'me', label: 'Mechanical Engineering' },
      { value: 'ce', label: 'Civil Engineering' },
      { value: 'ba', label: 'Business Administration' },
      { value: 'math', label: 'Mathematics' },
      { value: 'phy', label: 'Physics' },
      { value: 'che', label: 'Chemistry' },
      { value: 'bio', label: 'Biology' },
      { value: 'soc', label: 'Social Sciences' },
      { value: 'hum', label: 'Humanities' },
      { value: 'law', label: 'Law' },
      { value: 'arch', label: 'Architecture' },
      { value: 'media', label: 'Media and Communication' }

    ]);

  }, [role]);

  useEffect(() => {
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

    if (formValues.department) {
      setClasses(departmentClasses[formValues.department] || [{ value: '', label: 'Select Class' }]);
    } else {
      setClasses([{ value: '', label: 'Select Class' }]);
    }
  }, [formValues.department]);

  useEffect(() => {
    const isValid = validateForm();
    setIsFormValid(isValid);
  }, [formValues, role, image]);

  const handleRoleChange = (e) => {
    if(e.target.value == "teacher"){
      setText("Create Teacher Profile");
    }
    else{
      setText("Create Student Profile");
    }
    setRole(e.target.value);

  }
    

  const handleChange = (e) => {
    const { id, value } = e.target;
    
    setFormValues({ ...formValues, [id]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formValues.name) newErrors.name = 'Name is required';
    if (!formValues.email) newErrors.email = 'Email is required';
    if (!formValues.phone) newErrors.phone = 'Phone number is required';
    if (role === 'student') {
      if (!formValues.class) newErrors.class = 'Class is required';
      if (!formValues.section) newErrors.section = 'Section is required';
      if (!formValues.batch) newErrors.batch = 'Batch is required';
      if (!formValues.department) newErrors.department = 'Department is required';
    } else if (role === 'teacher') {
      if (!formValues.department) newErrors.department = 'Department is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && image; // Ensure image is also validated
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!image) {
      setImageError(true); // Set image error if no image is uploaded
    }

    function generatePassword() {
      const part1 = Math.floor(1000 + Math.random() * 9000).toString(); 
      const part2 = Math.floor(100 + Math.random() * 900).toString();
      const password = `${part1}-${part2}`;
      return password;
    }
  

    const isValid = validateForm();
    if (isValid) {
      try {
        const userData = {
          name: formValues.name,
          email: formValues.email,
          phoneNumber: formValues.phone,
          password: generatePassword(),
          role: role,
          classInfo: formValues.class,
          section: formValues.section,
          batch: formValues.batch,
          department: formValues.department,
          profileImage: image
        };
        console.log(userData)
        const result = await signup(userData);
        if(result.status === "success"){
          setIsSuccess(true);
        }
        alert('Profile created successfully!');
        setFormValues({
          name: '',
          email: '',
          phone: '',
          class: '',
          section: '',
          batch: '',
          department: ''
        });
        setImage(null); // Reset the image
        setIsSubmitted(false);
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    }
  };
  if (isSuccess) {
    return <SuccessMessage 
    onDismiss={() => setIsSuccess(false)} 
    title={"Profile Created Successfully!"} 
    message={"Creditional shared to student"}
    />;
  }
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 p-6">
        <Header />
        <div className="flex justify-center items-center h-full ">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-xl">
            <h2 className="text-xl font-semibold mb-4 text-center text-gray-800 dark:text-gray-200">{text}</h2>
            <div className="flex flex-col justify-center items-center">
              <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-4">Upload Image</label>
              <ImageUpload image={image} setImage={setImage} />
              {isSubmitted && imageError && <p className="text-red-500 text-sm">Please upload an image</p>}
            </div>
  
            <div className="flex flex-wrap">
  
              {/* Left Side: Name, Email, Phone for Both */}
              <div className="w-full md:w-1/2 pl-2 pr-1"> {/* Adjusted spacing here */}
                <div className="mb-4"> {/* Consistent margin */}
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
                <div className="mb-4"> {/* Consistent margin */}
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
  
                <div className="mb-4"> {/* Consistent margin */}
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
  
                <div className="mb-4"> {/* Consistent margin */}
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    value={formValues.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${isSubmitted && errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg text-gray-800 dark:text-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="Enter phone number"
                  />
                  {isSubmitted && errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                </div>
              </div>
  
              <div className="w-full md:w-1/2 pr-2 pl-1"> {/* Adjusted spacing here */}
  
                {/* Department (Common for both Student & Teacher) */}
                <div className="mb-4"> {/* Consistent margin */}
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
                
                {/* For Students Only: Class, Section, Batch */}
                {role === 'student' && (
                  <>
                    <div className="mb-4"> {/* Consistent margin */}
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Class</label>
                      <select
                        id="class"
                        value={formValues.class}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border ${isSubmitted && errors.class ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg text-gray-800 dark:text-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      >
                        {classes.map((cls) => (
                          <option key={cls.value} value={cls.value}>
                            {cls.label}
                          </option>
                        ))}
                      </select>
                      {isSubmitted && errors.class && <p className="text-red-500 text-sm">{errors.class}</p>}
                    </div>
  
                    <div className="mb-4"> {/* Consistent margin */}
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Section</label>
                      <select
                        id="section"
                        value={formValues.section}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border ${isSubmitted && errors.section ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg text-gray-800 dark:text-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      >
                        {sections.map((sec) => (
                          <option key={sec} value={sec}>
                            {sec}
                          </option>
                        ))}
                      </select>
                      {isSubmitted && errors.section && <p className="text-red-500 text-sm">{errors.section}</p>}
                    </div>
  
                    <div className="mb-4"> {/* Consistent margin */}
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Batch</label>
                      <select
                        id="batch"
                        value={formValues.batch}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border ${isSubmitted && errors.batch ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg text-gray-800 dark:text-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      >
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
  
           <div className="mt-8 text-center">
              <button
                type="submit"
                className="w-1/3 bg-gradient-to-br from-[#1E2B3A] to-[#3E5259] text-white py-2 rounded-lg font-semibold 
                  hover:bg-gradient-to-br hover:from-[#2B3B4D] hover:to-[#4F6770] 
                  active:bg-gradient-to-br active:from-[#0E1B2A] active:to-[#2E4047] 
                  transition duration-300"
              >Create Profile
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
  
  
}