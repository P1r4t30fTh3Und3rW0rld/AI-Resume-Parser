import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Transition } from '@headlessui/react';
import UserInfoBar from './UserInfoBar';

function Navbar({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const showLoginButton = !user && location.pathname === '/';
  const showAdminLoginButton = location.pathname === '/';

  // Admin detection
  let adminEmail = null;
  let isAdmin = false;
  try {
    const token = localStorage.getItem('adminToken');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.email) {
        adminEmail = payload.email;
        isAdmin = true;
      }
    }
  } catch {}

  const handleLogout = () => {
    if (isAdmin) {
      localStorage.removeItem('adminToken');
      navigate('/');
      window.location.reload(); // force UI update
    } else {
      onLogout();
      navigate('/');
    }
  };

  return (
    <nav className="w-full glass glass-rounded bg-black/40 backdrop-blur-md border-b border-white/10 shadow-lg px-4 py-3 flex items-center justify-between fixed top-0 left-0 z-50">
      <Link to="/" className="text-2xl font-extrabold text-white tracking-tight drop-shadow-lg">
        {isAdmin ? 'AI Resume Parser | Admin Panel' : 'AI Resume Parser'}
      </Link>
      <div className="hidden md:flex items-center gap-4">
        {isAdmin ? (
          <UserInfoBar email={adminEmail} onLogout={handleLogout} />
        ) : user ? (
          <UserInfoBar email={user.email} onLogout={handleLogout} />
        ) : (
          <>
            {showLoginButton && (
              <Link
                to="/login"
                className="px-4 py-2 bg-white/10 text-white font-semibold hover:bg-white/20 transition duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 animate-fade-in"
              >
                Login / Signup
              </Link>
            )}
            {showAdminLoginButton && (
              <Link
                to="/admin"
                className="px-4 py-2 bg-white/10 text-pink-300 font-semibold hover:bg-white/20 transition duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-pink-400 animate-fade-in ml-2"
              >
                Admin Login
              </Link>
            )}
          </>
        )}
      </div>
      {/* Mobile Hamburger */}
      <div className="md:hidden flex items-center">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      <Transition
        show={menuOpen}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 -translate-y-4"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 -translate-y-4"
      >
        <div className="absolute top-16 right-4 glass bg-black/70 backdrop-blur-md border border-white/10 shadow-lg p-4 flex flex-col gap-2 md:hidden z-50 animate-fade-in">
          {isAdmin ? (
            <UserInfoBar email={adminEmail} onLogout={() => { setMenuOpen(false); handleLogout(); }} />
          ) : user ? (
            <UserInfoBar email={user.email} onLogout={() => { setMenuOpen(false); handleLogout(); }} />
          ) : (
            <>
              {showLoginButton && (
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-2 bg-white/10 text-white font-semibold hover:bg-white/20 transition duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  Login / Signup
                </Link>
              )}
              {showAdminLoginButton && (
                <Link
                  to="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-2 bg-white/10 text-pink-300 font-semibold hover:bg-white/20 transition duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-pink-400 mt-2"
                >
                  Admin Login
                </Link>
              )}
            </>
          )}
        </div>
      </Transition>
    </nav>
  );
}

export default Navbar; 