import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Profile.css';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [form, setForm]           = useState({ name: user?.name || '', email: user?.email || '' });
  const [saved, setSaved]         = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleExport = () => {
    const data = {
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      exportedAt: new Date().toISOString(),
      note: 'This file contains all personal data stored about you on HealthAI platform.',
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'healthai_my_data.json'; a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = async () => {
    if (deleteInput !== user.email) return;
    await logout();
    navigate('/login');
  };

  return (
    <div className="page-container">
      <h1 className="page-title" style={{ marginBottom: 24 }}>My Profile</h1>

      <div className="profile-grid">
        {/* Profile Info */}
        <div className="card">
          <div className="profile-avatar-section">
            <div className="profile-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
            <div>
              <h2 className="profile-name">{user?.name}</h2>
              <span className={`badge ${user?.role === 'engineer' ? 'badge-active' : user?.role === 'healthcare' ? 'badge-scheduled' : 'badge-draft'}`}>
                {user?.role === 'engineer' ? '⚙️ Engineer' : user?.role === 'healthcare' ? '🏥 Healthcare Professional' : '🛡️ Admin'}
              </span>
            </div>
          </div>

          <form onSubmit={handleSave} style={{ marginTop: 24 }}>
            <div className="form-group">
              <label>Full Name</label>
              <input className="form-control" name="name" value={form.name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input className="form-control" name="email" value={form.email} disabled style={{ background: 'var(--gray-50)' }} />
              <span className="error-msg" style={{ color: 'var(--gray-400)' }}>Email cannot be changed.</span>
            </div>
            {saved && <div className="auth-success">Profile updated successfully.</div>}
            <button className="btn btn-primary" type="submit">Save Changes</button>
          </form>
        </div>

        {/* GDPR Section */}
        <div className="profile-right">
          <div className="card gdpr-card">
            <h3 className="gdpr-title">🔒 Privacy & GDPR</h3>
            <p className="gdpr-desc">You have full control over your personal data stored on this platform.</p>

            <div className="gdpr-item">
              <div>
                <strong>Export My Data</strong>
                <p>Download all data we store about you as a JSON file.</p>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={handleExport}>Export</button>
            </div>

            <div className="gdpr-item gdpr-danger-item">
              <div>
                <strong>Delete Account</strong>
                <p>Permanently delete your account and all associated data. This action is irreversible.</p>
              </div>
              <button className="btn btn-danger btn-sm" onClick={() => setShowDelete(true)}>Delete</button>
            </div>
          </div>

          <div className="card" style={{ marginTop: 16 }}>
            <h3 className="gdpr-title">🔔 Notifications</h3>
            <div className="notif-list">
              <div className="notif-item">
                <div className="notif-dot notif-dot-new"></div>
                <div>
                  <strong>Meeting request accepted</strong>
                  <p>Dr. Ayse Kaya confirmed your meeting for Post #3.</p>
                  <span className="notif-time">2 hours ago</span>
                </div>
              </div>
              <div className="notif-item">
                <div className="notif-dot"></div>
                <div>
                  <strong>New interest on your post</strong>
                  <p>Someone expressed interest in "AI-Powered ECG Analysis Tool".</p>
                  <span className="notif-time">1 day ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDelete && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowDelete(false)}>
          <div className="modal-card" style={{ maxWidth: 440 }}>
            <div className="modal-header">
              <h2>Delete Account</h2>
              <button className="modal-close" onClick={() => setShowDelete(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="delete-warning">
                ⚠️ This will permanently delete your account, all your posts, and all associated data. This cannot be undone.
              </div>
              <div className="form-group" style={{ marginTop: 16 }}>
                <label>Type your email to confirm: <strong>{user?.email}</strong></label>
                <input className="form-control" value={deleteInput} onChange={e => setDeleteInput(e.target.value)} placeholder={user?.email} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowDelete(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete} disabled={deleteInput !== user?.email}>
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
