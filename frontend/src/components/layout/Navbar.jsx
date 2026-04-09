import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname.startsWith(path) ? 'nav-link active' : 'nav-link';

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/dashboard" className="navbar-brand">
          <span className="brand-icon">⚕</span>
          <span>HealthAI</span>
        </Link>

        {user && (
          <div className="navbar-links">
            <Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>
            <Link to="/posts"     className={isActive('/posts')}>Posts</Link>
            <Link to="/meetings"  className={isActive('/meetings')}>Meetings</Link>
            {isAdmin && <Link to="/admin" className={isActive('/admin')}>Admin</Link>}
          </div>
        )}

        {user && (
          <div className="navbar-user">
            <Link to="/profile" className="navbar-avatar" title={user.name}>
              {user.name.charAt(0).toUpperCase()}
            </Link>
            <span className="navbar-username">{user.name}</span>
            <button className="btn btn-secondary btn-sm" onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
}
