import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { meetingsApi } from '../../services';
import './MeetingRequestModal.css';

export default function MeetingRequestModal({ post, onClose, onSuccess }) {
  const { user } = useAuth();
  const [step, setStep]       = useState(1); // 1: message, 2: NDA, 3: slots
  const [message, setMessage] = useState('');
  const [ndaAccepted, setNda] = useState(false);
  const [slots, setSlots]     = useState(['', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleSlotChange = (i, val) => {
    const updated = [...slots];
    updated[i] = val;
    setSlots(updated);
  };

  const handleSubmit = async () => {
    if (!slots[0]) { setError('Please propose at least one time slot.'); return; }
    setError(''); setLoading(true);
    try {
      await meetingsApi.create({
        postId: post.id,
        postTitle: post.title,
        requesterId: user.id,
        requesterName: user.name,
        ownerId: post.userId,
        ownerName: post.authorName,
        message,
        ndaAccepted,
        proposedSlots: slots.filter(Boolean),
      });
      onSuccess();
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-card">
        <div className="modal-header">
          <h2>Request Meeting</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-steps">
          {[1,2,3].map(n => (
            <div key={n} className={`modal-step ${step === n ? 'active' : ''} ${step > n ? 'done' : ''}`}>
              <span className="step-num">{step > n ? '✓' : n}</span>
              <span>{n === 1 ? 'Message' : n === 2 ? 'NDA' : 'Time Slots'}</span>
            </div>
          ))}
        </div>

        <div className="modal-body">
          {error && <div className="form-error-banner">{error}</div>}

          {step === 1 && (
            <div>
              <p className="modal-subtitle">Introduce yourself and explain your interest in <strong>{post.title}</strong>.</p>
              <div className="form-group">
                <label>Message</label>
                <textarea className="form-control" rows={5} placeholder="I am interested in collaborating because..." value={message} onChange={e => setMessage(e.target.value)} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="nda-section">
              <div className="nda-box">
                <h4>Non-Disclosure Agreement</h4>
                <p>By proceeding, you agree that any information shared during or after this meeting is confidential and may not be disclosed to third parties without prior written consent. This platform facilitates first contact only. All intellectual property shared remains the property of the original owner.</p>
              </div>
              <label className="nda-check">
                <input type="checkbox" checked={ndaAccepted} onChange={e => setNda(e.target.checked)} />
                I have read and agree to the NDA terms above
              </label>
            </div>
          )}

          {step === 3 && (
            <div>
              <p className="modal-subtitle">Propose up to 2 available time slots. The post owner will confirm one.</p>
              {slots.map((slot, i) => (
                <div className="form-group" key={i}>
                  <label>Time Slot {i + 1} {i === 0 && <span className="required">*</span>}</label>
                  <input className="form-control" type="datetime-local" value={slot} onChange={e => handleSlotChange(i, e.target.value)} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          {step > 1 && <button className="btn btn-secondary" onClick={() => setStep(s => s - 1)}>Back</button>}
          {step < 3 && (
            <button className="btn btn-primary" onClick={() => {
              if (step === 2 && !ndaAccepted) { setError('You must accept the NDA to continue.'); return; }
              setError(''); setStep(s => s + 1);
            }}>Next</button>
          )}
          {step === 3 && (
            <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Sending...' : 'Send Meeting Request'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
