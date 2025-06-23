// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Health from './pages/Health';
import ForgotPassword from './pages/ForgotPassword';
import Calendar from './pages/Calendar';
import DashboardRouter from './pages/dashboard/DashboardRouter';
import CustomerMedicalRecords from './pages/dashboard/CustomerMedicalRecords';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/calendar" element={<Calendar />} />
            {/* DashboardRouter, role kontrolünü yapıp ilgili dashboard'ı yüklüyor */}
            <Route path="/dashboard" element={<DashboardRouter />} />

            <Route path="/customer-medical-records" element={<CustomerMedicalRecords />} />

            <Route path="/health" element={<Health />} />
            {/* Eğer rol bazlı alt rotalar planlanırsa örn:
            <Route path="/dashboard/doctor" element={<DoctorDashboard />} />
            <Route path="/dashboard/receptionist" element={<ReceptionistDashboard />} />
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
             gibi ekleyebilirsin. */}

          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
