import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi, postsApi } from '../../services';
import { useToast } from '../../context/ToastContext';
import './AdminPanel.css';

const TABS = ['Users', 'Posts', 'Logs'];

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('Users');
  const [users, setUsers]         = useState([]);
  const [posts, setPosts]         = useState([]);
  const [logs, setLogs]           = useState([]);
  const [roleFilter, setRoleFilter]     = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [loading, setLoading]     = useState(true);
  const navigate = useNavigate();
  const toast    = useToast();

  useEffect(() => {
    Promise.all([
      adminApi.getUsers(),
      postsApi.getAll(),
      adminApi.getLogs(),
    ]).then(([u, p, l]) => {
      setUsers(u); setPosts(p); setLogs(l);
      setLoading(false);
    });
  }, []);

  const handleSuspend = async (id) => {
    if (!window.confirm('Suspend this user?')) return;
    try {
      await adminApi.suspendUser(id);
      setUsers(prev => prev.map(u => u.id === id ? { ...u, suspended: true } : u));
      toast.success('User suspended.');
    } catch (err) { toast.error(err.message); }
  };

  const handleRemovePost = async (id) => {
    if (!window.confirm('Remove this post?')) return;
    try {
      await postsApi.delete(id);
      setPosts(prev => prev.filter(p => p.id !== id));
      toast.success('Post removed.');
    } catch (err) { toast.error(err.message); }
  };

  const filteredUsers = roleFilter ? users.filter(u => u.role === roleFilter) : users;
  const filteredLogs  = actionFilter ? logs.filter(l => l.action === actionFilter) : logs;

  if (loading) return <div className="page-container"><p>Loading admin panel...</p></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Admin Panel</h1>
        <div className="admin-stats">
          <span className="admin-stat">{users.length} Users</span>
          <span className="admin-stat">{posts.length} Posts</span>
          <span className="admin-stat">{logs.length} Log Entries</span>
        </div>
      </div>

      <div className="admin-tabs">
        {TABS.map(tab => (
          <button
            key={tab}
            className={`admin-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >{tab}</button>
        ))}
      </div>

      {/* USERS TAB */}
      {activeTab === 'Users' && (
        <div className="admin-section">
          <div className="admin-toolbar">
            <select className="form-control" style={{width:160}} value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
              <option value="">All Roles</option>
              <option value="engineer">Engineer</option>
              <option value="healthcare">Healthcare</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <table className="admin-table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Role</th><th>Verified</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => (
                <tr key={u.id}>
                  <td><strong>{u.name}</strong></td>
                  <td>{u.email}</td>
                  <td><span className={`badge ${u.role === 'admin' ? 'badge-scheduled' : u.role === 'engineer' ? 'badge-active' : 'badge-draft'}`}>{u.role}</span></td>
                  <td>{u.verified ? '✅' : '❌'}</td>
                  <td>{u.suspended ? <span className="badge badge-closed">Suspended</span> : <span className="badge badge-active">Active</span>}</td>
                  <td>
                    {u.role !== 'admin' && !u.suspended && (
                      <button className="btn btn-danger btn-sm" onClick={() => handleSuspend(u.id)}>Suspend</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* POSTS TAB */}
      {activeTab === 'Posts' && (
        <div className="admin-section">
          <table className="admin-table">
            <thead>
              <tr><th>Title</th><th>Author</th><th>Domain</th><th>Status</th><th>City</th><th>Action</th></tr>
            </thead>
            <tbody>
              {posts.map(p => (
                <tr key={p.id}>
                  <td><strong>{p.title}</strong></td>
                  <td>{p.authorName}</td>
                  <td>{p.domain}</td>
                  <td><span className={`badge badge-${p.status}`}>{p.status}</span></td>
                  <td>{p.city}</td>
                  <td>
                    <div style={{display:'flex', gap:6}}>
                      <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/posts/${p.id}`)}>View</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleRemovePost(p.id)}>Remove</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* LOGS TAB */}
      {activeTab === 'Logs' && (
        <div className="admin-section">
          <div className="admin-toolbar">
            <select className="form-control" style={{width:200}} value={actionFilter} onChange={e => setActionFilter(e.target.value)}>
              <option value="">All Actions</option>
              <option value="login">Login</option>
              <option value="post_create">Post Create</option>
              <option value="meeting_request">Meeting Request</option>
              <option value="post_remove">Post Remove</option>
            </select>
            <button className="btn btn-secondary btn-sm" onClick={() => adminApi.exportLogsCSV(filteredLogs)}>
              Export CSV
            </button>
          </div>
          <table className="admin-table">
            <thead>
              <tr><th>Timestamp</th><th>User</th><th>Role</th><th>Action</th><th>Target</th><th>Result</th></tr>
            </thead>
            <tbody>
              {filteredLogs.map(l => (
                <tr key={l.id}>
                  <td className="log-timestamp">{l.timestamp}</td>
                  <td>{l.userName}</td>
                  <td>{l.role}</td>
                  <td><code className="log-action">{l.action}</code></td>
                  <td>{l.target}</td>
                  <td><span className={`badge ${l.result === 'success' ? 'badge-active' : 'badge-closed'}`}>{l.result}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
