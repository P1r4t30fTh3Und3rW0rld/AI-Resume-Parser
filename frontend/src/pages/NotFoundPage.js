import React from 'react';
import { useNavigate } from 'react-router-dom';

function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="cribble-bg min-h-screen flex flex-col items-center justify-center px-4">
      <div className="glass bg-black/60 border border-white/10 shadow-2xl rounded-xl p-10 flex flex-col items-center animate-fade-in max-w-md w-full">
        <h1 className="text-5xl font-extrabold text-white mb-4">404</h1>
        <p className="text-lg text-gray-300 mb-6 text-center">Sorry, the page you are looking for does not exist.</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-lg shadow hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}

export default NotFoundPage; 