import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import { profileService } from '../../services/profileService';
import { useAuth } from '../../context/AuthContext';
import { User, Save, CheckCircle, AlertCircle, FileText, Code, GraduationCap } from 'lucide-react';

const StudentProfilePage = () => {
  const { user, profile, refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user ? user.name : '',
    phone: '',
    headline: '',
    bio: '',
    location: '',
    skills: '',
    resumeUrl: '',
    githubUrl: '',
    linkedinUrl: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (profile) {
      setFormData({
        name: user ? user.name : '',
        phone: profile.phone || '',
        headline: profile.headline || '',
        bio: profile.bio || '',
        location: profile.location || '',
        skills: profile.skills ? profile.skills.join(', ') : '',
        resumeUrl: profile.resumeUrl || '',
        githubUrl: profile.githubUrl || '',
        linkedinUrl: profile.linkedinUrl || ''
      });
    }
  }, [profile, user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    try {
      const formattedSkills = formData.skills
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const res = await profileService.updateStudentProfile({
        ...formData,
        skills: formattedSkills
      });

      if (res.success) {
        setSuccess('Profile updated successfully!');
        await refreshUser();
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile');
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
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a' }}>My Professional Profile</h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '0.2rem' }}>
              Keep your contact, skills, and resume updated for recruiter evaluation
            </p>
          </div>

          {success && (
            <div style={{ backgroundColor: '#ecfdf5', color: '#047857', padding: '0.85rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={18} /> {success}
            </div>
          )}

          {error && (
            <div style={{ backgroundColor: '#fef2f2', color: '#b91c1c', padding: '0.85rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <div className="card" style={{ maxWidth: '800px' }}>
            <form onSubmit={handleSubmit}>
              <div className="grid-cols-2">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    className="form-input"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Professional Headline</label>
                <input
                  type="text"
                  name="headline"
                  className="form-input"
                  placeholder="e.g. Final Year CS Student | MERN Stack Developer"
                  value={formData.headline}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Skills (Comma-separated)</label>
                <input
                  type="text"
                  name="skills"
                  className="form-input"
                  placeholder="JavaScript, React, Node.js, MongoDB, Data Structures"
                  value={formData.skills}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Resume Document URL (PDF/Google Drive/Cloud Link)</label>
                <input
                  type="url"
                  name="resumeUrl"
                  className="form-input"
                  placeholder="https://example.com/my-resume.pdf"
                  value={formData.resumeUrl}
                  onChange={handleChange}
                />
              </div>

              <div className="grid-cols-2">
                <div className="form-group">
                  <label className="form-label">GitHub Profile URL</label>
                  <input
                    type="url"
                    name="githubUrl"
                    className="form-input"
                    placeholder="https://github.com/username"
                    value={formData.githubUrl}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    name="linkedinUrl"
                    className="form-input"
                    placeholder="https://linkedin.com/in/username"
                    value={formData.linkedinUrl}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Bio & Personal Summary</label>
                <textarea
                  name="bio"
                  className="form-textarea"
                  placeholder="Brief summary of your academic background and project interests..."
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <span className="loading-spinner" style={{ width: '16px', height: '16px' }}></span> : <><Save size={16} /> Save Profile Changes</>}
              </button>
            </form>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default StudentProfilePage;
