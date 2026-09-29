import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import { profileService } from '../../services/profileService';
import { useAuth } from '../../context/AuthContext';
import { Save, CheckCircle, AlertCircle } from 'lucide-react';

const AlumniProfilePage = () => {
  const { user, profile, refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user ? user.name : '',
    currentCompany: '',
    currentDesignation: '',
    graduationYear: 2023,
    department: 'Computer Science',
    industry: 'Technology',
    skills: '',
    bio: '',
    isAvailableForMentorship: true,
    isAvailableForReferrals: true
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (profile) {
      setFormData({
        name: user ? user.name : '',
        currentCompany: profile.currentCompany || '',
        currentDesignation: profile.currentDesignation || '',
        graduationYear: profile.graduationYear || 2023,
        department: profile.department || 'Computer Science',
        industry: profile.industry || 'Technology',
        skills: profile.skills ? profile.skills.join(', ') : '',
        bio: profile.bio || '',
        isAvailableForMentorship: profile.isAvailableForMentorship ?? true,
        isAvailableForReferrals: profile.isAvailableForReferrals ?? true
      });
    }
  }, [profile, user]);

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

      const res = await profileService.updateAlumniProfile({
        ...formData,
        skills: formattedSkills
      });

      if (res.success) {
        setSuccess('Alumni profile updated!');
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
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a' }}>Alumni Profile & Settings</h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '0.2rem' }}>
              Manage your company information, mentorship status, and referral availability
            </p>
          </div>

          {success && (
            <div style={{ backgroundColor: '#ecfdf5', color: '#047857', padding: '0.85rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={18} /> {success}
            </div>
          )}

          <div className="card" style={{ maxWidth: '750px' }}>
            <form onSubmit={handleSubmit}>
              <div className="grid-cols-2">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Current Company</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.currentCompany}
                    onChange={(e) => setFormData({ ...formData, currentCompany: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid-cols-2">
                <div className="form-group">
                  <label className="form-label">Current Designation</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Senior Software Engineer"
                    value={formData.currentDesignation}
                    onChange={(e) => setFormData({ ...formData, currentDesignation: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Graduation Year</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.graduationYear}
                    onChange={(e) => setFormData({ ...formData, graduationYear: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Department / Major</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Expertise Skills (Comma-separated)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Java, System Design, Distributed Systems"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Bio for Campus Juniors</label>
                <textarea
                  className="form-textarea"
                  placeholder="Share a short bio, work domain, or how you can assist students..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.isAvailableForReferrals}
                    onChange={(e) => setFormData({ ...formData, isAvailableForReferrals: e.target.checked })}
                  />
                  <span style={{ fontSize: '0.9rem', color: '#0f172a', fontWeight: 600 }}>Available to receive referral requests from students</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.isAvailableForMentorship}
                    onChange={(e) => setFormData({ ...formData, isAvailableForMentorship: e.target.checked })}
                  />
                  <span style={{ fontSize: '0.9rem', color: '#0f172a', fontWeight: 600 }}>Available for student mentorship & advice</span>
                </label>
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <span className="loading-spinner" style={{ width: '16px', height: '16px' }}></span> : <><Save size={16} /> Save Profile</>}
              </button>
            </form>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default AlumniProfilePage;
