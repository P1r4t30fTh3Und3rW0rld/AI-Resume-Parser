import React, { useEffect, useState } from 'react';
// import './App.css';

function App() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [parsed, setParsed] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/health')
      .then((res) => res.json())
      .then((data) => {
        setHealth(data.status);
        setLoading(false);
      })
      .catch((err) => {
        setError('Could not connect to backend');
        setLoading(false);
      });
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadStatus(null);
    setUploadError(null);
    setParsed(null);
    setEditing(false);
    setEditData(null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setUploadError('Please select a file');
      return;
    }
    const formData = new FormData();
    formData.append('resume', file);
    setUploadStatus('Uploading...');
    setUploadError(null);
    setParsed(null);
    setEditing(false);
    setEditData(null);
    try {
      const res = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setUploadStatus(data.message);
        setParsed(data.parsed);
      } else {
        setUploadError(data.error || 'Upload failed');
      }
    } catch (err) {
      setUploadError('Could not connect to backend');
    }
  };

  const handleEdit = () => {
    setEditing(true);
    setEditData(JSON.parse(JSON.stringify(parsed)));
  };

  const handleEditChange = (field, value) => {
    setEditData({ ...editData, [field]: value });
  };

  const handleEditArrayChange = (field, idx, subfield, value) => {
    const arr = [...editData[field]];
    arr[idx][subfield] = value;
    setEditData({ ...editData, [field]: arr });
  };

  const handleEditListChange = (field, value) => {
    setEditData({ ...editData, [field]: value.split(',').map(s => s.trim()) });
  };

  const handleSave = async () => {
    setParsed(editData);
    setEditing(false);
    setEditData(null);
    setSaveStatus(null);
    setSaveError(null);
    try {
      const res = await fetch('http://localhost:5000/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });
      const data = await res.json();
      if (res.ok) {
        setSaveStatus('Resume saved to database!');
      } else {
        setSaveError(data.error || 'Failed to save resume');
      }
    } catch (err) {
      setSaveError('Could not connect to backend');
    }
  };

  const handleDownload = () => {
    if (!parsed) return;
    const dataToDownload = {
      raw_text: parsed.raw_text,
      links: parsed.links,
      file_type: parsed.file_type
    };
    const blob = new Blob([JSON.stringify(dataToDownload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (parsed.filename || 'resume_data') + '.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">AI Resume Parser</h1>
      <div className="p-6 bg-white rounded shadow text-center mb-6">
        <h2 className="text-xl font-semibold mb-2">Backend Health Check</h2>
        {loading && <p className="text-gray-500">Checking...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {health && <p className="text-green-600">Backend status: {health}</p>}
      </div>
      <div className="p-6 bg-white rounded shadow text-center mb-6">
        <h2 className="text-xl font-semibold mb-2">Upload Resume (PDF/DOCX)</h2>
        <form onSubmit={handleUpload}>
          <input
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileChange}
            className="mb-4"
          />
          <br />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Upload
          </button>
        </form>
        {uploadStatus && <p className="text-green-600 mt-2">{uploadStatus}</p>}
        {uploadError && <p className="text-red-500 mt-2">{uploadError}</p>}
      </div>
      {parsed && !editing && (
        <div className="p-6 bg-white rounded shadow w-full max-w-2xl mb-6">
          <h2 className="text-xl font-semibold mb-4">Parsed Resume Data</h2>
          {parsed.raw_text && (
            <div className="mb-4">
              <div className="font-bold mb-1">Raw Text:</div>
              <div className="bg-gray-100 p-2 rounded h-48 overflow-auto whitespace-pre-wrap text-xs border">
                {parsed.raw_text}
              </div>
            </div>
          )}
          {parsed.links && Array.isArray(parsed.links) && parsed.links.length > 0 && (
            <div className="mb-4">
              <div className="font-bold mb-1">Links:</div>
              <ul className="bg-gray-50 p-2 rounded h-48 overflow-auto text-xs border">
                {parsed.links.map((link, i) => (
                  <li key={i}>
                    <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mr-2"
            onClick={handleDownload}
          >
            Download JSON
          </button>
          <button
            className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            onClick={handleEdit}
          >
            Edit
          </button>
        </div>
      )}
      {parsed && editing && editData && (
        <div className="p-6 bg-white rounded shadow w-full max-w-2xl mb-6">
          <h2 className="text-xl font-semibold mb-4">Edit Resume Data</h2>
          <div className="text-left space-y-2">
            <div>
              <span className="font-bold">Name:</span>
              <input
                className="border rounded px-2 py-1 ml-2"
                value={editData.name}
                onChange={e => handleEditChange('name', e.target.value)}
              />
            </div>
            <div>
              <span className="font-bold">Email:</span>
              <input
                className="border rounded px-2 py-1 ml-2"
                value={editData.email}
                onChange={e => handleEditChange('email', e.target.value)}
              />
            </div>
            <div>
              <span className="font-bold">Contact Info:</span>
              <input
                className="border rounded px-2 py-1 ml-2"
                value={editData.contact_info?.phone || ''}
                onChange={e => setEditData({ ...editData, contact_info: { ...editData.contact_info, phone: e.target.value } })}
              />
            </div>
            <div>
              <span className="font-bold">Skills:</span>
              <input
                className="border rounded px-2 py-1 ml-2 w-2/3"
                value={editData.skills?.join(', ') || ''}
                onChange={e => handleEditListChange('skills', e.target.value)}
              />
            </div>
            <div>
              <span className="font-bold">Work Experience:</span>
              <ul className="list-disc ml-6">
                {editData.work_experience?.map((exp, i) => (
                  <li key={i} className="mb-2">
                    <input
                      className="border rounded px-2 py-1 mr-2"
                      value={exp.role}
                      onChange={e => handleEditArrayChange('work_experience', i, 'role', e.target.value)}
                    />
                    at
                    <input
                      className="border rounded px-2 py-1 mx-2"
                      value={exp.company}
                      onChange={e => handleEditArrayChange('work_experience', i, 'company', e.target.value)}
                    />
                    (<input
                      className="border rounded px-2 py-1 mx-2 w-24"
                      value={exp.years}
                      onChange={e => handleEditArrayChange('work_experience', i, 'years', e.target.value)}
                    />)
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className="font-bold">Education:</span>
              <ul className="list-disc ml-6">
                {editData.education?.map((edu, i) => (
                  <li key={i} className="mb-2">
                    <input
                      className="border rounded px-2 py-1 mr-2"
                      value={edu.degree}
                      onChange={e => handleEditArrayChange('education', i, 'degree', e.target.value)}
                    />
                    from
                    <input
                      className="border rounded px-2 py-1 mx-2"
                      value={edu.institution}
                      onChange={e => handleEditArrayChange('education', i, 'institution', e.target.value)}
                    />
                    (<input
                      className="border rounded px-2 py-1 mx-2 w-16"
                      value={edu.year}
                      onChange={e => handleEditArrayChange('education', i, 'year', e.target.value)}
                    />)
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className="font-bold">Projects:</span>
              <ul className="list-disc ml-6">
                {editData.projects?.map((proj, i) => (
                  <li key={i} className="mb-2">
                    <input
                      className="border rounded px-2 py-1 mr-2"
                      value={proj.title}
                      onChange={e => handleEditArrayChange('projects', i, 'title', e.target.value)}
                    />
                    :
                    <input
                      className="border rounded px-2 py-1 mx-2 w-2/3"
                      value={proj.description}
                      onChange={e => handleEditArrayChange('projects', i, 'description', e.target.value)}
                    />
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className="font-bold">Certifications:</span>
              <input
                className="border rounded px-2 py-1 ml-2 w-2/3"
                value={editData.certifications?.join(', ') || ''}
                onChange={e => handleEditListChange('certifications', e.target.value)}
              />
            </div>
            <div>
              <span className="font-bold">Social Links:</span>
              <input
                className="border rounded px-2 py-1 ml-2 w-2/3"
                value={editData.social_links?.join(', ') || ''}
                onChange={e => handleEditListChange('social_links', e.target.value)}
              />
            </div>
          </div>
          <button
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mr-2"
            onClick={handleSave}
          >
            Save
          </button>
          <button
            className="mt-4 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            onClick={() => { setEditing(false); setEditData(null); }}
          >
            Cancel
          </button>
        </div>
      )}
      {saveStatus && <p className="text-green-600 mt-2">{saveStatus}</p>}
      {saveError && <p className="text-red-500 mt-2">{saveError}</p>}
    </div>
  );
}

export default App;
