// components/emotional_chart.js
import React from 'react';
import { Pie } from 'react-chartjs-2';

const EmotionalChart = () => {
  const data = {
    labels: ['Happy', 'Sad', 'Angry', 'Surprised', 'Neutral'],
    datasets: [
      {
        data: [25, 15, 10, 30, 20], // Sample data
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
        ],
      },
    ],
  };

  return (
    <div>
      <Pie data={data} />
    </div>
  );
};

export default EmotionalChart;
