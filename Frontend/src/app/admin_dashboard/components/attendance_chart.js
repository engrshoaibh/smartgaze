import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { getTotalCountOfAttendance} from '../../../../../Backend/utils/api';
import { useEffect, useState } from 'react';
// Register the components for the Pie chart


ChartJS.register(ArcElement, Tooltip, Legend);

export default function AttendanceChart() {
  const [count, setCount] = useState();
const fetchAttendanceCount = async () => {
  const response = await getTotalCountOfAttendance();
  console.log(response);
  
  setCount(response);
  
}
  useEffect(()=>{
    fetchAttendanceCount();
  },[])
  const data = {
    labels: ['Total Present', 'Total Absent'],
    datasets: [
      {
        label: 'Attendance',
        backgroundColor: ['#6B8E23', '#D8BFD8'],
        data: [count?.totalPresent, count?.totalAbsent],
      },
    ],
  };

  return <Pie data={data} />;
}
