import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import { jobService } from '../../services/jobService';
import { Briefcase, Users, Trash2, Edit, PlusCircle, CheckCircle } from 'lucide-react';

const RecruiterJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await jobService.getRecruiterJobs();
      if (res.success) setJobs(res.jobs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job listing? All applications for this posting will be removed.')) return;
    try {
      const res = await jobService.deleteJob(jobId);
      if (res.success) fetchJobs();
    } catch (err) {
      alert(err.message || 'Failed to delete job');
    }
  };

  return (
    <div className="app-container">
      <Navbar />

      <div className="dashboard-layout">
        <Sidebar />

        <main className="dashboard-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a' }}>Manage Campus Listings</h1>
              <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '0.2rem' }}>Overview of your company job postings</p>
            </div>
            <Link to="/recruiter/post-job" className="btn btn-primary" style={{ gap: '0.4rem' }}>
              <PlusCircle size={18} /> Post New Job
            </Link>
          </div>

          {loading ? (
            <div className="loader-overlay">
              <div className="loading-spinner"></div>
              <p>Loading active listings...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="empty-state">
              <Briefcase className="empty-icon" />
              <h3>No jobs posted yet</h3>
              <Link to="/recruiter/post-job" className="btn btn-primary" style={{ marginTop: '1rem' }}>Create Job Listing</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {jobs.map((job) => (
                <div key={job._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>{job.title}</h3>
                      <span className={`badge ${job.status === 'Open' ? 'badge-success' : 'badge-danger'}`}>{job.status}</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>
                      Location: {job.location} | Posted on {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Link to={`/recruiter/jobs/${job._id}/applicants`} className="btn btn-primary btn-sm" style={{ gap: '0.35rem' }}>
                      <Users size={16} /> Applicants ({job.applicantsCount || 0})
                    </Link>
                    <button onClick={() => handleDelete(job._id)} className="btn btn-danger btn-sm" title="Delete Listing">
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

export default RecruiterJobsPage;
