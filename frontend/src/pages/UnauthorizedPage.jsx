import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Shield, ArrowLeft, Home } from 'lucide-react';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <Navbar />

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem' }}>
        <div className="card" style={{ maxWidth: '480px', width: '100%', padding: '3rem', textAlign: 'center' }}>
          <div style={{ marginBottom: '2rem' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: '#fef2f2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto'
            }}>
              <Shield size={40} color="#ef4444" />
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>
              Access Denied
            </h1>
            <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.6 }}>
              You don't have permission to access this page. Please contact your administrator if you believe this is an error.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button onClick={() => navigate(-1)} className="btn btn-secondary" style={{ gap: '0.5rem' }}>
              <ArrowLeft size={18} /> Go Back
            </button>
            <Link to="/" className="btn btn-primary" style={{ gap: '0.5rem' }}>
              <Home size={18} /> Home
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UnauthorizedPage;
