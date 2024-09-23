import { useState, useEffect, useRef } from 'react';
import { FaBell, FaSearch, FaQuestion } from 'react-icons/fa';
import NotificationWindow from './notification_window';
import ProfileWindow from './profile_window';

export default function Header() {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // References for notification and profile windows
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleNotificationClick = () => {
    setIsNotificationOpen(!isNotificationOpen);
    setIsProfileOpen(false); // Close profile window if notifications are opened
  };

  const handleProfileClick = () => {
    setIsProfileOpen(!isProfileOpen);
    setIsNotificationOpen(false); // Close notification window if profile is opened
  };

  // Close windows if clicking outside of them
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target) &&
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setIsNotificationOpen(false);
        setIsProfileOpen(false);
      }
    };

    // Attach the event listener
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      // Cleanup the event listener on component unmount
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const notifications = [
    { id: 1, icon: <FaBell className="text-lg" />, title: 'Notification title', message: 'Associated message', time: '10:19 AM', unread: true },
    { id: 2, icon: <FaBell className="text-lg" />, title: 'Notification title', message: 'Associated message', time: '10:20 AM', unread: true },
    { id: 3, icon: <FaBell className="text-lg" />, title: 'Notification title', message: 'Associated message', time: '10:30 AM', unread: true },
    { id: 4, icon: <FaBell className="text-lg" />, title: 'Notification title', message: 'Associated message', time: '10:31 AM', unread: true },
  ];

  return (
    <header className="relative flex justify-between items-center mb-1 px-1">
      <div className="flex-grow"></div>

      <div className="relative flex-grow max-w-lg">
        <input
          type="text"
          className="w-full pl-10 pr-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-full shadow-md focus:outline-none hover:bg-gray-200"
          placeholder="Search..."
        />
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      <div className="flex-grow flex justify-end items-center space-x-6">
        {/* Help Icon */}
        <div className="relative">
          <FaQuestion
            className="text-xl cursor-pointer"
            onMouseEnter={() => !isNotificationOpen && !isProfileOpen && setHoveredIcon('Help')}
            onMouseLeave={() => setHoveredIcon(null)}
          />
          {hoveredIcon === 'Help' && (
            <span className="absolute left-1/2 transform -translate-x-1/2 mt-2 bg-black text-white text-xs rounded p-1 whitespace-nowrap">
              Help
            </span>
          )}
        </div>

        {/* Notifications Icon */}
        <div className="relative" ref={notificationRef}>
          <FaBell
            className="text-xl cursor-pointer"
            onClick={handleNotificationClick}
            onMouseEnter={() => !isNotificationOpen && !isProfileOpen && setHoveredIcon('Notifications')}
            onMouseLeave={() => setHoveredIcon(null)}
          />
          <span className="absolute -top-1 -right-2 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
            3
          </span>
          {hoveredIcon === 'Notifications' && (
            <span className="absolute left-1/2 transform -translate-x-1/2 mt-2 bg-black text-white text-xs rounded p-1 whitespace-nowrap">
              Notifications
            </span>
          )}
          <NotificationWindow
            notifications={notifications}
            isOpen={isNotificationOpen}
            onClose={() => setIsNotificationOpen(false)}
          />
        </div>

        {/* Profile Icon */}
        <div
          className="relative cursor-pointer"
          ref={profileRef}
          onClick={handleProfileClick}
          onMouseEnter={() => !isNotificationOpen && !isProfileOpen && setHoveredIcon('User Profile')}
          onMouseLeave={() => setHoveredIcon(null)}
        >
          <img
            src="/images/admin.png"
            alt="Admin Profile"
            className="w-8 h-8 rounded-full"
          />
          {hoveredIcon === 'User Profile' && (
            <span className="absolute left-1/2 transform -translate-x-1/2 mt-2 bg-black text-white text-xs rounded p-1 whitespace-nowrap">
              Profile
            </span>
          )}
          <ProfileWindow
            isOpen={isProfileOpen}
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
          />
        </div>
      </div>
    </header>
  );
}
