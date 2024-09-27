'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { login } from '../../../../Backend/utils/api';

export default function LoginPage() {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setError(null);

    // Check for empty fields
    if (!userId || !password) {
      setError('User ID and password cannot be empty.');
      return;
    }

    try {
      const data = { email: userId, password };
      const response = await login(data);
      console.log("response",response);
      
      if (response.token) {
        // Store the token in localStorage
        localStorage.setItem('token', response.token);

        // Check the user's role and navigate accordingly
        switch (response.user.role) {
          case 'admin':
            router.push('/admin_dashboard/main_dashboard', );
            break;
          case 'teacher':
            router.push('/teacher_dashboard');
            break;
          case 'student':
            router.push('/student_dashboard');
            break;
          default:
            setError('Unknown role. Please contact support.');
            break;
        }
      } else {
        // If there's an error message from the backend
        if (response.message) {
          setError(response.message);
        } else {
          setError('Login failed, please check your credentials.');
        }
      }
    } catch (err) {
      console.error('Login error:', err);

      // Differentiate between common error types
      if (err.response) {
        switch (err.response.status) {
          case 400:
            setError('Invalid credentials!');
            break;
          case 401:
            setError('Unauthorized. Please check your User ID and password.');
            break;
          case 500:
            setError('Server error. Please try again later.');
            break;
          default:
            setError('An unknown error occurred. Please try again.');
        }
      } else if (err.request) {
        setError('Network error. Please check your internet connection.');
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-custom-gradient">
      <div className="bg-white bg-opacity-50 rounded-lg shadow-2xl p-6 flex flex-col items-center max-w-md mx-auto">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">
          SMART GAZE
        </h2>
        <p className="text-gray-700 mb-8 text-center">
          Sign in to access the CCTV Classroom Monitoring System
        </p>
        <div className="w-full flex justify-center mb-6">
          <Image 
            src="/images/smart gaze.jpg"
            alt="Smart Gaze Illustration"
            width={150}
            height={150}
            className="rounded-full"
          />
        </div>
        <form className="w-full space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              User ID
            </label>
            <input 
              type="text" 
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your User ID"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Password
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your password"
            />
          </div>
          <div className="text-sm text-right">
            <Link href="/forgot_password">
              <span className="font-medium text-gray-600 hover:text-gray-700">
                Forgot password?
              </span>
            </Link>
          </div>
          {error && (
            <div className="text-red-500 text-sm mb-4">
              {error}
            </div>
          )}
          <div>
            <button 
              type="submit" 
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-darkblue transition duration-150 ease-in-out"
            >
              Login
            </button>
          </div>
          <div>
            
          </div>
        </form>
      </div>
    </div>
  );
}
