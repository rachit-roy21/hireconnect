import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import { jobService } from '../../services/jobService';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, Users, PlusCircle, CheckCircle, FileText } from 'lucide-react';

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    jobService.getRecruiterJobs()
      .then(res => {
        if (res.success) setJobs(res.jobs);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const totalApplicants = jobs.reduce((acc, job) => acc + (job.applicantsCount || 0), 0);
  const openJobs = jobs.filter(j => j.status === 'Open').length;

  return (
    <div className="app-container">
      <Navbar />

      <div className="dashboard-layout">
        <Sidebar />

        <main className="dashboard-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a' }}>Recruiter Portal</h1>
              <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '0.2rem' }}>Manage campus job postings and review student applicants</p>
            </div>
            <Link to="/recruiter/post-job" className="btn btn-primary" style={{ gap: '0.4rem' }}>
              <PlusCircle size={18} /> Post New Job
            </Link>
          </div>

          <div className="grid-cols-3" style={{ marginBottom: '2rem' }}>
            <div className="stat-card">
              <div>
                <div className="stat-val">{jobs.length}</div>
                <div className="stat-lbl">Total Job Postings</div>
              </div>
              <div className="stat-icon"><Briefcase size={24} /></div>
            </div>

            <div className="stat-card">
              <div>
                <div className="stat-val">{openJobs}</div>
                <div className="stat-lbl">Active Open Listings</div>
              </div>
              <div className="stat-icon" style={{ backgroundColor: '#ecfdf5', color: '#047857' }}><CheckCircle size={24} /></div>
            </div>

            <div className="stat-card">
              <div>
                <div className="stat-val">{totalApplicants}</div>
                <div className="stat-lbl">Candidate Applications</div>
              </div>
              <div className="stat-icon" style={{ backgroundColor: '#eef2ff', color: '#4f46e5' }}><Users size={24} /></div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem' }}>Active Campus Listings</h3>

            {loading ? (
              <p>Loading listings...</p>
            ) : jobs.length === 0 ? (
              <div className="empty-state">
                <Briefcase className="empty-icon" />
                <h3>No jobs posted yet</h3>
                <Link to="/recruiter/post-job" className="btn btn-primary" style={{ marginTop: '1rem' }}>Create Job Listing</Link>
              </div>
            ) : (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Job Title</th>
                      <th>Location</th>
                      <th>Applicants</th>
                      <th>Status</th>
                      <th>Deadline</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((job) => (
                      <tr key={job._id}>
                        <td><strong>{job.title}</strong></td>
                        <td>{job.location}</td>
                        <td><span className="badge badge-primary">{job.applicantsCount || 0} Candidates</span></td>
                        <td><span className={`badge ${job.status === 'Open' ? 'badge-success' : 'badge-danger'}`}>{job.status}</span></td>
                        <td>{new Date(job.deadline).toLocaleDateString()}</td>
                        <td>
                          <Link to={`/recruiter/jobs/${job._id}/applicants`} className="btn btn-outline btn-sm">
                            Review Applicants
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default RecruiterDashboard;
