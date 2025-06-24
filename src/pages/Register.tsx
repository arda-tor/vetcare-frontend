import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';
import { useAuth } from '../contexts/AuthContext';

const Register: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleRegisterSuccess = (role: string) => {
    navigate('/dashboard');
  };

  if (isAuthenticated && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-12">
          <div className="max-w-md">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-neutral-800 mb-4">
              Join PetCare Staff Portal
            </h1>
            <p className="text-lg text-neutral-600 mb-4">
              Create your account to access the staff portal and start managing appointments and patient care.
            </p>
           
          </div>

          <div className="w-full max-w-md">
            <RegisterForm onSuccess={handleRegisterSuccess} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
