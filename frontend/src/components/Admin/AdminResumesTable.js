import React from 'react';

function AdminResumesTable({ resumes, openModal }) {
  return (
    <div className="overflow-x-auto w-full h-[500px]">
      <table className="w-full text-sm glass bg-black/30 border border-white/10 table-fixed">
        <thead>
          <tr>
            <th className="px-4 py-2 w-44 text-center">ID</th>
            <th className="px-4 py-2 w-64 text-left">Filename</th>
            <th className="px-4 py-2 w-32 text-center">User</th>
            <th className="px-4 py-2 w-40 text-center">Uploaded</th>
            <th className="px-4 py-2 w-32 text-center">Links</th>
            <th className="px-4 py-2 w-40 text-center">Raw Data</th>
          </tr>
        </thead>
        <tbody>
          {resumes.map((resume) => (
            <tr key={resume._id} className="border-b border-white/20">
              <td className="px-4 py-2 font-mono truncate max-w-[11rem] border border-white/20 text-center">{resume._id}</td>
              <td className="px-4 py-2 truncate max-w-[16rem] border border-white/20 text-left">{resume.filename}</td>
              <td className="px-4 py-2 truncate max-w-[8rem] border border-white/20 text-center">{resume.user || '-'}</td>
              <td className="px-4 py-2 truncate max-w-[10rem] border border-white/20 text-center">{resume.uploadDate ? new Date(resume.uploadDate).toLocaleString() : '-'}</td>
              <td className="px-4 py-2 max-w-[8rem] align-top border border-white/20 text-center">
                <button
                  className="underline text-blue-200 hover:text-blue-400 transition"
                  onClick={() => openModal('Links', resume.links && resume.links.length > 0 ? resume.links.join('\n') : '-')}
                >
                  Links
                </button>
              </td>
              <td className="px-4 py-2 max-w-[10rem] align-top border border-white/20 text-center">
                <button
                  className="underline text-green-200 hover:text-green-400 transition"
                  onClick={() => openModal('Raw Data', JSON.stringify({ raw_text: resume.raw_text, links: resume.links }, null, 2))}
                >
                  Raw Data
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminResumesTable; 