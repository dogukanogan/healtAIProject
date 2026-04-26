import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { postsApi } from '../../services';
import PostCard from '../../components/common/PostCard';
import FilterBar from '../../components/common/FilterBar';
import './PostList.css';

const EMPTY_FILTERS = { domain: '', city: '', expertise: '', stage: '', status: '' };

export default function PostListPage() {
  const [posts, setPosts]       = useState([]);
  const [filters, setFilters]   = useState(EMPTY_FILTERS);
  const [loading, setLoading]   = useState(true);

  const fetchPosts = async (f) => {
    setLoading(true);
    const data = await postsApi.getAll(f);
    setPosts(data);
    setLoading(false);
  };

  useEffect(() => { fetchPosts(filters); }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchPosts(newFilters);
  };

  const handleClear = () => {
    setFilters(EMPTY_FILTERS);
    fetchPosts(EMPTY_FILTERS);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Browse Posts</h1>
        <Link to="/posts/new" className="btn btn-primary">+ New Post</Link>
      </div>

      <FilterBar filters={filters} onChange={handleFilterChange} onClear={handleClear} />

      {loading ? (
        <p className="loading-text">Loading posts...</p>
      ) : posts.length === 0 ? (
        <div className="empty-state">
          <p>No posts match your filters.</p>
          <button className="btn btn-secondary" onClick={handleClear}>Clear Filters</button>
        </div>
      ) : (
        <>
          <p className="results-count">{posts.length} post{posts.length !== 1 ? 's' : ''} found</p>
          <div className="posts-grid">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
