// components/emotional_chart.js
import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { getTotalCountOfEmotions } from '../../../../../Backend/utils/api';

const EmotionalChart = () => {
  const [emotionsCount, setEmotionsCount] = useState([]);

  // Fetching emotions count from the backend
  const fetchEmotionsCount = async () => {
    try {
      const response = await getTotalCountOfEmotions();
      console.log(response);
      setEmotionsCount(response);
    } catch (error) {
      console.error('Error fetching emotions count:', error);
    }
  };

  useEffect(() => {
    fetchEmotionsCount();
  }, []);

  // If emotionsCount data is not available yet, return a loading state
  if (!emotionsCount.length) {
    return <p>Loading emotions data...</p>;
  }

  // Transforming the fetched data into the format needed for the chart
  const labels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral'];
  const emotionData = labels.map((emotion) => {
    const emotionRecord = emotionsCount.find((e) => e._id === emotion);
    return emotionRecord ? emotionRecord.count : 0; // Return count or 0 if not found
  });

  const data = {
    labels: labels,
    datasets: [
      {
        data: emotionData, // Use the dynamically fetched data
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
