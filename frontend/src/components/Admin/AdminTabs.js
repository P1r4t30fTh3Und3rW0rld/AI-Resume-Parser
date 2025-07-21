import React from 'react';

function AdminTabs({ tab, setTab }) {
  return (
    <div className="flex justify-start gap-4 px-2 pt-4 pb-4">
      <button
        className={`px-6 py-2 rounded-t-lg font-semibold transition-all duration-200 focus:outline-none ${tab === 'files' ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
        onClick={() => setTab('files')}
      >
        Uploaded Files
      </button>
      <button
        className={`px-6 py-2 rounded-t-lg font-semibold transition-all duration-200 focus:outline-none ${tab === 'resumes' ? 'bg-gradient-to-r from-pink-600 to-violet-600 text-white shadow-lg' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
        onClick={() => setTab('resumes')}
      >
        Resume Records
      </button>
    </div>
  );
}

export default AdminTabs; 