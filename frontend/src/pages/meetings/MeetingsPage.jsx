import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { meetingsApi } from '../../services/mockApi';
import './Meetings.css';

const STATUS_COLORS = { pending:'badge-draft', accepted:'badge-active', declined:'badge-closed', scheduled:'badge-scheduled', completed:'badge-active', cancelled:'badge-closed' };

export default function MeetingsPage() {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    meetingsApi.getAll().then(data => {
      setMeetings(data.filter(m => m.requesterId === user?.id || m.ownerId === user?.id));
      setLoading(false);
    });
  }, [user]);

  const handleRespond = async (id, action) => {
    const updated = await meetingsApi.respond(id, action);
    setMeetings(prev => prev.map(m => m.id === updated.id ? updated : m));
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Meetings</h1>
      </div>

      {loading ? <p>Loading...</p> : meetings.length === 0 ? (
        <div className="meetings-empty">
          <p>No meeting requests yet.</p>
          <p>Browse posts and click "Express Interest" to initiate a meeting.</p>
        </div>
      ) : (
        <div className="meetings-list">
          {meetings.map(m => (
            <div key={m.id} className="meeting-card">
              <div className="meeting-card-header">
                <div>
                  <h3 className="meeting-post-title">{m.postTitle}</h3>
                  <p className="meeting-parties">
                    <strong>{m.requesterName}</strong> → <strong>{m.ownerName}</strong>
                  </p>
                </div>
                <span className={`badge ${STATUS_COLORS[m.status] || 'badge-draft'}`}>{m.status}</span>
              </div>

              {m.message && (
                <div className="meeting-message">
                  <p>"{m.message}"</p>
                </div>
              )}

              <div className="meeting-slots">
                <span className="slots-label">Proposed slots:</span>
                {m.proposedSlots?.map((slot, i) => <span key={i} className="slot-tag">{slot}</span>)}
              </div>

              {m.confirmedSlot && (
                <div className="meeting-confirmed">
                  ✅ Confirmed: <strong>{m.confirmedSlot}</strong>
                </div>
              )}

              {m.ownerId === user?.id && m.status === 'pending' && (
                <div className="meeting-actions">
                  <button className="btn btn-success btn-sm" onClick={() => handleRespond(m.id, 'accepted')}>Accept</button>
                  <button className="btn btn-danger btn-sm"  onClick={() => handleRespond(m.id, 'declined')}>Decline</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
