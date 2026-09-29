import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import { referralService } from '../../services/referralService';
import { Send, Clock, Building, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentReferralsPage = () => {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    referralService.getStudentReferrals()
      .then(res => {
        if (res.success) setReferrals(res.referrals);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="app-container">
      <Navbar />

      <div className="dashboard-layout">
        <Sidebar />

        <main className="dashboard-content">
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a' }}>My Referral Requests</h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '0.2rem' }}>
              Track referral endorsements requested from verified campus alumni
            </p>
          </div>

          {loading ? (
            <div className="loader-overlay">
              <div className="loading-spinner"></div>
              <p>Fetching referral status...</p>
            </div>
          ) : referrals.length === 0 ? (
            <div className="empty-state">
              <Send className="empty-icon" />
              <h3>No referral requests sent yet</h3>
              <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Find alumni working at your target companies and request endorsements.</p>
              <Link to="/alumni-network" className="btn btn-primary" style={{ marginTop: '1rem' }}>Browse Alumni Network</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {referrals.map((ref) => (
                <div key={ref._id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>{ref.company} — {ref.jobTitle}</h3>
                      <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem' }}>
                        Requested from <strong>{ref.alumni?.name || 'Alumnus'}</strong>
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

                  <p style={{ fontSize: '0.9rem', color: '#475569', backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '8px', marginBottom: '0.75rem' }}>
                    "{ref.message}"
                  </p>

                  {ref.responseNote && (
                    <div style={{ color: '#0369a1', backgroundColor: '#e0f2fe', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem' }}>
                      <strong>Alumni Note:</strong> {ref.responseNote}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default StudentReferralsPage;
