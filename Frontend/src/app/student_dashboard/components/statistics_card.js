import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function StatisticsCard({ title, value, data }) {
  const chartData = {
    labels: ['Boys', 'Girls'],
    datasets: [
      {
        data: [1500, 1000], // Pass in [1500, 1000] for example
        backgroundColor: ['#3b82f6', '#22d3ee'], // Colors for the chart sections
        hoverBackgroundColor: ['#2563eb', '#0e7490'], // Colors when hovering
        borderWidth: 2,
      },
    ],
  };

  const options = {
    cutout: '70%', // Creates a donut chart effect
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          boxWidth: 12,
        },
      },
    },
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-center">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <Doughnut data={chartData} options={options} />
      <p className="text-2xl font-bold mt-4">{value}</p>
    </div>
  );
}
