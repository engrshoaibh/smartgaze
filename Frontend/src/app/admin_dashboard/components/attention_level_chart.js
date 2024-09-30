// components/attention_level_chart.js
import React from 'react';
import { Pie } from 'react-chartjs-2';

const AttentionLevelChart = () => {
  const data = {
    labels: ['Focused', 'Unfocused', 'Drowsy'],
    datasets: [
      {
        data: [50, 30, 20],
        backgroundColor: [
          '#008080',
          '#E0FFFF',
          '#FFCE56',
        ],
        hoverBackgroundColor: [
          '#007070',
          '#B0E0E6',
          '#FFC107',
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
