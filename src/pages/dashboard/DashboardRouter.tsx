// src/pages/DashboardRouter.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import DoctorDashboard from '../dashboard/DoctorDashboard';
import ReceptionistDashboard from '../dashboard/ReceptionistDashboard';
import AdminDashboard from '../dashboard/AdminDashboard';
import CustomerDashboard from '../dashboard/CustomerDashboard';

const DashboardRouter: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // 1) Oturum henüz kontrol ediliyorsa bir yükleniyor ekranı göster
  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <span className="animate-spin inline-block w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full"></span>
        <p className="mt-2 text-neutral-600">Loading...</p>
      </div>
    );
  }

  // 2) Kimlik doğrulaması yoksa /login sayfasına yönlendir
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // 3) Backend’den gelen roles dizisi bazen undefined olabilir,
  //    bu yüzden önce boş dizi atıyoruz:
  const rolesArray = Array.isArray(user.roles) ? user.roles : [];

  // 4) Şimdi güvenle map yapabiliriz
  const roleNames = rolesArray.map((r) => r.name);

  // 5) roleNames içinde "doctor" varsa DoctorDashboard’ı döndür
  if (roleNames.includes('doctor')) {
    return <DoctorDashboard />;
  }

  // 6) roleNames içinde "receptionist" varsa ReceptionistDashboard’ı döndür
  if (roleNames.includes('receptionist')) {
    return <ReceptionistDashboard />;
  }

  // 7) roleNames içinde "admin" varsa AdminDashboard'ı döndür
  if (roleNames.includes('admin')) {
    return <AdminDashboard />;
  }
  if (roleNames.includes('user')) {
    return <CustomerDashboard />;
  }

  // 8) Hiçbiri yoksa yetkisiz sayfası veya basit bir mesaj göster
  return (
    <div className="p-6 text-center">
      <p className="text-xl text-red-600">
        Access denied: No dashboard available for your role.
      </p>
    </div>
  );
};

export default DashboardRouter;
