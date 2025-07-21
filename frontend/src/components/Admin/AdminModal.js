import React from 'react';

function AdminModal({ modalOpen, closeModal, modalTitle, modalContent, copyToClipboard }) {
  if (!modalOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="glass bg-black/90 border border-white/10 shadow-2xl p-6 max-w-lg w-full relative animate-fade-in">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-white text-xl font-bold focus:outline-none"
          onClick={closeModal}
          aria-label="Close"
        >
          &times;
        </button>
        <button
          className="absolute top-2 right-10 text-gray-400 hover:text-white text-xl focus:outline-none"
          onClick={copyToClipboard}
          aria-label="Copy"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" strokeWidth="2" fill="none" />
            <rect x="3" y="3" width="13" height="13" rx="2" ry="2" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        </button>
        <h3 className="text-lg font-semibold mb-4 text-white">{modalTitle}</h3>
        <pre className="text-xs bg-gray-900/80 text-green-200 rounded p-2 overflow-x-auto overflow-y-auto whitespace-pre-wrap font-mono max-h-72">
          {modalContent}
        </pre>
      </div>
    </div>
  );
}

export default AdminModal; 