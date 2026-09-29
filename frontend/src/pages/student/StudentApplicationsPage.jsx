import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import { applicationService } from '../../services/applicationService';
import { FileText, Clock, Building, ExternalLink, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    applicationService.getStudentApplications()
      .then(res => {
        if (res.success) setApplications(res.applications);
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
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a' }}>My Applications</h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '0.2rem' }}>
              Track the progress of your submitted campus placement applications
            </p>
          </div>

          {loading ? (
            <div className="loader-overlay">
              <div className="loading-spinner"></div>
              <p>Fetching applications history...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="empty-state">
              <FileText className="empty-icon" />
              <h3>No applications submitted yet</h3>
              <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Browse active job postings to submit applications.</p>
              <Link to="/jobs" className="btn btn-primary" style={{ marginTop: '1rem' }}>Browse Jobs</Link>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Job Role & Company</th>
                    <th>Date Applied</th>
                    <th>Status</th>
                    <th>Recruiter Feedback / Notes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app._id}>
                      <td>
                        <strong style={{ display: 'block', color: '#0f172a' }}>{app.job ? app.job.title : 'Job Posting'}</strong>
                        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{app.job ? app.job.companyName : ''}</span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.85rem', color: '#475569' }}>
                          {new Date(app.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${
                          app.status === 'Selected' ? 'badge-success' :
                          app.status === 'Shortlisted' ? 'badge-info' :
                          app.status === 'Rejected' ? 'badge-danger' :
                          'badge-primary'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.85rem', color: '#475569' }}>
                          {app.recruiterNotes ? app.recruiterNotes : 'No updates yet'}
                        </span>
                      </td>
                      <td>
                        {app.job && (
                          <Link to={`/jobs/${app.job._id}`} className="btn btn-outline btn-sm">
                            View Job
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default StudentApplicationsPage;
