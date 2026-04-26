import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import './Auth.css';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const toast     = useToast();

  const [form, setForm]       = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">⚕ HealthAI</div>
        <h1 className="auth-title">Sign In</h1>
        <p className="auth-subtitle">Welcome back. Sign in to your account.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Institutional Email</label>
            <input
              className="form-control"
              type="email"
              name="email"
              placeholder="you@university.edu"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              className="form-control"
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <button className="btn btn-primary btn-lg auth-submit" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </p>

        <div className="auth-demo-hint">
          <strong>Demo accounts:</strong><br />
          dogukan@university.edu (engineer)<br />
          ayse@hospital.edu (healthcare)<br />
          admin@healthai.edu (admin)
        </div>
      </div>
    </div>
  );
}
