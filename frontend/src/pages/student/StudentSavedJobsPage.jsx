import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import { jobService } from '../../services/jobService';
import { Bookmark, MapPin, DollarSign, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentSavedJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedJobs = async () => {
    setLoading(true);
    try {
      const res = await jobService.getSavedJobs();
      if (res.success) setJobs(res.jobs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const handleRemove = async (jobId) => {
    try {
      const res = await jobService.toggleSaveJob(jobId);
      if (res.success) fetchSavedJobs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="app-container">
      <Navbar />

      <div className="dashboard-layout">
        <Sidebar />

        <main className="dashboard-content">
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a' }}>Saved Job Postings</h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '0.2rem' }}>
              Bookmarked job listings saved for future application
            </p>
          </div>

          {loading ? (
            <div className="loader-overlay">
              <div className="loading-spinner"></div>
              <p>Loading saved jobs...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="empty-state">
              <Bookmark className="empty-icon" />
              <h3>No saved jobs found</h3>
              <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Click the "Save Job" button on job detail pages to add listings here.</p>
              <Link to="/jobs" className="btn btn-primary" style={{ marginTop: '1rem' }}>Browse Job Openings</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {jobs.map((job) => (
                <div key={job._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>{job.title}</h3>
                    <div style={{ display: 'flex', gap: '1rem', color: '#64748b', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                      <span style={{ fontWeight: 600, color: '#1e293b' }}>{job.companyName}</span>
                      <span><MapPin size={14} /> {job.location}</span>
                      <span><DollarSign size={14} /> {job.salary}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link to={`/jobs/${job._id}`} className="btn btn-primary btn-sm">
                      View & Apply
                    </Link>
                    <button onClick={() => handleRemove(job._id)} className="btn btn-danger btn-sm" title="Remove">
                      <Trash2 size={16} />
                    </button>
                  </div>
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

export default StudentSavedJobsPage;
