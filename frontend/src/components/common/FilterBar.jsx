import './FilterBar.css';

const DOMAINS = ['', 'Cardiology', 'Radiology', 'Emergency Medicine', 'Psychiatry', 'Geriatrics', 'Oncology', 'Neurology'];
const STAGES  = ['', 'idea', 'concept_validation', 'prototype', 'pilot_testing', 'pre_deployment'];
const STATUSES = ['', 'active', 'draft', 'meeting_scheduled', 'closed', 'expired'];

const STAGE_LABELS = {
  idea: 'Idea', concept_validation: 'Concept Validation',
  prototype: 'Prototype', pilot_testing: 'Pilot Testing', pre_deployment: 'Pre-Deployment',
};

export default function FilterBar({ filters, onChange, onClear }) {
  const handleChange = (e) => onChange({ ...filters, [e.target.name]: e.target.value });

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label>Domain</label>
        <select className="form-control" name="domain" value={filters.domain || ''} onChange={handleChange}>
          {DOMAINS.map((d) => <option key={d} value={d}>{d || 'All Domains'}</option>)}
        </select>
      </div>

      <div className="filter-group">
        <label>City</label>
        <input
          className="form-control"
          name="city"
          placeholder="Any city..."
          value={filters.city || ''}
          onChange={handleChange}
        />
      </div>

      <div className="filter-group">
        <label>Expertise</label>
        <input
          className="form-control"
          name="expertise"
          placeholder="e.g. Cardiology"
          value={filters.expertise || ''}
          onChange={handleChange}
        />
      </div>

      <div className="filter-group">
        <label>Project Stage</label>
        <select className="form-control" name="stage" value={filters.stage || ''} onChange={handleChange}>
          {STAGES.map((s) => <option key={s} value={s}>{s ? STAGE_LABELS[s] : 'All Stages'}</option>)}
        </select>
      </div>

      <div className="filter-group">
        <label>Status</label>
        <select className="form-control" name="status" value={filters.status || ''} onChange={handleChange}>
          {STATUSES.map((s) => <option key={s} value={s}>{s ? s.replace('_', ' ') : 'All Statuses'}</option>)}
        </select>
      </div>

      <button className="btn btn-secondary btn-sm filter-clear" onClick={onClear}>
        Clear Filters
      </button>
    </div>
  );
}
