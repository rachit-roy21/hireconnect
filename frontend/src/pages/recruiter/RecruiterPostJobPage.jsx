import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import { jobService } from '../../services/jobService';
import { useAuth } from '../../context/AuthContext';
import { PlusCircle, Save, CheckCircle, AlertCircle } from 'lucide-react';

const RecruiterPostJobPage = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    companyName: profile ? profile.companyName || 'HireConnect Partner' : 'HireConnect Partner',
    description: '',
    location: '',
    employmentType: 'Full-Time',
    experienceRequired: '0-1 years (New Grads)',
    salary: 'Not Disclosed',
    skills: '',
    eligibility: 'B.Tech / B.E. / M.Tech / MCA',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await jobService.createJob(formData);
      if (res.success) {
        navigate('/recruiter/jobs');
      }
    } catch (err) {
      setError(err.message || 'Failed to post job listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Navbar />

      <div className="dashboard-layout">
        <Sidebar />

        <main className="dashboard-content">
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a' }}>Post Campus Job Opportunity</h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '0.2rem' }}>
              Publish job listings for campus hiring and internship recruitment
            </p>
          </div>

          {error && (
            <div style={{ backgroundColor: '#fef2f2', color: '#b91c1c', padding: '0.85rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <div className="card" style={{ maxWidth: '800px' }}>
            <form onSubmit={handleSubmit}>
              <div className="grid-cols-2">
                <div className="form-group">
                  <label className="form-label">Job Role Title</label>
                  <input
                    type="text"
                    name="title"
                    className="form-input"
                    placeholder="e.g. Software Development Engineer"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    className="form-input"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid-cols-2">
                <div className="form-group">
                  <label className="form-label">Job Location</label>
                  <input
                    type="text"
                    name="location"
                    className="form-input"
                    placeholder="e.g. Mountain View, CA / Hybrid"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Employment Type</label>
                  <select
                    name="employmentType"
                    className="form-select"
                    value={formData.employmentType}
                    onChange={handleChange}
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Internship">Internship</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
              </div>

              <div className="grid-cols-2">
                <div className="form-group">
                  <label className="form-label">Salary Range</label>
                  <input
                    type="text"
                    name="salary"
                    className="form-input"
                    placeholder="e.g. $120,000 - $140,000"
                    value={formData.salary}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Application Deadline</label>
                  <input
                    type="date"
                    name="deadline"
                    className="form-input"
                    value={formData.deadline}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Required Skills (Comma-separated)</label>
                <input
                  type="text"
                  name="skills"
                  className="form-input"
                  placeholder="JavaScript, React, Node.js, Data Structures"
                  value={formData.skills}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Eligibility Criteria</label>
                <input
                  type="text"
                  name="eligibility"
                  className="form-input"
                  placeholder="e.g. B.Tech CS/IT 2026 Batch with 7.0+ CGPA"
                  value={formData.eligibility}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Job Description & Responsibilities</label>
                <textarea
                  name="description"
                  className="form-textarea"
                  placeholder="Describe key responsibilities, requirements, and tech stack details..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <span className="loading-spinner" style={{ width: '16px', height: '16px' }}></span> : <><PlusCircle size={16} /> Publish Job Posting</>}
              </button>
            </form>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default RecruiterPostJobPage;
