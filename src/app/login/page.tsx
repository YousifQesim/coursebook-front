"use client"
// Import necessary dependencies
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/AuthForm';
import { apiFetch } from '@/utils/apiHelpers';

// Define the AuthPage component
const AuthPage = () => {
  const [error, setError] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const router = useRouter();

  // Function to handle form submission
  const handleSubmit = async (formData:any) => {
    try {
      const apiUrl = isLoginMode ? 'http://127.0.0.1:5000/api/login' : 'http://127.0.0.1:5000/api/register';
      const data = await apiFetch(apiUrl, 'POST', formData);

      if (isLoginMode) {
        console.log('Login successful');
        router.push('/');
      } else {
        console.log('Signup successful', data);
        // Assuming 'data' contains the token on signup:
        router.push('/dashboard');
      }
    } catch (error:any) {
      setError(error.message || 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-md shadow-md w-96">
        <h1 className="text-2xl font-medium mb-4">
          {isLoginMode ? 'Login' : 'Sign Up'}
        </h1>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        {/* Render the AuthForm component */}
        <AuthForm handleSubmit={handleSubmit} isLoginMode={isLoginMode} />

        <p className="text-center mt-4">
          {isLoginMode ? 'New here? ' : 'Already have an account? '}
          <button
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="text-blue-500 hover:underline"
          >
            {isLoginMode ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
