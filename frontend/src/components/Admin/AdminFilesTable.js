import React from 'react';

function AdminFilesTable({ files, handleDownload }) {
  return (
    <div className="overflow-x-auto w-full h-[500px]">
      <table className="w-full text-sm glass bg-black/30 border border-white/10 table-fixed">
        <thead>
          <tr>
            <th className="px-4 py-2 w-44 text-center">ID</th>
            <th className="px-4 py-2 w-64 text-left">Filename</th>
            <th className="px-4 py-2 w-40 text-center">Uploaded</th>
            <th className="px-4 py-2 w-32 text-center">Download</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr key={file._id} className="border-b border-white/20">
              <td className="px-4 py-2 font-mono truncate max-w-[11rem] border border-white/20 text-center">{file._id}</td>
              <td className="px-4 py-2 truncate max-w-[16rem] border border-white/20 text-left">{file.filename}</td>
              <td className="px-4 py-2 truncate max-w-[10rem] border border-white/20 text-center">{file.uploadDate ? new Date(file.uploadDate).toLocaleString() : '-'}</td>
              <td className="px-4 py-2 border border-white/20 text-center">
                <button
                  onClick={() => handleDownload(file._id)}
                  className="px-4 py-1 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold hover:scale-105 transition-transform duration-200 shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  Download
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminFilesTable; 