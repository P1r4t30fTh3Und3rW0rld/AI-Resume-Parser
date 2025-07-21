import React, { useState, useEffect } from 'react';
import { FaApple, FaGoogle, FaTwitter } from 'react-icons/fa';
import { FiMail, FiLock } from 'react-icons/fi';

function AuthTabs({
  authEmail,
  setAuthEmail,
  authPassword,
  setAuthPassword,
  handleLogin,
  handleRegister,
  authLoading,
  authError,
  showVerificationNotice,
  setShowVerificationNotice,
  onCheckMail
}) {
  const [mode, setMode] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);

  useEffect(() => {
    setAdminLoggedIn(!!localStorage.getItem('adminToken'));
  }, []);

  // When switching to login, hide the verification notice
  useEffect(() => {
    if (mode === 'login' && showVerificationNotice) {
      // If switching to login, hide the notice
      if (typeof setShowVerificationNotice === 'function') setShowVerificationNotice(false);
    }
    // eslint-disable-next-line
  }, [mode]);

  // Social login handlers (dummy)
  const handleSocial = (provider) => {
    alert(`Social login with ${provider} coming soon!`);
  };

  // Wrap handleRegister to switch to login on success
  const handleRegisterAndSwitch = async (e) => {
    const result = await handleRegister(e);
    if (result && !result.error) {
      setMode('login');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-black/70 border border-white/10 shadow-2xl rounded-2xl p-8 flex flex-col items-center animate-fade-in">
      {/* Logo */}
      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center mb-4">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="#18181b"/><path d="M16 8v8l6 6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
      <h2 className="text-2xl font-bold text-white mb-1 text-center">{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
      <p className="text-gray-400 mb-6 text-center text-sm">
        {mode === 'login' ? (
          <>
            Don't have an account yet?{' '}
            <button type="button" className="text-white font-semibold hover:underline" onClick={() => setMode('signup')}>Sign up</button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button type="button" className="text-white font-semibold hover:underline" onClick={() => { setMode('login'); if (typeof setShowVerificationNotice === 'function') setShowVerificationNotice(false); }}>Log in</button>
          </>
        )}
      </p>
      {adminLoggedIn && (
        <div className="mb-4 text-center text-red-400 font-semibold">
          Please log out from admin account before logging in or registering as a user.
        </div>
      )}
      <form
        onSubmit={mode === 'login' ? handleLogin : handleRegisterAndSwitch}
        className="flex flex-col gap-4 w-full"
      >
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <FiMail size={20} />
          </span>
          <input
            type="email"
            required
            placeholder="email address"
            value={authEmail}
            onChange={e => setAuthEmail(e.target.value)}
            className="pl-12 pr-4 py-3 rounded-xl bg-zinc-900/90 text-white border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow placeholder-gray-400 w-full"
            disabled={adminLoggedIn}
          />
        </div>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <FiLock size={20} />
          </span>
          <input
            type={showPassword ? 'text' : 'password'}
            required
            placeholder="Password"
            value={authPassword}
            onChange={e => setAuthPassword(e.target.value)}
            className="pl-12 pr-12 py-3 rounded-xl bg-zinc-900/90 text-white border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow placeholder-gray-400 w-full"
            disabled={adminLoggedIn}
          />
          <button
            type="button"
            tabIndex={-1}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 focus:outline-none"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            disabled={adminLoggedIn}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.274.857-.642 1.67-1.09 2.418M15.54 15.54A5.978 5.978 0 0112 17c-3.314 0-6-2.686-6-6 0-.657.1-1.29.282-1.885" /></svg>
          </button>
        </div>
        {authError && <p className="text-red-400 text-sm animate-shake">{authError}</p>}
        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          disabled={authLoading || adminLoggedIn}
        >
          {authLoading ? (mode === 'login' ? 'Logging in...' : 'Signing up...') : (mode === 'login' ? 'Login' : 'Sign Up')}
        </button>
      </form>
      <div className="flex items-center my-6 w-full">
        <div className="flex-1 h-px bg-zinc-700" />
        <span className="mx-4 text-gray-500 text-sm">OR</span>
        <div className="flex-1 h-px bg-zinc-700" />
      </div>
      <div className="flex gap-4 w-full">
        <button
          type="button"
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-white font-semibold shadow focus:outline-none focus:ring-2 focus:ring-white/20 transition"
          onClick={() => handleSocial('Apple')}
          disabled={adminLoggedIn}
        >
          <FaApple size={20} />
        </button>
        <button
          type="button"
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-white font-semibold shadow focus:outline-none focus:ring-2 focus:ring-white/20 transition"
          onClick={() => handleSocial('Google')}
          disabled={adminLoggedIn}
        >
          <FaGoogle size={20} />
        </button>
        <button
          type="button"
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-white font-semibold shadow focus:outline-none focus:ring-2 focus:ring-white/20 transition"
          onClick={() => handleSocial('X')}
          disabled={adminLoggedIn}
        >
          <FaTwitter size={20} />
        </button>
      </div>
    </div>
  );
}

export default AuthTabs; 