import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HealthProvider, useHealth } from './context/HealthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DoctorDashboard from './pages/DoctorDashboard';

// Simple Route Guard
const ProtectedRoute = ({ children, allowedRole }: { children: React.ReactNode, allowedRole: 'patient' | 'doctor' }) => {
  const { userProfile } = useHealth();
  if (!userProfile) return <Navigate to="/login" />;
  if (userProfile.role !== allowedRole) return <Navigate to="/" />;
  return <>{children}</>;
};

function App() {
  return (
    <HealthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedRole="patient">
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/doctor-dashboard" 
            element={
              <ProtectedRoute allowedRole="doctor">
                <DoctorDashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </HealthProvider>
  );
}

export default App;
