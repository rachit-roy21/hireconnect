import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import { aiService } from '../../services/aiService';
import { Award, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentRecommendationsPage = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    aiService.getRecommendations()
      .then(res => {
        if (res.success) setRecommendations(res.recommendations);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="app-container">
      <Navbar />

      <div className="dashboard-layout">
        <Sidebar />

        <main className="dashboard-content">
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a' }}>Smart Skill-Matched Jobs</h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '0.2rem' }}>
              Personalized job openings ranked transparently based on your profile skills matching required job qualifications
            </p>
          </div>

          {loading ? (
            <div className="loader-overlay">
              <div className="loading-spinner"></div>
              <p>Analyzing profile skills & matching campus job listings...</p>
            </div>
          ) : recommendations.length === 0 ? (
            <div className="empty-state">
              <Award className="empty-icon" />
              <h3>No match recommendations available</h3>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {recommendations.map((rec, index) => (
                <div key={index} className="card" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>{rec.job.title}</h3>
                      <span className="badge badge-primary">{rec.job.companyName}</span>
                    </div>

                    <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                      {rec.explanation}
                    </p>

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {rec.matchedSkills && rec.matchedSkills.map((sk, i) => (
                        <span key={i} className="badge badge-success" style={{ fontSize: '0.75rem' }}>
                          ✓ {sk}
                        </span>
                      ))}
                      {rec.missingSkills && rec.missingSkills.map((sk, i) => (
                        <span key={i} className="badge badge-danger" style={{ fontSize: '0.75rem' }}>
                          × {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', minWidth: '150px' }}>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: rec.matchPercentage >= 70 ? '#10b981' : '#f59e0b', marginBottom: '0.5rem' }}>
                      {rec.matchPercentage}% Match
                    </div>
                    <Link to={`/jobs/${rec.job._id}`} className="btn btn-primary btn-sm">
                      View Job Details <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default StudentRecommendationsPage;
