import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { postsApi } from '../../services';
import PostCard from '../../components/common/PostCard';
import './Dashboard.css';

export default function DashboardPage() {
  const { user } = useAuth();
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    postsApi.getAll({ status: 'active' }).then((posts) => {
      setRecentPosts(posts.slice(0, 4));
      setLoading(false);
    });
  }, []);

  return (
    <div className="page-container">
      <div className="dashboard-hero">
        <div className="dashboard-hero-text">
          <h1>Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
          <p>Discover healthcare–engineering collaboration opportunities or share your own project.</p>
          <div className="dashboard-hero-actions">
            <Link to="/posts/new" className="btn btn-primary btn-lg">+ New Post</Link>
            <Link to="/posts"     className="btn btn-secondary btn-lg">Browse Posts</Link>
          </div>
        </div>
        <div className="dashboard-hero-stats">
          <div className="stat-card">
            <span className="stat-number">3</span>
            <span className="stat-label">Active Posts</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">1</span>
            <span className="stat-label">Meeting Scheduled</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">5</span>
            <span className="stat-label">Total Posts</span>
          </div>
        </div>
      </div>

      <div className={`role-banner role-banner-${user?.role}`}>
        <span className="role-banner-icon">
          {user?.role === 'engineer' ? '⚙️' : user?.role === 'healthcare' ? '🏥' : '🛡️'}
        </span>
        <div>
          <strong>{user?.role === 'engineer' ? 'Engineer' : user?.role === 'healthcare' ? 'Healthcare Professional' : 'Administrator'}</strong>
          <span> — {user?.email}</span>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="dashboard-section-header">
          <h2>Recent Active Posts</h2>
          <Link to="/posts" className="btn btn-secondary btn-sm">View All</Link>
        </div>
        {loading ? (
          <p className="loading-text">Loading posts...</p>
        ) : (
          <div className="posts-grid">
            {recentPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
