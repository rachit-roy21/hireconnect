import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import { adminService } from '../../services/adminService';
import { Building, PlusCircle } from 'lucide-react';

const AdminCompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    industry: 'Technology',
    location: '',
    website: '',
    description: ''
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const res = await adminService.getCompanies();
      if (res.success) setCompanies(res.companies);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const res = await adminService.createCompany(formData);
      if (res.success) {
        setShowModal(false);
        fetchCompanies();
      }
    } catch (err) {
      alert(err.message || 'Failed to create company');
    } finally {
      setSubmitLoading(false);
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
              <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a' }}>Manage Partner Companies</h1>
              <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '0.2rem' }}>Create and verify campus recruitment corporate profiles</p>
            </div>
            <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ gap: '0.4rem' }}>
              <PlusCircle size={18} /> Add Verified Company
            </button>
          </div>

          {loading ? (
            <div className="loader-overlay">
              <div className="loading-spinner"></div>
              <p>Loading company profiles...</p>
            </div>
          ) : (
            <div className="grid-cols-3">
              {companies.map((c) => (
                <div key={c._id} className="card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div className="stat-icon"><Building size={20} /></div>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>{c.name}</h3>
                      <span className="badge badge-success">Verified Partner</span>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}>
                    Industry: {c.industry} | {c.location || 'Global'}
                  </p>
                  <p style={{ fontSize: '0.9rem', color: '#475569' }}>{c.description}</p>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem' }}>Add Corporate Partner</h2>

            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">Company Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Industry</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Headquarters Location</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Website URL</label>
                <input
                  type="url"
                  className="form-input"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Company Description</label>
                <textarea
                  className="form-textarea"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitLoading}>
                  {submitLoading ? <span className="loading-spinner" style={{ width: '16px', height: '16px' }}></span> : 'Save Company'}
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

export default AdminCompaniesPage;
