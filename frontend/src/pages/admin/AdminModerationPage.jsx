import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import { reviewService } from '../../services/reviewService';
import { interviewService } from '../../services/interviewService';
import { adminService } from '../../services/adminService';
import { CheckCircle, XCircle, Shield, Trash2 } from 'lucide-react';

const AdminModerationPage = () => {
  const [reviews, setReviews] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const [revRes, intRes] = await Promise.all([
        reviewService.getReviews(),
        interviewService.getExperiences()
      ]);
      if (revRes.success) setReviews(revRes.reviews);
      if (intRes.success) setInterviews(intRes.experiences);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleDeleteReview = async (id) => {
    try {
      const res = await reviewService.deleteReview(id);
      if (res.success) fetchContent();
    } catch (err) {
      alert(err.message || 'Failed to delete');
    }
  };

  const handleDeleteInterview = async (id) => {
    try {
      const res = await interviewService.deleteExperience(id);
      if (res.success) fetchContent();
    } catch (err) {
      alert(err.message || 'Failed to delete');
    }
  };

  return (
    <div className="app-container">
      <Navbar />

      <div className="dashboard-layout">
        <Sidebar />

        <main className="dashboard-content">
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a' }}>Content Moderation & Review Safeguards</h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '0.2rem' }}>
              Moderate company reviews and interview experiences submitted by platform users
            </p>
          </div>

          {loading ? (
            <div className="loader-overlay">
              <div className="loading-spinner"></div>
              <p>Loading moderation queues...</p>
            </div>
          ) : (
            <div className="grid-cols-2">
              <div className="card">
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>Active Company Reviews</h3>
                {reviews.length === 0 ? (
                  <p style={{ color: '#64748b' }}>No company reviews found.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {reviews.map((r) => (
                      <div key={r._id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.85rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                          <strong>{r.companyName} (Rating: {r.overallRating}/5)</strong>
                          <button onClick={() => handleDeleteReview(r._id)} className="btn btn-danger btn-sm" title="Remove Review">
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: '#475569' }}>"{r.reviewText}"</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="card">
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>Published Interview Experiences</h3>
                {interviews.length === 0 ? (
                  <p style={{ color: '#64748b' }}>No interview experiences found.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {interviews.map((exp) => (
                      <div key={exp._id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.85rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                          <strong>{exp.companyName} — {exp.role}</strong>
                          <button onClick={() => handleDeleteInterview(exp._id)} className="btn btn-danger btn-sm" title="Remove Experience">
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: '#475569' }}>"{exp.experienceText.substring(0, 100)}..."</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default AdminModerationPage;
