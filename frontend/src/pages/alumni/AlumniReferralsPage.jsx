import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import { referralService } from '../../services/referralService';
import { Send, CheckCircle, XCircle, FileText, ExternalLink, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const AlumniReferralsPage = () => {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeRef, setActiveRef] = useState(null);
  const [responseNote, setResponseNote] = useState('');
  const [actionType, setActionType] = useState('');
  const [modalLoading, setModalLoading] = useState(false);

  const fetchReferrals = async () => {
    setLoading(true);
    try {
      const res = await referralService.getAlumniReferrals();
      if (res.success) setReferrals(res.referrals);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, []);

  const openActionModal = (refItem, type) => {
    setActiveRef(refItem);
    setActionType(type);
    setResponseNote(type === 'Accepted' ? 'Happy to refer! Your resume has been submitted to our internal portal.' : 'Sorry, not accepting referrals for this specific team right now.');
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    try {
      const res = await referralService.updateStatus(activeRef._id, {
        status: actionType,
        responseNote
      });
      if (res.success) {
        setActiveRef(null);
        fetchReferrals();
      }
    } catch (err) {
      alert(err.message || 'Failed to update referral');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Navbar />

      <div className="dashboard-layout">
        <Sidebar />

        <main className="dashboard-content">
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a' }}>Referral Requests Inbox</h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '0.2rem' }}>
              Review referral requests submitted by students from your alma mater
            </p>
          </div>

          {loading ? (
            <div className="loader-overlay">
              <div className="loading-spinner"></div>
              <p>Loading referral requests...</p>
            </div>
          ) : referrals.length === 0 ? (
            <div className="empty-state">
              <Send className="empty-icon" />
              <h3>No referral requests in inbox</h3>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {referrals.map((ref) => (
                <div key={ref._id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>{ref.student?.name || 'Student Candidate'} — {ref.jobTitle}</h3>
                      <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem' }}>
                        Target Company: <strong>{ref.company}</strong> | Date: {new Date(ref.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <span className={`badge ${
                      ref.status === 'Accepted' || ref.status === 'Completed' ? 'badge-success' :
                      ref.status === 'Rejected' ? 'badge-danger' :
                      'badge-warning'
                    }`}>
                      {ref.status}
                    </span>
                  </div>

                  <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem', color: '#334155' }}>
                    <strong>Student Pitch:</strong> "{ref.message}"
                  </div>

                  {ref.studentProfile && (
                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>
                      <strong>Skills:</strong> {ref.studentProfile.skills ? ref.studentProfile.skills.join(', ') : 'Not listed'}
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', borderTop: '1px solid #e2e8f0', paddingTop: '0.85rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {(ref.resumeUrl || (ref.studentProfile && ref.studentProfile.resumeUrl)) && (
                        <a href={ref.resumeUrl || ref.studentProfile.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm" style={{ gap: '0.35rem' }}>
                          <FileText size={14} /> View Student Resume <ExternalLink size={12} />
                        </a>
                      )}
                      {ref.student && (
                        <Link to={`/messages/${ref.student._id}`} className="btn btn-secondary btn-sm" style={{ gap: '0.35rem' }}>
                          <MessageSquare size={14} /> Chat with Student
                        </Link>
                      )}
                    </div>

                    {ref.status === 'Pending' && (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => openActionModal(ref, 'Accepted')} className="btn btn-primary btn-sm" style={{ gap: '0.35rem' }}>
                          <CheckCircle size={14} /> Accept Referral
                        </button>
                        <button onClick={() => openActionModal(ref, 'Rejected')} className="btn btn-danger btn-sm" style={{ gap: '0.35rem' }}>
                          <XCircle size={14} /> Decline
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {activeRef && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              {actionType === 'Accepted' ? 'Accept Referral Request' : 'Decline Referral Request'}
            </h2>

            <form onSubmit={handleUpdateStatus}>
              <div className="form-group">
                <label className="form-label">Response Note to Student</label>
                <textarea
                  className="form-textarea"
                  value={responseNote}
                  onChange={(e) => setResponseNote(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setActiveRef(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className={`btn ${actionType === 'Accepted' ? 'btn-primary' : 'btn-danger'}`} disabled={modalLoading}>
                  {modalLoading ? <span className="loading-spinner" style={{ width: '16px', height: '16px' }}></span> : `Confirm ${actionType}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AlumniReferralsPage;
