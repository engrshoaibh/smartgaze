import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

// Register the components for the Pie chart
ChartJS.register(ArcElement, Tooltip, Legend);

export default function AttendanceChart() {
  const data = {
    labels: ['Total Present', 'Total Absent'],
    datasets: [
      {
        label: 'Attendance',
        backgroundColor: ['#3b82f6', '#22d3ee'], // Colors for Present and Absent
        data: [1420, 220], // Total attendance data (sum of daily records)
      },
    ],
  };

  return <Pie data={data} />;
}
