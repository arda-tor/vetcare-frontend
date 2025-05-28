import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [redirecting, setRedirecting] = useState(false);

  const handleLoginSuccess = (role: string) => {
    setRedirecting(true);
    
    // Add slight delay for better UX
    setTimeout(() => {
      navigate('/dashboard');
    }, 500);
  };

  // If already authenticated, redirect to dashboard
  if (isAuthenticated && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-12">
          <div className="max-w-md">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-neutral-800 mb-4">
              Welcome to PetCare Staff Portal
            </h1>
            <p className="text-lg text-neutral-600 mb-4">
              Sign in to access your dashboard, manage appointments, and provide exceptional care to our patients.
            </p>
            <div className="bg-primary-50 border border-primary-100 rounded-lg p-4">
              <h3 className="font-medium text-primary-800 mb-2">For Demo Purpose:</h3>
              <p className="text-sm text-neutral-700">
                Use one of the following emails with any password:
              </p>
              <ul className="text-sm text-neutral-700 list-disc list-inside">
                <li>doctor@example.com (Doctor)</li>
                <li>receptionist@example.com (Receptionist)</li>
                <li>admin@example.com (Administrator)</li>
              </ul>
            </div>
          </div>
          
          <div className="w-full max-w-md">
            <LoginForm onSuccess={handleLoginSuccess} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;