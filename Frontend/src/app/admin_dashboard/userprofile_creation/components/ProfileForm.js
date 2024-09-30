import { useState, useEffect } from 'react';
import ImageUpload from './ImageUpload'; // Assuming ImageUpload is in the same directory

const ProfileForm = ({
  role,
  setRole,
  profileImage,
  setProfileImage,
  handleSubmit,
  text,
  formValues,
  setFormValues,
  errors,
  isSubmitted,
  imageError,
  batches,
  departments,
  classes,
  sections,
  handleRoleChange,
  handleChange,
  closeModal, 
}) => {
  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-xl relative">
      {/* Close button at the top-right corner */}
      <button
        onClick={closeModal}
        type="button"
        className="absolute top-0 right-0 m-4 text-gray-500 hover:text-gray-700"
      >
        &times;
      </button>

      <h2 className="text-xl font-semibold mb-4 text-center text-gray-800 dark:text-gray-200">{text}</h2>

      <div className="flex flex-col justify-center items-center">
        <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-4">Upload Image</label>
        <ImageUpload image={profileImage} setImage={setProfileImage} />
        {isSubmitted && imageError && <p className="text-red-500 text-sm">Please upload an image</p>}
      </div>

      <div className="flex flex-wrap">
        {/* Left Side: Name, Email, Phone */}
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
                  {classes.map((cls) => (
                    <option key={cls.value} value={cls.value}>
                      {cls.label}
                    </option>
                  ))}
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
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {batches.map((batch) => (
                    <option key={batch.value} value={batch.value}>
                      {batch.label}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>
      </div>

      <button
  type="submit"
  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-2 px-4 rounded-lg"
>
  Submit
</button>
    </form>
  );
};

export default ProfileForm;
