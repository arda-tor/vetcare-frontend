// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import DashboardRouter from './pages/dashboard/DashboardRouter';
import CustomerMedicalRecords from './pages/dashboard/CustomerMedicalRecords';
import MedicalRecords from './pages/dashboard/MedicalRecords';

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
            <Route path="/dashboard" element={<DashboardRouter />} />
            <Route path="/customer-medical-records/:petId?" element={<CustomerMedicalRecords />} />
            
            <Route path="/medical-records" element={<MedicalRecords />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
