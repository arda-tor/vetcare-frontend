import React from 'react';
import PasswordRecovery from '../components/auth/PasswordRecovery';

const ForgotPassword: React.FC = () => {
  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-12">
          <div className="max-w-md">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-neutral-800 mb-4">
              Password Recovery
            </h1>
            <p className="text-lg text-neutral-600 mb-4">
              Don't worry, we'll help you get back into your account. Enter your email address and we'll send you instructions to reset your password.
            </p>
            <div className="bg-primary-50 border border-primary-100 rounded-lg p-4">
              <h3 className="font-medium text-primary-800 mb-2">For Demo Purpose:</h3>
              <p className="text-sm text-neutral-700">
                Use one of the following emails:
              </p>
              <ul className="text-sm text-neutral-700 list-disc list-inside">
                <li>doctor@example.com</li>
                <li>receptionist@example.com</li>
                <li>admin@example.com</li>
              </ul>
            </div>
          </div>
          
          <div className="w-full max-w-md">
            <PasswordRecovery />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;