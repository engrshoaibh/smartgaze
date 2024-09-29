import { FaUserGraduate } from 'react-icons/fa';

export default function StatisticsCard({ title, value, icon }) {
  return (
    <div className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md space-x-4">
      <div className="bg-blue-200 p-3 rounded-full text-blue-600">
        {icon ? icon : <FaUserGraduate size={24} />}
      </div>
      
      <div>
        <h2 className="text-sm font-medium text-gray-700 dark:text-white">{title}</h2>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}
