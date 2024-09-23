import axios from 'axios';

const API_URL = 'http://localhost:3001/api/v1';

const login = async (data) => {
  console.log("Data Received",data);
  
  const response = await axios.post(`${API_URL}/auth/login`, data);
  return response.data;
};

// Signup API
const signup = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/signup`, userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error('Something went wrong!');
    }
  }
};


// const registerStudent = async (data) => {
//   const response = await axios.post(`${API_URL}/student/register`, data);
//   return response.data;S
// };

// const registerTeacher = async (data) => {
//   const response = await axios.post(`${API_URL}/teacher/register`, data);
//   return response.data;
// };

export { login, signup };
