import { useState, useEffect, useRef } from 'react';
import { FaBell, FaSearch, FaQuestion } from 'react-icons/fa';
import NotificationWindow from '../admin_dashboard/components/notification_window';
import ProfileWindow from '../admin_dashboard/components/profile_window';
import ThemeBtn from '@/app/components/ThemeBtn';

export default function Header() {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState(null);

  // References for notification and profile windows
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  const handleNotificationClick = () => {
    setIsNotificationOpen(!isNotificationOpen);
    setIsProfileOpen(false); // Close profile window if notifications are opened
  };

  const handleProfileClick = () => {
    setIsProfileOpen(!isProfileOpen);
    setIsNotificationOpen(false); // Close notification window if profile is opened
  };



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
    <header className="relative flex justify-between items-center px-4 h-16">
      <div className="flex-grow"></div>

      <div className="flex-grow flex justify-end items-center space-x-6">
        <ThemeBtn />
        <div className="relative">
          <FaQuestion
            className="text-xl cursor-pointer text-gray-600 dark:text-gray-300"
            onMouseEnter={() => !isNotificationOpen && !isProfileOpen && setHoveredIcon('Help')}
            onMouseLeave={() => setHoveredIcon(null)}
          />
          {hoveredIcon === 'Help' && (
            <span className="absolute left-1/2 transform -translate-x-1/2 mt-2 bg-black text-white text-xs rounded p-1 shadow-lg whitespace-nowrap">
              Help
            </span>
          )}
        </div>

        {/* Notifications Icon */}
        <div className="relative" ref={notificationRef}>
          <FaBell
            className="text-xl cursor-pointer text-gray-600 dark:text-gray-300"
            onClick={handleNotificationClick}
            onMouseEnter={() => !isNotificationOpen && !isProfileOpen && setHoveredIcon('Notifications')}
            onMouseLeave={() => setHoveredIcon(null)}
          />
          <span className="absolute -top-1 -right-2 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center shadow-md dark:shadow-[0px_4px_15px_rgba(255,255,255,0.2)]">
            3
          </span>
          {hoveredIcon === 'Notifications' && (
            <span className="absolute left-1/2 transform -translate-x-1/2 mt-2 bg-black text-white text-xs rounded p-1 shadow-lg whitespace-nowrap">
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
            className="w-8 h-8 rounded-full shadow-md dark:shadow-[0px_4px_15px_rgba(255,255,255,0.1)]"
          />
          {hoveredIcon === 'User Profile' && (
            <span className="absolute left-1/2 transform -translate-x-1/2 mt-2 bg-black text-white text-xs rounded p-1 shadow-lg whitespace-nowrap">
              Profile
            </span>
          )}
          <ProfileWindow
            isOpen={isProfileOpen}
          />
        </div>
      </div>
    </header>
  );
}
