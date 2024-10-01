// components/emotional_chart.js
import React from 'react';
import { Pie } from 'react-chartjs-2';

const EmotionalChart = () => {
  const data = {
    labels: ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral'],
    datasets: [
      {
        data: [15, 10, 15, 10, 30, 10, 10], // Sample data
        backgroundColor: [
          '#87CEEB', 
          '#B0E0E6', 
          '#4682B4', 
          '#7B68EE', 
          '#008080', 
          '#E0FFFF', 
          '#708090', 
        ],
        hoverBackgroundColor: [
          '#6EC3E3', 
          '#A8D6D9', 
          '#3B6A94', 
          '#6A5CE5', 
          '#007B7B', 
          '#C4E4E4', 
          '#657D8D', 
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
