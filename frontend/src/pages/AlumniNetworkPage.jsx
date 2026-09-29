import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { profileService } from '../services/profileService';
import { referralService } from '../services/referralService';
import { useAuth } from '../context/AuthContext';
import { Users, Search, Building, GraduationCap, Send, CheckCircle, MessageSquare, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const AlumniNetworkPage = () => {
  const { user } = useAuth();
  const [alumniList, setAlumniList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [company, setCompany] = useState('');
  const [department, setDepartment] = useState('');

  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [targetCompany, setTargetCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [message, setMessage] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchAlumni = async () => {
    setLoading(true);
    try {
      const res = await profileService.getAlumniList({ search, company, department });
      if (res.success) setAlumniList(res.alumni);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumni();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAlumni();
  };

  const openReferralModal = (alumnus) => {
    setSelectedAlumni(alumnus);
    setTargetCompany(alumnus.currentCompany || '');
    setShowReferralModal(true);
  };

  const handleSendReferral = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    try {
      const res = await referralService.requestReferral({
        alumniId: selectedAlumni._id,
        company: targetCompany,
        jobTitle,
        message
      });
      if (res.success) {
        setSuccessMsg(`Referral request sent to ${selectedAlumni.user?.name || 'Alumnus'}!`);
        setShowReferralModal(false);
      }
    } catch (err) {
      alert(err.message || 'Failed to send referral request');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Navbar />

      <div style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '2.5rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
            Alumni Mentorship & Referral Network
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: '1.5rem' }}>
            Connect with campus alumni working at top tech firms, request referral endorsements, and receive guidance.
          </p>

          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 2, minWidth: '250px', position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Name, role, or company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <input
              type="text"
              className="form-input"
              style={{ flex: 1, minWidth: '180px' }}
              placeholder="Filter by Company (e.g. Amazon)"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />

            <button type="submit" className="btn btn-primary">
              Search Alumni
            </button>
          </form>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1.5rem', width: '100%', flex: 1 }}>
        {successMsg && (
          <div style={{ backgroundColor: '#ecfdf5', color: '#047857', padding: '1rem', borderRadius: '10px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={18} /> {successMsg}
          </div>
        )}

        {loading ? (
          <div className="loader-overlay">
            <div className="loading-spinner"></div>
            <p>Loading alumni directory...</p>
          </div>
        ) : alumniList.length === 0 ? (
          <div className="empty-state">
            <Users className="empty-icon" />
            <h3>No alumni found matching your criteria</h3>
          </div>
        ) : (
          <div className="grid-cols-3">
            {alumniList.map((alumnus) => (
              <div key={alumnus._id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1rem' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: '#eff6ff',
                      color: '#2563eb',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.1rem'
                    }}>
                      {alumnus.user ? alumnus.user.name.charAt(0) : 'A'}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>{alumnus.user ? alumnus.user.name : 'Verified Alumnus'}</h3>
                      <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>{alumnus.currentDesignation}</p>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.9rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.25rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Building size={16} color="#2563eb" /> <strong>{alumnus.currentCompany}</strong>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <GraduationCap size={16} /> Batch of {alumnus.graduationYear} ({alumnus.department})
                    </span>
                  </div>

                  {alumnus.bio && (
                    <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      "{alumnus.bio}"
                    </p>
                  )}

                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                    {alumnus.skills && alumnus.skills.slice(0, 4).map((skill, index) => (
                      <span key={index} className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                  {user && user.role === 'student' && (
                    <button onClick={() => openReferralModal(alumnus)} className="btn btn-primary btn-sm" style={{ flex: 1, gap: '0.35rem' }}>
                      <Send size={14} /> Request Referral
                    </button>
                  )}
                  {user && alumnus.user && (
                    <Link to={`/messages/${alumnus.user._id}`} className="btn btn-secondary btn-sm" style={{ padding: '0.4rem 0.6rem' }} title="Message">
                      <MessageSquare size={16} />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showReferralModal && selectedAlumni && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>Request Referral</h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Sending request to {selectedAlumni.user ? selectedAlumni.user.name : 'Alumnus'} ({selectedAlumni.currentCompany})
            </p>

            <form onSubmit={handleSendReferral}>
              <div className="form-group">
                <label className="form-label">Target Company</label>
                <input
                  type="text"
                  className="form-input"
                  value={targetCompany}
                  onChange={(e) => setTargetCompany(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Target Job Role / Requisition ID</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Software Engineer SDE-1 (Req #12345)"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Referral Message & Qualifications Pitch</label>
                <textarea
                  className="form-textarea"
                  placeholder="Introduce yourself, mention relevant projects, and explain why you're a strong fit..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" onClick={() => setShowReferralModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={modalLoading}>
                  {modalLoading ? <span className="loading-spinner" style={{ width: '16px', height: '16px' }}></span> : 'Send Request'}
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

export default AlumniNetworkPage;
