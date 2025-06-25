import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authService } from './services/auth.service';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';

// Componente para rutas protegidas
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = authService.getToken();
  if (!token) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Rutas protegidas */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <div>Admin Dashboard</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/empleado/dashboard"
            element={
              <ProtectedRoute>
                <div>Empleado Dashboard</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/cliente/dashboard"
            element={
              <ProtectedRoute>
                <div>Cliente Dashboard</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App; 