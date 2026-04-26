import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { postsApi } from '../../services';
import './PostForm.css';

const DOMAINS    = ['Cardiology','Radiology','Emergency Medicine','Psychiatry','Geriatrics','Oncology','Neurology','Orthopedics','Dermatology','Other'];
const STAGES     = [{value:'idea',label:'Idea'},{value:'concept_validation',label:'Concept Validation'},{value:'prototype',label:'Prototype Developed'},{value:'pilot_testing',label:'Pilot Testing'},{value:'pre_deployment',label:'Pre-Deployment'}];
const COMMITMENT = ['Full-time','Part-time (10h/week)','Part-time (5h/week)','Advisor (2h/week)'];
const COLLAB     = ['Research Partner','Co-Founder','Advisor','Contractor'];

const EMPTY = { title:'', domain:'', description:'', expertiseRequired:'', city:'', country:'', projectStage:'', commitmentLevel:'', collaborationType:'', confidentiality:'Public pitch — details in meeting', expiryDate:'', status:'draft' };

export default function PostCreatePage() {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]       = useState(EMPTY);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (status) => {
    if (!form.title || !form.domain || !form.description || !form.expertiseRequired || !form.city) {
      setError('Please fill in all required fields (marked with *).'); return;
    }
    setError(''); setLoading(true);
    try {
      const post = await postsApi.create({ ...form, status, userId: user.id, authorName: user.name, role: user.role });
      navigate(`/posts/${post.id}`);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="page-container">
      <div className="page-header"><h1 className="page-title">Create New Post</h1></div>
      {error && <div className="form-error-banner">{error}</div>}
      <div className="post-form-card">

        <div className="form-section">
          <h3 className="form-section-title">Basic Information</h3>
          <div className="form-group">
            <label>Post Title <span className="required">*</span></label>
            <input className="form-control" name="title" placeholder="e.g. AI-Powered ECG Analysis Tool" value={form.title} onChange={handleChange} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Domain <span className="required">*</span></label>
              <select className="form-control" name="domain" value={form.domain} onChange={handleChange}>
                <option value="">Select domain...</option>
                {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Expertise Required <span className="required">*</span></label>
              <input className="form-control" name="expertiseRequired" placeholder="e.g. Cardiology / Clinical Validation" value={form.expertiseRequired} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label>Description <span className="required">*</span></label>
            <textarea className="form-control" name="description" rows={4} placeholder="Describe your project without revealing sensitive IP..." value={form.description} onChange={handleChange} />
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">Project Details</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Project Stage</label>
              <select className="form-control" name="projectStage" value={form.projectStage} onChange={handleChange}>
                <option value="">Select stage...</option>
                {STAGES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Commitment Level</label>
              <select className="form-control" name="commitmentLevel" value={form.commitmentLevel} onChange={handleChange}>
                <option value="">Select commitment...</option>
                {COMMITMENT.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Collaboration Type</label>
              <select className="form-control" name="collaborationType" value={form.collaborationType} onChange={handleChange}>
                <option value="">Select type...</option>
                {COLLAB.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Confidentiality</label>
              <select className="form-control" name="confidentiality" value={form.confidentiality} onChange={handleChange}>
                <option value="Public pitch — details in meeting">Public pitch — details in meeting</option>
                <option value="Details discussed in meeting only">Details discussed in meeting only</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>City <span className="required">*</span></label>
              <input className="form-control" name="city" placeholder="Istanbul" value={form.city} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Country</label>
              <input className="form-control" name="country" placeholder="Turkey" value={form.country} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Expiry Date</label>
              <input className="form-control" type="date" name="expiryDate" value={form.expiryDate} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button className="btn btn-secondary btn-lg" onClick={() => navigate('/posts')} disabled={loading}>Cancel</button>
          <button className="btn btn-secondary btn-lg" onClick={() => handleSubmit('draft')} disabled={loading}>Save as Draft</button>
          <button className="btn btn-primary btn-lg"   onClick={() => handleSubmit('active')} disabled={loading}>{loading ? 'Publishing...' : 'Publish Post'}</button>
        </div>
      </div>
    </div>
  );
}
