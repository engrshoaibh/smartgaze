"use client"; // Properly mark this component as a Client Component

import { useState, useEffect } from 'react';
import Sidebar from '../components/side_nav';
import Header from '../../components/header';
import ProfileForm from './components/ProfileForm';
import SuccessMessage from '../components/SuccessMessage';
import { signup } from '../../../../../Backend/utils/api';
import UserRecords from './components/UserRecords';

export default function MainDashboard() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false); // Toggle for form
  const [role, setRole] = useState('student');
  const [profileImage , setProfileImage ] = useState(null); // Store the uploaded image
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    classInfo: '',
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
  const [sections] = useState(['Select Section', 'A', 'B']);
  const [text, setText] = useState("Create Student Profile");

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
    }
  }, [formValues.department]);

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setText(e.target.value === 'teacher' ? "Create Teacher Profile" : "Create Student Profile");
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [id]: value }));
  };
  function generatePassword() {
    const part1 = Math.floor(1000 + Math.random() * 9000).toString(); 
    const part2 = Math.floor(100 + Math.random() * 900).toString();
    const password = `${part1}-${part2}`;
    return password;
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);


    if (!profileImage ) {
      setImageError(true);
    }

    const validationErrors = validateForm(formValues);
    if (Object.keys(validationErrors).length === 0 && profileImage ) {
      setIsFormValid(true);
      const password = generatePassword();
      const formData = { ...formValues, role, profileImage ,password };
  
      const response = await signup(formData);
      console.log("Messge", response);
      if(response.status === "success"){
        setIsSuccess(true);
      }
      
      setIsFormOpen(false); // Close form on success
    } else {
      setErrors(validationErrors);
    }
  };

  const validateForm = (values) => {
    const errors = {};
    if (!values.name) errors.name = 'Name is required';
    if (!values.email) errors.email = 'Email is required';
    if (!values.phoneNumber) errors.phoneNumber = 'Phone number is required';
    if (!values.department) errors.department = 'Department is required';
    if (role === 'student' && !values.classInfo) errors.classInfo = 'Class is required';
    return errors;
  };

  const handleCreateProfileClick = () => {
    setIsFormOpen(true); // Open the form when button is clicked
  };

 
  const closeModal = () => {
    setIsFormOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 p-6">
        <Header />
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">User Records</h1>
          <button
            onClick={handleCreateProfileClick}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg"
          >
            Create Profile
          </button>
        </div>

        {isFormOpen ? (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-gray-800 opacity-50"></div> {/* Modal background */}
            <div className="rounded-lg p-6 relative z-10 w-full max-w-2xl">

              {isSuccess ? (
                <SuccessMessage />
              ) : (
                <ProfileForm
                  role={role}
                  setRole={setRole}
                  handleRoleChange={handleRoleChange}
                  profileImage ={profileImage}
                  setProfileImage ={setProfileImage }
                  handleSubmit={handleSubmit}
                  text={text}
                  formValues={formValues}
                  setFormValues={setFormValues}
                  errors={errors}
                  isSubmitted={isSubmitted}
                  imageError={imageError}
                  batches={batches}
                  departments={departments}
                  classes={classes}
                  sections={sections}
                
                  handleChange={handleChange}
                  closeModal={closeModal} // Pass the closeModal function
                />
              )}
            </div>
          </div>
        ) : null}

        <div className="container mx-auto p-4">

          <UserRecords 
        

          
          />
        </div>

      </div>
    </div>
  );
}
