
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import DoctorDashboard from '../dashboard/DoctorDashboard';
import ReceptionistDashboard from '../dashboard/ReceptionistDashboard';
import AdminDashboard from '../dashboard/AdminDashboard';
import CustomerDashboard from '../dashboard/CustomerDashboard';

const DashboardRouter: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

 
  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <span className="animate-spin inline-block w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full"></span>
        <p className="mt-2 text-neutral-600">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

 
  const rolesArray = Array.isArray(user.roles) ? user.roles : [];


  const roleNames = rolesArray.map((r) => r.name);

 
  if (roleNames.includes('doctor')) {
    return <DoctorDashboard />;
  }


  if (roleNames.includes('receptionist')) {
    return <ReceptionistDashboard />;
  }

  
  if (roleNames.includes('admin')) {
    return <AdminDashboard />;
  }
  if (roleNames.includes('user')) {
    return <CustomerDashboard />;
  }

 
  return (
    <div className="p-6 text-center">
      <p className="text-xl text-red-600">
        Access denied: No dashboard available for your role.
      </p>
    </div>
  );
};

export default DashboardRouter;
