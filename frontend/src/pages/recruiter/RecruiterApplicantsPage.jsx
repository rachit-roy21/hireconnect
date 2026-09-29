import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import { applicationService } from '../../services/applicationService';
import { Users, FileText, CheckCircle, ArrowLeft, ExternalLink, MessageSquare } from 'lucide-react';

const RecruiterApplicantsPage = () => {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const res = await applicationService.getJobApplicants(jobId);
      if (res.success) setApplications(res.applications);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  const handleStatusChange = async (appId, newStatus) => {
    setUpdatingId(appId);
    try {
      const res = await applicationService.updateStatus(appId, { status: newStatus });
      if (res.success) fetchApplicants();
    } catch (err) {
      alert(err.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="app-container">
      <Navbar />

      <div className="dashboard-layout">
        <Sidebar />

        <main className="dashboard-content">
          <Link to="/recruiter/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            <ArrowLeft size={16} /> Back to Job Listings
          </Link>

          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a' }}>Candidate Applications</h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '0.2rem' }}>
              Review student profiles, inspect resumes, and manage recruitment pipeline stages
            </p>
          </div>

          {loading ? (
            <div className="loader-overlay">
              <div className="loading-spinner"></div>
              <p>Loading candidate applications...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="empty-state">
              <Users className="empty-icon" />
              <h3>No candidates have applied for this posting yet</h3>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {applications.map((app) => (
                <div key={app._id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#eff6ff', color: '#2563eb', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {app.student?.name ? app.student.name.charAt(0) : 'S'}
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>{app.student?.name || 'Student Candidate'}</h3>
                        <p style={{ fontSize: '0.85rem', color: '#64748b' }}>{app.student?.email}</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <select
                        className="form-select"
                        style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.85rem', fontWeight: 600 }}
                        value={app.status}
                        onChange={(e) => handleStatusChange(app._id, e.target.value)}
                        disabled={updatingId === app._id}
                      >
                        <option value="Applied">Applied</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Interview">Interview Scheduled</option>
                        <option value="Selected">Selected / Hired</option>
                        <option value="Rejected">Rejected</option>
                      </select>

                      {app.student && (
                        <Link to={`/messages/${app.student._id}`} className="btn btn-outline btn-sm" style={{ padding: '0.4rem 0.6rem' }} title="Message Candidate">
                          <MessageSquare size={16} />
                        </Link>
                      )}
                    </div>
                  </div>

                  {app.studentProfile && (
                    <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Candidate Summary</h4>
                      <p style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: 600, marginBottom: '0.35rem' }}>
                        {app.studentProfile.headline || 'Student looking for placement opportunities'}
                      </p>

                      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                        {app.studentProfile.skills && app.studentProfile.skills.map((sk, i) => (
                          <span key={i} className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {app.coverLetter && (
                    <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#475569' }}>
                      <strong>Cover Note:</strong> "{app.coverLetter}"
                    </div>
                  )}

                  {(app.resume || (app.studentProfile && app.studentProfile.resumeUrl)) && (
                    <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem' }}>
                      <a
                        href={app.resume || app.studentProfile.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline btn-sm"
                        style={{ gap: '0.35rem' }}
                      >
                        <FileText size={14} /> Open Candidate Resume <ExternalLink size={12} />
                      </a>
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

export default RecruiterApplicantsPage;
