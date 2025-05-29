import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-bold text-neutral-800 mb-4">Welcome to the Dashboard</h1>
        {user && (
          <p className="text-lg text-neutral-600">
            Logged in as <strong>{user.name}</strong> ({user?.roles?.[0]?.name})
          </p>
        )}
        {!user && <p className="text-lg text-neutral-600">No user data found.</p>}
      </div>
    </div>
  );
};

export default Dashboard;
