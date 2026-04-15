import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../services/mockApi';
import './Auth.css';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep]     = useState(1); // 1: form, 2: verify
  const [form, setForm]     = useState({ name: '', email: '', password: '', confirm: '', role: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const selectRole   = (role) => setForm({ ...form, role });

  const validate = () => {
    if (!form.name.trim())       return 'Full name is required.';
    if (!form.email.endsWith('.edu')) return 'Only institutional .edu email addresses are allowed.';
    if (form.password.length < 8)    return 'Password must be at least 8 characters.';
    if (form.password !== form.confirm) return 'Passwords do not match.';
    if (!form.role)              return 'Please select a role.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    setLoading(true);
    try {
      await authApi.register(form);
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (step === 2) {
    return (
      <div className="auth-page">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <div className="auth-logo">⚕ HealthAI</div>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📧</div>
          <h2 style={{ marginBottom: 8 }}>Verify your email</h2>
          <p style={{ color: 'var(--gray-500)', fontSize: 14, marginBottom: 24 }}>
            We sent a verification link to <strong>{form.email}</strong>.<br />
            Click the link to activate your account.
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/login')}>
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">⚕ HealthAI</div>
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join the health-tech co-creation platform.</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input className="form-control" name="name" placeholder="Dr. Jane Smith" value={form.name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Institutional Email (.edu)</label>
            <input className="form-control" type="email" name="email" placeholder="you@university.edu" value={form.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Select Your Role</label>
            <div className="role-grid">
              <div className={`role-card ${form.role === 'engineer' ? 'selected' : ''}`} onClick={() => selectRole('engineer')}>
                <span className="role-card-icon">⚙️</span>
                <span className="role-card-label">Engineer</span>
              </div>
              <div className={`role-card ${form.role === 'healthcare' ? 'selected' : ''}`} onClick={() => selectRole('healthcare')}>
                <span className="role-card-icon">🏥</span>
                <span className="role-card-label">Healthcare Professional</span>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <input className="form-control" type="password" name="password" placeholder="Min. 8 characters" value={form.password} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input className="form-control" type="password" name="confirm" placeholder="Repeat password" value={form.confirm} onChange={handleChange} required />
          </div>

          <button className="btn btn-primary btn-lg auth-submit" type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
