import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Bar } from 'react-chartjs-2';
  
  // Register the components
  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
  
  export default function AttendanceChart() {
    const data = {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      datasets: [
        {
          label: 'Total Present',
          backgroundColor: '#3b82f6',
          data: [200, 250, 180, 220, 300, 270],
        },
        {
          label: 'Total Absent',
          backgroundColor: '#22d3ee',
          data: [50, 30, 40, 20, 30, 50],
        },
      ],
    };
  
    return <Bar data={data} />;
  }
  