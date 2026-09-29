import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import { referralService } from '../../services/referralService';
import { useAuth } from '../../context/AuthContext';
import { Send, Users, Star, CheckCircle, MessageSquare } from 'lucide-react';

const AlumniDashboard = () => {
  const { user } = useAuth();
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    referralService.getAlumniReferrals()
      .then(res => {
        if (res.success) setReferrals(res.referrals);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const pendingCount = referrals.filter(r => r.status === 'Pending').length;

  return (
    <div className="app-container">
      <Navbar />

      <div className="dashboard-layout">
        <Sidebar />

        <main className="dashboard-content">
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a' }}>
              Alumni Workspace 👋
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '0.2rem' }}>
              Guide campus students, review referral requests, and share interview insights
            </p>
          </div>

          <div className="grid-cols-3" style={{ marginBottom: '2rem' }}>
            <div className="stat-card">
              <div>
                <div className="stat-val">{referrals.length}</div>
                <div className="stat-lbl">Total Referral Requests</div>
              </div>
              <div className="stat-icon"><Send size={24} /></div>
            </div>

            <div className="stat-card">
              <div>
                <div className="stat-val">{pendingCount}</div>
                <div className="stat-lbl">Pending Review</div>
              </div>
              <div className="stat-icon" style={{ backgroundColor: '#fffbeb', color: '#b45309' }}><Users size={24} /></div>
            </div>

            <div className="stat-card">
              <div>
                <div className="stat-val">Active</div>
                <div className="stat-lbl">Mentorship Status</div>
              </div>
              <div className="stat-icon" style={{ backgroundColor: '#ecfdf5', color: '#047857' }}><CheckCircle size={24} /></div>
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Recent Student Referral Requests</h3>
              <Link to="/alumni/referrals" style={{ fontSize: '0.85rem', fontWeight: 600 }}>View All Inbox</Link>
            </div>

            {loading ? (
              <p>Loading referral requests...</p>
            ) : referrals.length === 0 ? (
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>No referral requests received yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {referrals.slice(0, 5).map((ref) => (
                  <div key={ref._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div>
                      <strong style={{ fontSize: '0.95rem', display: 'block', color: '#0f172a' }}>{ref.student?.name || 'Student'} — {ref.jobTitle}</strong>
                      <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{ref.company}</span>
                    </div>
                    <span className={`badge ${ref.status === 'Accepted' ? 'badge-success' : ref.status === 'Rejected' ? 'badge-danger' : 'badge-warning'}`}>
                      {ref.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default AlumniDashboard;
