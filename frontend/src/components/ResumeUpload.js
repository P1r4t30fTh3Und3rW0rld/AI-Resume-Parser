import React, { useState } from 'react';
import toast from 'react-hot-toast';

function ResumeUpload({ onParsed }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a file to upload.');
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append('resume', file);
    try {
      const res = await fetch('/upload', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      toast.success('Resume uploaded and parsed successfully.');
      if (onParsed) onParsed(data);
    } catch (err) {
      toast.error('Failed to upload resume. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleUpload} className="w-full glass bg-black/40 border border-white/10 shadow-2xl flex flex-col items-center gap-4 p-8 animate-fade-in">
      <h2 className="text-xl font-semibold text-white mb-2">Upload Your Resume</h2>
      <input
        type="file"
        accept=".pdf,.doc,.docx,.txt"
        onChange={handleFileChange}
        className="block w-full text-sm text-white bg-gray-900/90 border-0 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow placeholder-gray-400"
        disabled={uploading}
      />
      <button
        type="submit"
        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold text-lg hover:scale-105 transition-transform duration-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        disabled={uploading}
      >
        {uploading ? 'Uploading...' : 'Upload Resume'}
      </button>
    </form>
  );
}

export default ResumeUpload; 