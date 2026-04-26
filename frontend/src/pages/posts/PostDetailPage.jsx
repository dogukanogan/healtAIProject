import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { postsApi } from '../../services';
import MeetingRequestModal from '../meetings/MeetingRequestModal';
import './PostDetail.css';

const STATUS_LABELS = { draft:'Draft', active:'Active', meeting_scheduled:'Meeting Scheduled', closed:'Partner Found', expired:'Expired' };
const STAGE_LABELS  = { idea:'Idea', concept_validation:'Concept Validation', prototype:'Prototype Developed', pilot_testing:'Pilot Testing', pre_deployment:'Pre-Deployment' };

export default function PostDetailPage() {
  const { id }    = useParams();
  const { user }  = useAuth();
  const navigate  = useNavigate();
  const [post, setPost]         = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    postsApi.getById(id)
      .then(setPost)
      .catch(() => navigate('/posts'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleStatusChange = async (status) => {
    const updated = await postsApi.changeStatus(id, status);
    setPost(updated);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to remove this post?')) return;
    await postsApi.delete(id);
    navigate('/posts');
  };

  if (loading) return <div className="page-container"><p>Loading...</p></div>;
  if (!post)   return <div className="page-container"><p>Post not found.</p></div>;

  const isOwner = user?.id === post.userId;
  const canRequest = !isOwner && post.status === 'active';

  return (
    <div className="page-container">
      <div className="post-detail-back">
        <Link to="/posts">← Back to Posts</Link>
      </div>

      <div className="post-detail-card">
        <div className="post-detail-header">
          <div>
            <div className="post-detail-meta-top">
              <span className={`badge badge-${post.status}`}>{STATUS_LABELS[post.status]}</span>
              <span className="post-detail-domain">{post.domain}</span>
            </div>
            <h1 className="post-detail-title">{post.title}</h1>
            <div className="post-detail-author">
              {post.role === 'engineer' ? '⚙️' : '🏥'} <strong>{post.authorName}</strong>
              <span className="dot">·</span>
              <span>{post.city}, {post.country}</span>
              <span className="dot">·</span>
              <span>Posted {post.createdAt}</span>
            </div>
          </div>

          {isOwner && (
            <div className="post-detail-owner-actions">
              <Link to={`/posts/${id}/edit`} className="btn btn-secondary btn-sm">Edit</Link>
              {post.status === 'draft'  && <button className="btn btn-primary btn-sm"  onClick={() => handleStatusChange('active')}>Publish</button>}
              {post.status === 'active' && <button className="btn btn-success btn-sm"  onClick={() => handleStatusChange('closed')}>Mark Partner Found</button>}
              <button className="btn btn-danger btn-sm" onClick={handleDelete}>Delete</button>
            </div>
          )}

          {canRequest && (
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              Express Interest / Request Meeting
            </button>
          )}
        </div>

        <div className="post-detail-body">
          <div className="post-detail-section">
            <h3>Description</h3>
            <p>{post.description}</p>
          </div>

          <div className="post-detail-grid">
            <div className="post-detail-info-card">
              <span className="info-label">Expertise Required</span>
              <span className="info-value">🎯 {post.expertiseRequired}</span>
            </div>
            <div className="post-detail-info-card">
              <span className="info-label">Project Stage</span>
              <span className="info-value">🔬 {STAGE_LABELS[post.projectStage] || post.projectStage}</span>
            </div>
            <div className="post-detail-info-card">
              <span className="info-label">Commitment</span>
              <span className="info-value">⏱ {post.commitmentLevel}</span>
            </div>
            <div className="post-detail-info-card">
              <span className="info-label">Collaboration Type</span>
              <span className="info-value">🤝 {post.collaborationType}</span>
            </div>
            <div className="post-detail-info-card">
              <span className="info-label">Confidentiality</span>
              <span className="info-value">🔒 {post.confidentiality}</span>
            </div>
            <div className="post-detail-info-card">
              <span className="info-label">Expires</span>
              <span className="info-value">📅 {post.expiryDate || '—'}</span>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <MeetingRequestModal
          post={post}
          onClose={() => setShowModal(false)}
          onSuccess={() => { setShowModal(false); handleStatusChange('meeting_scheduled'); }}
        />
      )}
    </div>
  );
}
