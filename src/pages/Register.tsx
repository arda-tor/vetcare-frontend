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
            <div className="bg-primary-50 border border-primary-100 rounded-lg p-4">
              <h3 className="font-medium text-primary-800 mb-2">For Demo Purpose:</h3>
              <p className="text-sm text-neutral-700">
                In a production environment, staff registration would typically require admin approval. For this demo, all registrations are automatically approved.
              </p>
            </div>
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
