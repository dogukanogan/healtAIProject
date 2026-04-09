import { Link } from 'react-router-dom';
import './PostCard.css';

const STATUS_LABELS = {
  draft:             'Draft',
  active:            'Active',
  meeting_scheduled: 'Meeting Scheduled',
  closed:            'Partner Found',
  expired:           'Expired',
};

export default function PostCard({ post }) {
  return (
    <div className="post-card">
      <div className="post-card-header">
        <span className={`badge badge-${post.status}`}>{STATUS_LABELS[post.status]}</span>
        <span className="post-card-domain">{post.domain}</span>
      </div>

      <h3 className="post-card-title">
        <Link to={`/posts/${post.id}`}>{post.title}</Link>
      </h3>

      <p className="post-card-desc">{post.description}</p>

      <div className="post-card-meta">
        <span>🎯 {post.expertiseRequired}</span>
        <span>📍 {post.city}, {post.country}</span>
        <span>🔬 {post.projectStage?.replace('_', ' ')}</span>
      </div>

      <div className="post-card-footer">
        <span className="post-card-author">
          {post.role === 'engineer' ? '⚙️' : '🏥'} {post.authorName}
        </span>
        <Link to={`/posts/${post.id}`} className="btn btn-secondary btn-sm">View Details</Link>
      </div>
    </div>
  );
}
