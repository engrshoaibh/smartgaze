// components/attention_level_chart.js
import React from 'react';
import { Pie } from 'react-chartjs-2';

const AttentionLevelChart = () => {
  const data = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [
      {
        data: [50, 30, 20], // Sample data
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
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

export default AttentionLevelChart;
