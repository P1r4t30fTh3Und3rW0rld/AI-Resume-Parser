import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import AdminLoginForm from '../components/Admin/AdminLoginForm';
import AdminTabs from '../components/Admin/AdminTabs';
import AdminFilesTable from '../components/Admin/AdminFilesTable';
import AdminResumesTable from '../components/Admin/AdminResumesTable';
import AdminModal from '../components/Admin/AdminModal';

function AdminPanel() {
  const [resumes, setResumes] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('adminToken'));
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState(null);
  const [tab, setTab] = useState('files');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const { user, logout } = useAuth();

  useEffect(() => {
    if (user) {
      setLoginError('Please log out from user account before logging in as admin.');
    }
  }, [user]);

  useEffect(() => {
    if (!isLoggedIn) return;
    async function fetchData() {
      setLoading(true);
      try {
        const token = localStorage.getItem('adminToken');
        const API_URL = process.env.REACT_APP_API_URL;
        const [resumesRes, filesRes] = await Promise.all([
          fetch(`${API_URL}/api/admin/resumes`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_URL}/api/admin/files`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        if (!resumesRes.ok || !filesRes.ok) throw new Error('Unauthorized or error fetching data');
        const resumesData = await resumesRes.json();
        const filesData = await filesRes.json();
        setResumes(resumesData);
        setFiles(filesData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch admin data. Please login again.');
        setIsLoggedIn(false);
        localStorage.removeItem('adminToken');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [isLoggedIn]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError(null);
    if (user) {
      setLoginError('Please log out from user account before logging in as admin.');
      return;
    }
    setLoading(true);
    try {
      if (logout) await logout();
      const API_URL = process.env.REACT_APP_API_URL;
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      localStorage.setItem('adminToken', data.token);
      setIsLoggedIn(true);
      setLoginEmail('');
      setLoginPassword('');
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (title, content) => {
    setModalTitle(title);
    setModalContent(content);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalContent('');
    setModalTitle('');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(modalContent);
    toast.success('Copied to clipboard!');
  };

  const handleDownload = (fileId) => {
    const token = localStorage.getItem('adminToken');
    const API_URL = process.env.REACT_APP_API_URL;
    const a = document.createElement('a');
    a.href = `${API_URL}/api/admin/files/${fileId}/download?token=${token}`;
    a.download = '';
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (!isLoggedIn) {
    return (
      <div className="cribble-bg min-h-screen flex flex-col items-center justify-center px-4 pt-24">
        <AdminLoginForm
          loginEmail={loginEmail}
          setLoginEmail={setLoginEmail}
          loginPassword={loginPassword}
          setLoginPassword={setLoginPassword}
          loginError={loginError}
          loading={loading}
          user={user}
          handleLogin={handleLogin}
        />
      </div>
    );
  }

  return (
    <div className="cribble-bg min-h-screen flex flex-col items-center justify-center px-4 pt-24 text-white">
      <div className="w-full max-w-7xl mx-auto animate-fade-in">
        <AdminTabs tab={tab} setTab={setTab} />
        <div className="p-2">
          {loading ? (
            <div className="text-lg">Loading...</div>
          ) : error ? (
            <div className="text-red-400">{error}</div>
          ) : (
            <>
              {tab === 'files' && (
                <AdminFilesTable files={files} handleDownload={handleDownload} />
              )}
              {tab === 'resumes' && (
                <AdminResumesTable resumes={resumes} openModal={openModal} />
              )}
            </>
          )}
        </div>
      </div>
      <AdminModal
        modalOpen={modalOpen}
        closeModal={closeModal}
        modalTitle={modalTitle}
        modalContent={modalContent}
        copyToClipboard={copyToClipboard}
      />
    </div>
  );
}

export default AdminPanel; 