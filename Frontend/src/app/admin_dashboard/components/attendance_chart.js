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
        backgroundColor: ['#6B8E23', '#D8BFD8'],
        data: [1420, 220],
      },
    ],
  };

  return <Pie data={data} />;
}
