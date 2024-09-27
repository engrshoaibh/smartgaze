import axios from 'axios';

const API_URL = 'http://localhost:3001/api/v1';

const login = async (data) => {
  console.log("Data Received",data);
  
  const response = await axios.post(`${API_URL}/auth/login`, data);
  return response.data;
};

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
const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/auth/forgotPassword`, email, {
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

const createClass = async (classData,token) => {
  try {
    const response = await axios.post(`${API_URL}/class/create`, classData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status === 201) {
      console.log('Class created successfully:', response.data);
      return response.data;
    } else {
      console.error('Failed to create class:', response.statusText);
      return response.statusText;
    }
  } catch (error) {
    console.error('Error submitting the form:', error);
    
  }
};

const getTeachers = async () => {
  try {
    const token = localStorage.getItem('token'); 
    const response = await axios.get(`${API_URL}/admin/users/getTeachers`, {
      headers: {
        Authorization: `Bearer ${token}` 
      }
    });
    console.log('Teachers data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching teachers data:', error);
    throw error;
  }
};

const getStudents = async () => {
  try {
    const token = localStorage.getItem('token'); 
    const response = await axios.get(`${API_URL}/teacher/users/getStudents`, {
      headers: {
        Authorization: `Bearer ${token}` 
      }
    });
    console.log('Students data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching teachers data:', error);
    throw error;
  }
};
const getAllAssignedClasses = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/teacher/my-classes`, {
      headers: {
        Authorization: `Bearer ${token}` 
      }
    });
    console.log(response.data.data.classes); 
    return response.data;
  } catch (error) {
    console.error('Error fetching classes:', error.response?.data || error.message);
  }
};

const addStudentToClass = async (classId, studentId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/teacher/class/${classId}/students`, {
      studentId 
    }, {
      headers: {
        Authorization: `Bearer ${token}` // Include the authorization token in the headers
      }
    });
    
    console.log(response.data.message); // Log success message
    return response.data; // Return the response data
  } catch (error) {
    console.error('Error adding student to class:', error.response?.data || error.message);
  }
};

const customizations = async (threshold, imageInterval) => {
  try {
    const token = localStorage.getItem('token');

    // Check if token exists
    if (!token) {
      return 'Authorization token is missing';
    }

    // Log payload for debugging
    console.log({ threshold, imageInterval });

    const response = await axios.post(`${API_URL}/admin/users/customizations`, 
      { threshold, imageInterval }, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.status === 200 || response.status === 201) {
      return 'Changes saved successfully!';
    } else {
      return 'Failed to save changes. Please try again.';
    }
  } catch (error) {
    if (error.response) {
      // Log server response
      console.error('API Response Error:', error.response.data);  
    } else {
      console.error('API Error:', error.message);  
    }
    return 'Error occurred. Please try again.';
  }
};
const getCustomizations = async () => {
  try {
    const token = localStorage.getItem('token');

    const response = await axios.get(`${API_URL}/admin/users/getCustomizations`, 
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (response.status === 200 || response.status === 201) {
      return response.data.customization;
    } else {
      return 'Failed to get changes. Please try again.';
    }
  } catch (error) {
    if (error.response) {
      console.error('API Response Error:', error.response.data);  
    } else {
      console.error('API Error:', error.message);  
    }
    return 'Error occurred. Please try again.';
  }
};



export { login, signup,forgotPassword,createClass,getTeachers,getStudents, getAllAssignedClasses,addStudentToClass,customizations,getCustomizations};