import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { reviewService } from '../services/reviewService';
import { useAuth } from '../context/AuthContext';
import { Star, Building, Search, PlusCircle, UserCheck } from 'lucide-react';

const CompanyReviewsPage = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    overallRating: 5,
    workLifeBalance: 4,
    workEnvironment: 4,
    careerGrowth: 4,
    reviewText: '',
    isAnonymous: false
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await reviewService.getReviews({ search });
      if (res.success) setReviews(res.reviews);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleCreateReview = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const res = await reviewService.createReview(formData);
      if (res.success) {
        setShowModal(false);
        fetchReviews();
      }
    } catch (err) {
      alert(err.message || 'Failed to submit review');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Navbar />

      <div style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '2.5rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
              Company Ratings & Culture Reviews
            </h1>
            <p style={{ color: '#64748b', fontSize: '1rem' }}>
              Read authentic feedback on work environment, compensation, and learning opportunities.
            </p>
          </div>

          {user && (
            <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ gap: '0.4rem' }}>
              <PlusCircle size={18} /> Write a Company Review
            </button>
          )}
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1.5rem', width: '100%', flex: 1 }}>
        {loading ? (
          <div className="loader-overlay">
            <div className="loading-spinner"></div>
            <p>Loading company reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="empty-state">
            <Building className="empty-icon" />
            <h3>No reviews submitted yet</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>Be the first alumnus or student to review a campus employer.</p>
          </div>
        ) : (
          <div className="grid-cols-2">
            {reviews.map((rev) => (
              <div key={rev._id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>{rev.companyName}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#f59e0b', marginTop: '0.25rem' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} fill={i < rev.overallRating ? '#f59e0b' : 'none'} color="#f59e0b" />
                      ))}
                      <strong style={{ marginLeft: '0.35rem', color: '#0f172a', fontSize: '0.95rem' }}>{rev.overallRating}.0</strong>
                    </div>
                  </div>

                  <span className="badge badge-info" style={{ gap: '0.3rem' }}>
                    <UserCheck size={14} /> {rev.isAnonymous ? 'Anonymous Alumni' : (rev.author?.name || 'Verified Member')}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '1rem', backgroundColor: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.8rem', color: '#475569', marginBottom: '1rem' }}>
                  <span>Work-Life: <strong>{rev.workLifeBalance}/5</strong></span>
                  <span>Environment: <strong>{rev.workEnvironment}/5</strong></span>
                  <span>Growth: <strong>{rev.careerGrowth}/5</strong></span>
                </div>

                <p style={{ color: '#334155', fontSize: '0.95rem', lineHeight: 1.6 }}>
                  "{rev.reviewText}"
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem' }}>Write a Company Review</h2>

            <form onSubmit={handleCreateReview}>
              <div className="form-group">
                <label className="form-label">Company Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Google Tech"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Overall Rating (1 to 5 Stars)</label>
                <select
                  className="form-select"
                  value={formData.overallRating}
                  onChange={(e) => setFormData({ ...formData, overallRating: Number(e.target.value) })}
                >
                  <option value={5}>5 Stars - Excellent</option>
                  <option value={4}>4 Stars - Good</option>
                  <option value={3}>3 Stars - Average</option>
                  <option value={2}>2 Stars - Below Expectations</option>
                  <option value={1}>1 Star - Poor</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Review Details</label>
                <textarea
                  className="form-textarea"
                  placeholder="Share insights regarding culture, interview process, and career growth..."
                  value={formData.reviewText}
                  onChange={(e) => setFormData({ ...formData, reviewText: e.target.value })}
                  rows={4}
                  required
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <input
                  type="checkbox"
                  id="anonCheck"
                  checked={formData.isAnonymous}
                  onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                />
                <label htmlFor="anonCheck" style={{ fontSize: '0.9rem', color: '#475569' }}>
                  Post review anonymously
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitLoading}>
                  {submitLoading ? <span className="loading-spinner" style={{ width: '16px', height: '16px' }}></span> : 'Submit Review'}
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

export default CompanyReviewsPage;
