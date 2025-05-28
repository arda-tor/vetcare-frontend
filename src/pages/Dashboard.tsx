import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DoctorDashboard from './dashboard/DoctorDashboard';
import ReceptionistDashboard from './dashboard/ReceptionistDashboard';
import AdminDashboard from './dashboard/AdminDashboard';

const Dashboard: React.FC = () => {
  const { isAuthenticated, user, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Render appropriate dashboard based on user role
  const renderDashboard = () => {
    switch (user.role) {
      case 'doctor':
        return <DoctorDashboard />;
      case 'receptionist':
        return <ReceptionistDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <Navigate to="/" replace />;
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-neutral-50">
      {renderDashboard()}
    </div>
  );
};

export default Dashboard;