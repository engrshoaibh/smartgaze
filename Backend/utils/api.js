import axios from 'axios';

const API_URL = 'http://localhost:3001/api/v1';

const login = async (data) => {
  console.log("Data Received", data);

  const response = await axios.post(`${API_URL}/auth/login`, data);
  return response.data;
};

const signup = async (userData) => {
  try {
    console.log("Create Profile", userData)
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

const createClass = async (classData, token) => {
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
const getClasses = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/class/getClasses`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting the form:', error);

  }
}

const getTeachers = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/admin/users/getTeachers`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
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

const getUsers = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/admin/users/getUsers`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('All Users data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching users data:', error);
    throw error;
  }
};
const getStudentsByClass = async (className) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/teacher/users/getStudentsByClass`,
      {
        className
      },
      {
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
const getAssignedClasses = async () => {
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

const addStudentToCourse = async (classId, courseCode, studentId) => {
  try {
    const token = localStorage.getItem('token'); // Retrieve the token from local storage
    const response = await axios.post(
      `${API_URL}/class/${classId}/courses/${courseCode}/students`,
      { studentId },
      {
        headers: {
          Authorization: `Bearer ${token}` // Include the authorization token in the headers
        }
      }
    );

    console.log(response.data.message); // Log success message
    return response.data; // Return the response data
  } catch (error) {
    console.error('Error adding student to course:', error.response?.data || error.message);
    throw error; // Throw the error to be handled by the calling function
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

const removeStudentFromCourse = async (classId, courseCode, studentId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_URL}/class/${classId}/courses/${courseCode}/students/${studentId}`, {
      headers: {
        Authorization: `Bearer ${token}` // Include the authorization token in the headers
      }
    });

    console.log(response.data.message); // Log success message
    return response.data; // Return the response data
  } catch (error) {
    console.error('Error removing student from course:', error.response?.data || error.message);
  }
};
const createOrUpdateSchedule = async (classId, courseCode, courseName, day, timeSlot) => {
  try {
    const token = localStorage.getItem('token');

    const response = await axios.post(`${API_URL}/class/${classId}/schedule`, {
      courseCode,
      courseName,
      day,
      timeSlot
    }, {
      headers: {
        Authorization: `Bearer ${token}` // Include the authorization token in the headers
      }
    });

    console.log(response.data.message); // Log success message
    return response.data; // Return the response data
  } catch (error) {
    console.error('Error creating/updating schedule:', error.response?.data || error.message);
  }
};

const getCourseSchedule = async (classId, courseCode) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/class/${classId}/schedule/${courseCode}`, {
      headers: {
        Authorization: `Bearer ${token}` // Include the authorization token in the headers
      }
    });

    return response.data;
  } catch (error) {
    console.error("Error getting Course Schedule", error.message)
  }
}

const getDashboardStats = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/admin/dashboardStats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

const updateUser = async (data, userId) => {
  try {
    console.log("Updated Received:", data, userId);
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/admin/users/${userId}`,
      {
        data
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    console.log('Update User Details:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating users data:', error);
    throw error;
  }
};
const deleteUser = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_URL}/admin/users/${userId}`,

      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

    return response.status;
  } catch (error) {
    console.error('Error deleting users data:', error);
    throw error;
  }
};


//Attendance APIs

async function markAttendance(classId, attendanceData) {
  try {
    const token = localStorage.getItem("token")
    const response = await axios.post(`${API_URL}/attendance/mark/class/${classId}`,
      attendanceData,
      {
        headers: {
          Authorization: `Bearer ${token}` // Assuming you're using JWT for authentication
        }
      }
    );
    console.log('Attendance marked:', response.data);
  } catch (error) {
    console.error('Error marking attendance:', error.response?.data || error.message);
  }
}



async function getAttendanceByStudent(studentId) {
  try {
    const token = localStorage.getItem("token")
    const response = await axios.get(
      `${API_URL}/attendance/student/${studentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    console.log('Student attendance:', response.data);
  } catch (error) {
    console.error('Error fetching student attendance:', error.response?.data || error.message);
  }
}


async function getStudentAttendanceSummary(studentId) {
  try {
    const token = localStorage.getItem("token")
    const response = await axios.get(
      `${API_URL}/attendance/student/${studentId}/summary`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    console.log('Student attendance summary:', response.data);
  } catch (error) {
    console.error('Error fetching student attendance summary:', error.response?.data || error.message);
  }
}
async function getAttendance() {
  try {
    const token = localStorage.getItem("token")
    const response = await axios.get(
      `${API_URL}/attendance/getAttendance`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching student attendance summary:', error.response?.data || error.message);
  }
}

async function getTotalCountOfAttendance() {
  try {
    const token = localStorage.getItem("token")
    const response = await axios.get(
      `${API_URL}/attendance/totalCountOfAttendance`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching student total attendance counts:', error.response?.data || error.message);
  }
}
async function getTotalCountOfEmotions() {
  try {
    const token = localStorage.getItem("token")
    const response = await axios.get(
      `${API_URL}/emotion/totalCountOfEmotions`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching student total attendance counts:', error.response?.data || error.message);
  }
}

export {getTotalCountOfEmotions,getTotalCountOfAttendance,getAttendance,getClasses, getAttendanceByStudent, getStudentAttendanceSummary, markAttendance, deleteUser, updateUser, getUsers, getCourseSchedule, removeStudentFromCourse, getStudentsByClass, login, createOrUpdateSchedule, signup, forgotPassword, createClass, getTeachers, getStudents, getAssignedClasses, addStudentToCourse, customizations, getCustomizations, getDashboardStats };
