import React from 'react';

function AdminLoginForm({ loginEmail, setLoginEmail, loginPassword, setLoginPassword, loginError, loading, user, handleLogin }) {
  return (
    <div className="max-w-md w-full glass bg-black/40 border border-white/10 shadow-2xl p-8 animate-fade-in flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-white">Admin Login</h1>
      <form onSubmit={handleLogin} className="max-w-md w-full flex flex-col gap-4 animate-fade-in">
        <input
          type="email"
          placeholder="Admin Email"
          value={loginEmail}
          onChange={e => setLoginEmail(e.target.value)}
          className="rounded-lg px-4 py-3 text-base bg-gray-900/90 text-white border-0 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md placeholder-gray-400"
          required
          disabled={!!user}
        />
        <input
          type="password"
          placeholder="Password"
          value={loginPassword}
          onChange={e => setLoginPassword(e.target.value)}
          className="rounded-lg px-4 py-3 text-base bg-gray-900/90 text-white border-0 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md placeholder-gray-400"
          required
          disabled={!!user}
        />
        {loginError && <div className="text-red-400 text-sm">{loginError}</div>}
        <button
          type="submit"
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-lg font-semibold text-lg hover:scale-105 transition-transform duration-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          disabled={loading || !!user}
        >
          {loading ? 'Logging in...' : 'Login as Admin'}
        </button>
      </form>
    </div>
  );
}

export default AdminLoginForm; 