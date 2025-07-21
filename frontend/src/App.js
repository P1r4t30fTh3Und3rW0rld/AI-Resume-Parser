import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import { Toaster } from 'react-hot-toast';
import './index.css';
import LandingPage from './pages/LandingPage';
import AdminPanel from './pages/AdminPanel';
import Dashboard from './pages/Dashboard';
import NotFoundPage from './pages/NotFoundPage';

function AppRoutes() {
  const { user, logout } = useAuth();
  const isAdmin = !!localStorage.getItem('adminToken');
  return (
    <>
      <Navbar user={user} onLogout={logout} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/admin" element={isAdmin ? <AdminPanel /> : <Navigate to="/admin-login" />} />
        <Route path="/admin-login" element={<AdminPanel />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(30, 41, 59, 0.95)',
            color: '#fff',
            borderRadius: '12px',
            boxShadow: '0 4px 24px 0 rgba(0,0,0,0.15)',
            padding: '16px 24px',
            fontSize: '1rem',
            minWidth: '260px',
            maxWidth: '350px',
          },
          className: 'animate-toast-slide',
        }}
        gutter={12}
        containerClassName="z-[9999]"
        render={(t) => (
          <div
            className={`relative flex flex-col gap-2 items-start ${t.visible ? 'animate-fade-in-up' : 'animate-fade-out'} transition-all duration-300`}
            style={{ minWidth: 260, maxWidth: 350 }}
          >
            <div>{t.message}</div>
            <div className="absolute left-0 bottom-0 w-full h-1 bg-gradient-to-r from-blue-500 to-pink-500 rounded-b-lg overflow-hidden">
              <div
                className="h-full bg-white/80 transition-all duration-100 linear"
                style={{ width: `${(t.duration - t.remaining) / t.duration * 100}%`, transition: 'width 0.1s linear' }}
              />
            </div>
          </div>
        )}
      />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;