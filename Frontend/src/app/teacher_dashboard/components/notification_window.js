import React from 'react';

export default function NotificationWindow({ notifications, isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 border border-gray-200 rounded-xl shadow-lg p-3 z-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-md font-normal text-gray-800 dark:text-white">Notifications</h3>
        <button
          className="text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
      <div className="max-h-64 overflow-y-auto space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`flex items-start space-x-2 p-2 rounded-lg transition-colors ${
              notification.unread
                ? 'bg-gray-100 dark:bg-gray-700'
                : 'hover:bg-gray-50'
            }`}
          >
            {notification.icon && (
              <div className="text-gray-500 ">
                {notification.icon}
              </div>
            )}
            <div className="flex-grow">
              <p className="text-sm text-gray-800 dark:text-white">
                {notification.title}
              </p>
              <p className="text-xs text-gray-600 dark:text-white">
                {notification.message}
              </p>
              <p className="text-xs text-gray-400 dark:text-white">
                {notification.time}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="text-right mt-3">
        <button
          className="text-xs text-gray-500 hover:underline"
          onClick={onClose}
        >
          Clear Notifications
        </button>
      </div>
    </div>
  );
}
