import React from 'react';
import { FaSignOutAlt } from 'react-icons/fa';

export default function ProfileDropdown({ isOpen }) {
  if (!isOpen) return null;

  // Prevent click events inside the dropdown from propagating to parent elements
  const handleDropdownClick = (event) => {
    event.stopPropagation();
  };

  return (
    <div 
      className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-lg p-1 z-50"
      onClick={handleDropdownClick} // Stop click events from propagating
    >
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-4">
          <img src="/images/admin.jpeg" alt="Admin Profile" className="w-10 h-10 rounded-full" />
          <div>
            <span className="block font-normal text-gray-800">Ayesha Nazneen</span>
            <span className="text-sm text-gray-500">Admin</span>
          </div>
        </div>
        <div className="space-y-2">
          <button className="w-full text-left p-2 rounded hover:bg-gray-100">Your profile</button>
        </div>
        <hr className="my-4" />
        <div className="space-y-2">
          {/* You can add ThemeToggle here if needed by importing it */}
          <button className="w-full flex items-center text-left p-2 rounded hover:bg-gray-100 text-red-500">
            <FaSignOutAlt className="mr-2" /> Log out
          </button>
        </div>
      </div>
    </div>
  );
}
