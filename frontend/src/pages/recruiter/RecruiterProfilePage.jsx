import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import { profileService } from '../../services/profileService';
import { useAuth } from '../../context/AuthContext';
import { Building, Save, CheckCircle, AlertCircle } from 'lucide-react';

const RecruiterProfilePage = () => {
  const { user, profile, refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user ? user.name : '',
    companyName: '',
    designation: '',
    phone: '',
    linkedinUrl: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (profile) {
      setFormData({
        name: user ? user.name : '',
        companyName: profile.companyName || '',
        designation: profile.designation || '',
        phone: profile.phone || '',
        linkedinUrl: profile.linkedinUrl || ''
      });
    }
  }, [profile, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    try {
      const res = await profileService.updateRecruiterProfile(formData);
      if (res.success) {
        setSuccess('Recruiter profile updated!');
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
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a' }}>Recruiter & Company Info</h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '0.2rem' }}>
              Update company profile branding for campus placement visibility
            </p>
          </div>

          {success && (
            <div style={{ backgroundColor: '#ecfdf5', color: '#047857', padding: '0.85rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={18} /> {success}
            </div>
          )}

          <div className="card" style={{ maxWidth: '700px' }}>
            <form onSubmit={handleSubmit}>
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
                <label className="form-label">Hiring Company Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Designation / Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Lead Campus Recruiter"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Official Contact Phone</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
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

export default RecruiterProfilePage;
