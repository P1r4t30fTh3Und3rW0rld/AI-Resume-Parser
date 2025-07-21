import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthTabs from '../components/AuthTabs';
import UserInfoBar from '../components/UserInfoBar';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

function LoginPage() {
  const { user, login, register, loading, logout } = useAuth();
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [showVerificationNotice, setShowVerificationNotice] = useState(false);
  const [authError, setAuthError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError(null);
    const result = await login(authEmail, authPassword);
    if (result.error) {
      if (result.error.message && result.error.message.toLowerCase().includes('email not confirmed')) {
        setShowVerificationNotice(true);
        setAuthError('Please verify your email before logging in.');
        // Do NOT show toast for this case
      } else if (result.error.message && result.error.message.toLowerCase().includes('please verify your email')) {
        setShowVerificationNotice(true);
        setAuthError('Please verify your email before logging in.');
        // Do NOT show toast for this case
      } else {
        setAuthError('Invalid email or password');
        toast.error('Invalid email or password.');
      }
    } else {
      toast.success('Login successful! Redirecting to dashboard...');
      setTimeout(() => navigate('/dashboard'), 1200);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthError(null);
    const result = await register(authEmail, authPassword);
    if (result.error) {
      if (result.error.message && result.error.message.toLowerCase().includes('user already registered')) {
        setAuthError('User already exists');
        toast.error('User already exists.');
      } else if (result.error.message && result.error.message.toLowerCase().includes('weak password')) {
        setAuthError('Weak password');
        toast.error('Password is too weak.');
      } else {
        setAuthError(result.error.message || 'Registration failed');
        toast.error(result.error.message || 'Registration failed.');
      }
    } else {
      setShowVerificationNotice(true);
      toast.success('Registration successful! Please verify your email.');
    }
  };

  const onCheckMail = () => {
    window.open('https://mail.google.com', '_blank');
  };

  return (
    <div className="cribble-bg min-h-screen flex flex-col items-center justify-center px-4">
      {showVerificationNotice && !user && (
        <div className="fixed top-16 left-0 w-full flex justify-center z-50 animate-fade-in">
          <div className="flex items-center gap-3 bg-blue-900/90 border border-blue-400/30 rounded-lg px-6 py-3 mt-2 shadow-lg text-blue-100 max-w-xl w-full mx-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="flex-1">Please verify your account. We've sent a verification link to your email.{' '}
              <button onClick={onCheckMail} className="underline text-blue-200 hover:text-white ml-1" style={{textDecorationThickness: '2px'}}>Check your mail</button>
            </span>
            <button onClick={() => setShowVerificationNotice(false)} className="ml-2 text-blue-200 hover:text-white focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      {user ? (
        <div className="w-full max-w-md mx-auto glass bg-black/40 p-8 shadow-lg animate-fade-in flex flex-col items-center">
          <UserInfoBar email={user.email} onLogout={logout} />
        </div>
      ) : (
        <AuthTabs
          authEmail={authEmail}
          setAuthEmail={setAuthEmail}
          authPassword={authPassword}
          setAuthPassword={setAuthPassword}
          handleLogin={handleLogin}
          handleRegister={handleRegister}
          authLoading={loading}
          authError={authError}
          showVerificationNotice={showVerificationNotice}
          setShowVerificationNotice={setShowVerificationNotice}
          onCheckMail={onCheckMail}
        />
      )}
    </div>
  );
}

export default LoginPage; 