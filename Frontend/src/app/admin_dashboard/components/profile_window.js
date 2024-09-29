import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaSignOutAlt } from 'react-icons/fa';

export default function ProfileDropdown({ isOpen }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const userName = user?.name || 'Guest';
  const role = user?.role || 'Admin';
  const profileImage = user?.profilePic || '/images/admin.jpeg';

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    try {
      if (storedUser) {
        setUser(JSON.parse(storedUser)); // Parse only if it's a valid JSON string
      }
    } catch (error) {
      console.error("Error parsing stored user data", error);
    }
  }, []);

  const handleLogout=()=>{
    localStorage.clear();
    router.push('/login');
  }

  // Prevent click events inside the dropdown from propagating to parent elements
  const handleDropdownClick = (event) => {
    event.stopPropagation();
  };

  if (!isOpen) return null;

  return (
    <div
      className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-1 z-50"
      onClick={handleDropdownClick}
    >
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-4">
          <img src={profileImage} alt="Admin Profile" className="w-10 h-10 rounded-full" />
          <div>
            <span className="block font-normal text-gray-800 dark:text-gray-200">{userName}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">{role}</span>
          </div>
        </div>
        <div className="space-y-2">
          <button className="w-full text-left p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
            Your profile
          </button>
        </div>
        <hr className="my-4 dark:border-gray-600" />
        <div className="space-y-2">
          <button className="w-full flex items-center text-left p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500 dark:text-red-400"
          onClick={handleLogout}
          >
            <FaSignOutAlt className="mr-2" /> Log out
          </button>
        </div>
      </div>
    </div>
  );
}
