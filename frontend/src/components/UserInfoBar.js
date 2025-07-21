import React, { useState, useRef, useEffect } from 'react';

function UserInfoBar({ email, onLogout }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className="flex items-center justify-between w-full max-w-xs mx-auto px-3 py-1.5 rounded-full glass glass-pill bg-black/50 border border-white/10 shadow-md">
      <span className="text-white text-sm font-mono truncate max-w-[120px]">{email}</span>
      <div className="relative ml-2" ref={dropdownRef}>
        <button
          className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-800/70 hover:bg-gray-700/80 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          onClick={() => setOpen((v) => !v)}
          aria-label="User menu"
        >
          <span className="flex flex-col items-center justify-center gap-0.5">
            <span className="block w-1 h-1 rounded-full bg-gray-300 mb-0.5"></span>
            <span className="block w-1 h-1 rounded-full bg-gray-300 mb-0.5"></span>
            <span className="block w-1 h-1 rounded-full bg-gray-300"></span>
          </span>
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-36 bg-black/90 glass border border-white/10 rounded-xl shadow-lg z-50 py-2 animate-fade-in">
            <button
              className="w-full text-left px-4 py-2 text-gray-200 hover:bg-white/10 transition font-medium"
              onClick={() => { setOpen(false); }}
              disabled
            >
              Profile (coming soon)
            </button>
            <button
              className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-600/20 transition font-medium"
              onClick={() => { setOpen(false); onLogout(); }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserInfoBar; 