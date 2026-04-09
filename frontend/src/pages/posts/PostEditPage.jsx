import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { postsApi } from '../../services/mockApi';
import './PostForm.css';

const DOMAINS    = ['Cardiology','Radiology','Emergency Medicine','Psychiatry','Geriatrics','Oncology','Neurology','Orthopedics','Dermatology','Other'];
const STAGES     = [{value:'idea',label:'Idea'},{value:'concept_validation',label:'Concept Validation'},{value:'prototype',label:'Prototype Developed'},{value:'pilot_testing',label:'Pilot Testing'},{value:'pre_deployment',label:'Pre-Deployment'}];
const COMMITMENT = ['Full-time','Part-time (10h/week)','Part-time (5h/week)','Advisor (2h/week)'];
const COLLAB     = ['Research Partner','Co-Founder','Advisor','Contractor'];

export default function PostEditPage() {
  const { id }   = useParams();
  const { user } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]       = useState(null);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    postsApi.getById(id).then(setForm).catch(() => navigate('/posts'));
  }, [id]);

  if (!form) return <div className="page-container"><p>Loading...</p></div>;
  if (form.userId !== user?.id) return <div className="page-container"><p>You can only edit your own posts.</p></div>;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    if (!form.title || !form.domain || !form.description || !form.expertiseRequired || !form.city) {
      setError('Please fill in all required fields.'); return;
    }
    setError(''); setLoading(true);
    try {
      await postsApi.update(id, form);
      navigate(`/posts/${id}`);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="page-container">
      <div className="page-header"><h1 className="page-title">Edit Post</h1></div>
      {error && <div className="form-error-banner">{error}</div>}
      <div className="post-form-card">
        <div className="form-section">
          <h3 className="form-section-title">Basic Information</h3>
          <div className="form-group">
            <label>Post Title <span className="required">*</span></label>
            <input className="form-control" name="title" value={form.title} onChange={handleChange} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Domain <span className="required">*</span></label>
              <select className="form-control" name="domain" value={form.domain} onChange={handleChange}>
                {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Expertise Required <span className="required">*</span></label>
              <input className="form-control" name="expertiseRequired" value={form.expertiseRequired} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label>Description <span className="required">*</span></label>
            <textarea className="form-control" name="description" rows={4} value={form.description} onChange={handleChange} />
          </div>
        </div>
        <div className="form-section">
          <h3 className="form-section-title">Project Details</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Project Stage</label>
              <select className="form-control" name="projectStage" value={form.projectStage} onChange={handleChange}>
                {STAGES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Commitment Level</label>
              <select className="form-control" name="commitmentLevel" value={form.commitmentLevel} onChange={handleChange}>
                {COMMITMENT.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>City <span className="required">*</span></label>
              <input className="form-control" name="city" value={form.city} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Country</label>
              <input className="form-control" name="country" value={form.country} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Expiry Date</label>
              <input className="form-control" type="date" name="expiryDate" value={form.expiryDate} onChange={handleChange} />
            </div>
          </div>
        </div>
        <div className="form-actions">
          <button className="btn btn-secondary btn-lg" onClick={() => navigate(`/posts/${id}`)} disabled={loading}>Cancel</button>
          <button className="btn btn-primary btn-lg" onClick={handleSave} disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
        </div>
      </div>
    </div>
  );
}
