import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { interviewService } from '../services/interviewService';
import { useAuth } from '../context/AuthContext';
import { Award, Search, PlusCircle, HelpCircle, CheckCircle2, ChevronRight, User } from 'lucide-react';

const InterviewExperiencesPage = () => {
  const { user } = useAuth();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    role: '',
    difficulty: 'Medium',
    outcome: 'Selected',
    experienceText: '',
    questions: '',
    advice: ''
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchExperiences = async () => {
    setLoading(true);
    try {
      const res = await interviewService.getExperiences({ search });
      if (res.success) setExperiences(res.experiences);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const res = await interviewService.createExperience({
        ...formData,
        questions: formData.questions.split('\n').filter(Boolean)
      });
      if (res.success) {
        setShowModal(false);
        fetchExperiences();
      }
    } catch (err) {
      alert(err.message || 'Failed to submit interview experience');
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
              Campus Interview Preparation Archive
            </h1>
            <p style={{ color: '#64748b', fontSize: '1rem' }}>
              Real questions, round-by-round interview structures, and advice shared by selected students & alumni.
            </p>
          </div>

          {user && (
            <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ gap: '0.4rem' }}>
              <PlusCircle size={18} /> Share Interview Experience
            </button>
          )}
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1.5rem', width: '100%', flex: 1 }}>
        {loading ? (
          <div className="loader-overlay">
            <div className="loading-spinner"></div>
            <p>Fetching interview experiences...</p>
          </div>
        ) : experiences.length === 0 ? (
          <div className="empty-state">
            <Award className="empty-icon" />
            <h3>No interview experiences submitted yet</h3>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {experiences.map((exp) => (
              <div key={exp._id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>{exp.companyName} — {exp.role}</h3>
                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.35rem', fontSize: '0.85rem' }}>
                      <span className={`badge ${exp.difficulty === 'Easy' ? 'badge-success' : exp.difficulty === 'Hard' ? 'badge-danger' : 'badge-warning'}`}>
                        Difficulty: {exp.difficulty}
                      </span>
                      <span className={`badge ${exp.outcome === 'Selected' ? 'badge-success' : 'badge-primary'}`}>
                        Outcome: {exp.outcome}
                      </span>
                    </div>
                  </div>

                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    Shared by {exp.author?.name || 'Campus Peer'} on {new Date(exp.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>Experience Overview</h4>
                  <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6 }}>{exp.experienceText}</p>
                </div>

                {exp.questions && exp.questions.length > 0 && (
                  <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '10px', marginBottom: '1rem' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <HelpCircle size={16} color="#2563eb" /> Key Questions Asked:
                    </h4>
                    <ul style={{ paddingLeft: '1.25rem', color: '#334155', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      {exp.questions.map((q, i) => (
                        <li key={i}>{q}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {exp.advice && (
                  <div style={{ color: '#047857', fontSize: '0.9rem', fontWeight: 500, backgroundColor: '#ecfdf5', padding: '0.75rem 1rem', borderRadius: '8px' }}>
                    💡 <strong>Pro Advice:</strong> {exp.advice}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem' }}>Share Interview Experience</h2>

            <form onSubmit={handleCreate}>
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
                <label className="form-label">Role Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. SDE-1 / Software Developer Intern"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                />
              </div>

              <div className="grid-cols-2">
                <div className="form-group">
                  <label className="form-label">Interview Difficulty</label>
                  <select
                    className="form-select"
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Interview Result</label>
                  <select
                    className="form-select"
                    value={formData.outcome}
                    onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
                  >
                    <option value="Selected">Selected / Offer Made</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Pending">Pending Decision</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Detailed Round Breakdown</label>
                <textarea
                  className="form-textarea"
                  placeholder="Explain Online Assessment, Technical Round 1, System Design, HR round..."
                  value={formData.experienceText}
                  onChange={(e) => setFormData({ ...formData, experienceText: e.target.value })}
                  rows={4}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Specific Questions (One per line)</label>
                <textarea
                  className="form-textarea"
                  placeholder="What is an event loop?&#10;Implement LRU Cache in Java&#10;Explain React Virtual DOM"
                  value={formData.questions}
                  onChange={(e) => setFormData({ ...formData, questions: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Advice for Juniors</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Focus on DSA, clear concepts, explain solution out loud..."
                  value={formData.advice}
                  onChange={(e) => setFormData({ ...formData, advice: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitLoading}>
                  {submitLoading ? <span className="loading-spinner" style={{ width: '16px', height: '16px' }}></span> : 'Publish Experience'}
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

export default InterviewExperiencesPage;
