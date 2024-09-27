'use client';

import Link from 'next/link';
import { useState } from 'react';
import {forgotPassword} from '../../../../Backend/utils/api'
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');

  const handleSubmit = async(e) => {
    e.preventDefault(); // Prevents the form from submitting and refreshing the page
    if (email) {
      
      await forgotPassword({email});
      alert('The reset link has been sent to the registered email.');
      setEmail(''); // Clear the input field after submission
    } else {
      alert('Please enter your registered email.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-custom-gradient">
      <div className="bg-white bg-opacity-50 rounded-lg shadow-2xl p-8 flex flex-col items-center max-w-md mx-auto">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">
          Forgot Password?
        </h2>
        <p className="text-gray-700 mb-8 text-center">
          Enter your registered email to reset your password.
        </p>
        <form className="w-full space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-darkblue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-darkblue transition duration-150 ease-in-out"
            >
              Reset Password
            </button>
          </div>
          <div className="text-sm text-center mt-4">
            <Link href="/">
              <span className="font-medium text-gray-600 hover:text-gray-700">
                Back to Login
              </span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
