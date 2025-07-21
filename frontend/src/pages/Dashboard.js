import React, { useState } from 'react';
import ResumeUpload from '../components/ResumeUpload';
import ParsedResult from '../ParsedResult';
import { downloadJSON } from '../utils/file';

function Dashboard() {
  const [parsed, setParsed] = useState(null);
  const handleParsed = (data) => setParsed(data);
  const handleUploadNew = () => setParsed(null);
  return (
    <div className="cribble-bg min-h-screen flex flex-col items-center justify-center px-4 pt-24 text-white">
      <div className="w-full max-w-2xl glass bg-black/40 shadow-lg p-8 animate-fade-in flex flex-col items-center gap-8">
        <h1 className="text-3xl font-bold mb-4 text-center">Welcome to your Dashboard!</h1>
        {!parsed && <ResumeUpload onParsed={handleParsed} />}
        {parsed && (
          <>
            <ParsedResult parsed={parsed} />
            <button
              onClick={() => downloadJSON(parsed, 'parsed_resume.json')}
              className="mt-6 px-6 py-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold hover:scale-105 transition-transform duration-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Upload New Resume
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard; 