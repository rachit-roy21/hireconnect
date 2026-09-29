import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import { applicationService } from '../../services/applicationService';
import { referralService } from '../../services/referralService';
import { jobService } from '../../services/jobService';
import { aiService } from '../../services/aiService';
import { useAuth } from '../../context/AuthContext';
import { FileText, Bookmark, Send, Sparkles, Award, ArrowRight, CheckCircle2, Clock } from 'lucide-react';

const StudentDashboard = () => {
  const { user, profile } = useAuth();
  const [applicationsCount, setApplicationsCount] = useState(0);
  const [savedJobsCount, setSavedJobsCount] = useState(0);
  const [referralsCount, setReferralsCount] = useState(0);
  const [atsScore, setAtsScore] = useState(0);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [appsRes, savedRes, refRes, atsRes] = await Promise.all([
          applicationService.getStudentApplications(),
          jobService.getSavedJobs(),
          referralService.getStudentReferrals(),
          aiService.analyzeResume()
        ]);

        if (appsRes.success) {
          setApplicationsCount(appsRes.count);
          setRecentApplications(appsRes.applications.slice(0, 5));
        }
        if (savedRes.success) setSavedJobsCount(savedRes.jobs.length);
        if (refRes.success) setReferralsCount(refRes.count);
        if (atsRes.success) setAtsScore(atsRes.score);
      } catch (err) {
        console.error('Error fetching dashboard statistics:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <div className="app-container">
      <Navbar />

      <div className="dashboard-layout">
        <Sidebar />

        <main className="dashboard-content">
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a' }}>
              Welcome back, {user ? user.name : 'Student'}! 👋
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '0.2rem' }}>
              Campus Placement Portal & Career Progress Tracking
            </p>
          </div>

          <div className="grid-cols-4" style={{ marginBottom: '2rem' }}>
            <div className="stat-card">
              <div>
                <div className="stat-val">{applicationsCount}</div>
                <div className="stat-lbl">Submitted Applications</div>
              </div>
              <div className="stat-icon"><FileText size={24} /></div>
            </div>

            <div className="stat-card">
              <div>
                <div className="stat-val">{savedJobsCount}</div>
                <div className="stat-lbl">Saved Jobs</div>
              </div>
              <div className="stat-icon" style={{ backgroundColor: '#eef2ff', color: '#4f46e5' }}><Bookmark size={24} /></div>
            </div>

            <div className="stat-card">
              <div>
                <div className="stat-val">{referralsCount}</div>
                <div className="stat-lbl">Referral Requests</div>
              </div>
              <div className="stat-icon" style={{ backgroundColor: '#ecfdf5', color: '#047857' }}><Send size={24} /></div>
            </div>

            <div className="stat-card">
              <div>
                <div className="stat-val">{atsScore}%</div>
                <div className="stat-lbl">Resume ATS Score</div>
              </div>
              <div className="stat-icon" style={{ backgroundColor: '#fffbeb', color: '#b45309' }}><Sparkles size={24} /></div>
            </div>
          </div>

          <div className="grid-cols-2" style={{ marginBottom: '2rem' }}>
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Recent Job Applications</h3>
                <Link to="/student/applications" style={{ fontSize: '0.85rem', fontWeight: 600 }}>View All</Link>
              </div>

              {loading ? (
                <p>Loading application status...</p>
              ) : recentApplications.length === 0 ? (
                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>No job applications submitted yet. Browse active listings!</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {recentApplications.map((app) => (
                    <div key={app._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <div>
                        <strong style={{ fontSize: '0.95rem', display: 'block', color: '#0f172a' }}>{app.job ? app.job.title : 'Job Posting'}</strong>
                        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{app.job ? app.job.companyName : ''}</span>
                      </div>
                      <span className={`badge ${app.status === 'Shortlisted' || app.status === 'Selected' ? 'badge-success' : app.status === 'Rejected' ? 'badge-danger' : 'badge-primary'}`}>
                        {app.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="card" style={{ backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#2563eb' }}>
                <Sparkles size={20} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Smart Career Coaching</h3>
              </div>
              <p style={{ color: '#334155', fontSize: '0.95rem', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                Get instant skill roadmaps, resume feedback, and personalized job matching recommendations based on your technical profile.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <Link to="/student/ai-assistant" className="btn btn-primary btn-sm">
                  Launch AI Assistant
                </Link>
                <Link to="/student/recommendations" className="btn btn-outline btn-sm">
                  View Skill Match
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default StudentDashboard;
