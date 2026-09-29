import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { LogIn, Lock, Mail, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(formData);
      if (res.success) {
        switch (res.user.role) {
          case 'student': navigate('/student/dashboard'); break;
          case 'recruiter': navigate('/recruiter/dashboard'); break;
          case 'alumni': navigate('/alumni/dashboard'); break;
          case 'admin': navigate('/admin/dashboard'); break;
          default: navigate('/');
        }
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillTestCredentials = (roleEmail, pass = 'student123') => {
    setFormData({ email: roleEmail, password: pass });
  };

  return (
    <div className="app-container">
      <Navbar />

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem' }}>
        <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>Welcome Back</h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Sign in to your HireConnect workspace
            </p>
          </div>

          {error && (
            <div style={{
              backgroundColor: '#fef2f2',
              color: '#b91c1c',
              border: '1px solid #fecaca',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="name@university.edu"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="password"
                  name="password"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
              {loading ? <span className="loading-spinner" style={{ width: '18px', height: '18px' }}></span> : <><LogIn size={18} /> Sign In</>}
            </button>
          </form>

          <div style={{ marginTop: '1.75rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0', textAlignment: 'center' }}>
            <p style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, marginBottom: '0.5rem' }}>
              Quick Demo Accounts:
            </p>
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button type="button" onClick={() => fillTestCredentials('student@hireconnect.com', 'student123')} className="btn btn-secondary btn-sm" style={{ fontSize: '0.75rem' }}>
                Student
              </button>
              <button type="button" onClick={() => fillTestCredentials('recruiter@hireconnect.com', 'recruiter123')} className="btn btn-secondary btn-sm" style={{ fontSize: '0.75rem' }}>
                Recruiter
              </button>
              <button type="button" onClick={() => fillTestCredentials('alumni@hireconnect.com', 'alumni123')} className="btn btn-secondary btn-sm" style={{ fontSize: '0.75rem' }}>
                Alumni
              </button>
              <button type="button" onClick={() => fillTestCredentials('admin@hireconnect.com', 'admin123')} className="btn btn-secondary btn-sm" style={{ fontSize: '0.75rem' }}>
                Admin
              </button>
            </div>
          </div>

          <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#64748b', marginTop: '1.5rem' }}>
            Don't have an account? <Link to="/register" style={{ fontWeight: 600 }}>Create an account</Link>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LoginPage;
