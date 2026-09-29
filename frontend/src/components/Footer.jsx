import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#ffffff',
      borderTop: '1px solid #e2e8f0',
      padding: '3rem 2rem 2rem 2rem',
      marginTop: 'auto'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2.5rem',
          paddingBottom: '2.5rem',
          borderBottom: '1px solid #e2e8f0'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.2rem', color: '#0f172a', marginBottom: '0.75rem' }}>
              <Briefcase size={20} color="#2563eb" />
              <span>HireConnect</span>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>
              The unified smart placement ecosystem connecting students, recruiters, and alumni for campus recruitment and career guidance.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', color: '#0f172a', marginBottom: '1rem' }}>For Students</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
              <li><Link to="/jobs" style={{ color: '#64748b' }}>Browse Campus Jobs</Link></li>
              <li><Link to="/alumni-network" style={{ color: '#64748b' }}>Alumni Mentorship</Link></li>
              <li><Link to="/student/ai-assistant" style={{ color: '#64748b' }}>AI Career Guidance</Link></li>
              <li><Link to="/interview-experiences" style={{ color: '#64748b' }}>Interview Preparation</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', color: '#0f172a', marginBottom: '1rem' }}>For Employers & Alumni</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
              <li><Link to="/register?role=recruiter" style={{ color: '#64748b' }}>Post Campus Jobs</Link></li>
              <li><Link to="/register?role=alumni" style={{ color: '#64748b' }}>Give Referrals</Link></li>
              <li><Link to="/company-reviews" style={{ color: '#64748b' }}>Company Culture Reviews</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', color: '#0f172a', marginBottom: '1rem' }}>Platform</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
              <li><span style={{ color: '#64748b' }}>Terms of Service</span></li>
              <li><span style={{ color: '#64748b' }}>Privacy Policy</span></li>
              <li><span style={{ color: '#64748b' }}>Campus Security</span></li>
            </ul>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          paddingTop: '1.5rem',
          fontSize: '0.85rem',
          color: '#94a3b8'
        }}>
          <p>© {new Date().getFullYear()} HireConnect Placement System. All rights reserved.</p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            Built with production readiness for modern career growth.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
