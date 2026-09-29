import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { jobService } from '../services/jobService';
import { applicationService } from '../services/applicationService';
import { useAuth } from '../context/AuthContext';
import { MapPin, DollarSign, Clock, Building, Briefcase, Bookmark, CheckCircle, AlertCircle, ArrowLeft, Send } from 'lucide-react';

const JobDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);

  const [coverLetter, setCoverLetter] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [applyLoading, setApplyLoading] = useState(false);

  const [appliedSuccess, setAppliedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    jobService.getJobById(id)
      .then(res => {
        if (res.success) setJob(res.job);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    setApplyLoading(true);
    setErrorMessage('');

    try {
      const res = await applicationService.applyForJob({
        jobId: id,
        coverLetter,
        resume: resumeUrl
      });
      if (res.success) {
        setAppliedSuccess(true);
        setShowApplyModal(false);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to submit job application');
    } finally {
      setApplyLoading(false);
    }
  };

  const handleToggleSave = async () => {
    if (!user || user.role !== 'student') return;
    try {
      const res = await jobService.toggleSaveJob(id);
      if (res.success) {
        setIsSaved(res.saved);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="app-container">
        <Navbar />
        <div className="loader-overlay">
          <div className="loading-spinner"></div>
          <p>Loading job details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="app-container">
        <Navbar />
        <div className="empty-state" style={{ margin: '4rem auto', maxWidth: '600px' }}>
          <AlertCircle className="empty-icon" />
          <h2>Job listing not found</h2>
          <p>This posting may have expired or been removed by the recruiter.</p>
          <Link to="/jobs" className="btn btn-primary" style={{ marginTop: '1rem' }}>Back to Jobs</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navbar />

      <div style={{ maxWidth: '1000px', margin: '2.5rem auto', padding: '0 1.5rem', width: '100%', flex: 1 }}>
        <Link to="/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem', fontWeight: 500 }}>
          <ArrowLeft size={16} /> Back to Job Search
        </Link>

        {appliedSuccess && (
          <div style={{ backgroundColor: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '1rem', borderRadius: '10px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <CheckCircle size={20} />
            <div>
              <strong style={{ display: 'block' }}>Application Submitted Successfully!</strong>
              <span style={{ fontSize: '0.9rem' }}>You can track status updates in your Student Applications Dashboard.</span>
            </div>
          </div>
        )}

        <div className="card" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a' }}>{job.title}</h1>
                <span className="badge badge-primary">{job.employmentType}</span>
                <span className={`badge ${job.status === 'Open' ? 'badge-success' : 'badge-danger'}`}>{job.status}</span>
              </div>
              <h3 style={{ fontSize: '1.15rem', color: '#2563eb', fontWeight: 600 }}>{job.companyName}</h3>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {user && user.role === 'student' && (
                <>
                  <button onClick={handleToggleSave} className={`btn ${isSaved ? 'btn-primary' : 'btn-outline'}`}>
                    <Bookmark size={18} /> {isSaved ? 'Saved' : 'Save Job'}
                  </button>
                  <button onClick={() => setShowApplyModal(true)} className="btn btn-primary btn-lg" disabled={appliedSuccess || job.status !== 'Open'}>
                    {appliedSuccess ? 'Applied' : 'Apply Now'}
                  </button>
                </>
              )}
              {(!user) && (
                <Link to="/login" className="btn btn-primary btn-lg">Sign In to Apply</Link>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '12px', marginBottom: '2rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, display: 'block' }}>LOCATION</span>
              <strong style={{ color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                <MapPin size={16} /> {job.location}
              </strong>
            </div>

            <div>
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, display: 'block' }}>SALARY RANGE</span>
              <strong style={{ color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                <DollarSign size={16} /> {job.salary}
              </strong>
            </div>

            <div>
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, display: 'block' }}>EXPERIENCE REQUIRED</span>
              <strong style={{ color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                <Briefcase size={16} /> {job.experienceRequired}
              </strong>
            </div>

            <div>
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, display: 'block' }}>APPLICATION DEADLINE</span>
              <strong style={{ color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                <Clock size={16} /> {new Date(job.deadline).toLocaleDateString()}
              </strong>
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a' }}>Role Overview & Description</h3>
            <p style={{ color: '#334155', lineHeight: 1.7, whiteSpace: 'pre-line', fontSize: '0.95rem' }}>
              {job.description}
            </p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.75rem', color: '#0f172a' }}>Eligibility Criteria</h3>
            <div style={{ backgroundColor: '#f1f5f9', padding: '1rem', borderRadius: '8px', color: '#334155', fontWeight: 500 }}>
              {job.eligibility}
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.75rem', color: '#0f172a' }}>Required Skillset</h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {job.skills && job.skills.map((skill, index) => (
                <span key={index} className="badge badge-primary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showApplyModal && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>Apply for {job.title}</h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Submitting to {job.companyName}</p>

            {errorMessage && (
              <div style={{ backgroundColor: '#fef2f2', color: '#b91c1c', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem' }}>
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleApply}>
              <div className="form-group">
                <label className="form-label">Resume Link (PDF / Portfolio URL)</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://example.com/my-resume.pdf"
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Cover Letter / Note to Recruiter</label>
                <textarea
                  className="form-textarea"
                  placeholder="Why are you a great fit for this campus role?"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={4}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowApplyModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={applyLoading}>
                  {applyLoading ? <span className="loading-spinner" style={{ width: '18px', height: '18px' }}></span> : <><Send size={16} /> Submit Application</>}
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

export default JobDetailsPage;
