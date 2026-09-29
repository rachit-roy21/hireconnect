import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  Briefcase,
  Users,
  Award,
  Sparkles,
  Search,
  CheckCircle2,
  Building2,
  GraduationCap,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  FileCheck
} from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="app-container">
      <Navbar />

      <section style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)',
        padding: '5rem 2rem',
        borderBottom: '1px solid #e2e8f0',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div className="badge badge-primary" style={{ marginBottom: '1.25rem', padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
            <Sparkles size={16} /> Next-Gen Campus Career SaaS Platform
          </div>

          <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.15, marginBottom: '1.25rem' }}>
            Smart Campus Placement & Career Guidance Platform
          </h1>

          <p style={{ fontSize: '1.2rem', color: '#475569', maxWidth: '750px', margin: '0 auto 2.5rem auto', lineHeight: 1.6 }}>
            HireConnect bridges the gap between students, recruiters, and alumni. Get personalized job recommendations, verified referral requests, AI resume analysis, and direct campus recruitment.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/jobs" className="btn btn-primary btn-lg" style={{ gap: '0.5rem' }}>
              Find Opportunities <ArrowRight size={18} />
            </Link>
            <Link to="/register" className="btn btn-secondary btn-lg">
              Join HireConnect Platform
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.5rem',
            marginTop: '4rem',
            paddingTop: '2.5rem',
            borderTop: '1px solid #cbd5e1'
          }}>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#2563eb' }}>98%</div>
              <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Placement Success Rate</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#2563eb' }}>500+</div>
              <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Verified Hiring Partners</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#2563eb' }}>10,000+</div>
              <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Alumni Mentors</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#2563eb' }}>100%</div>
              <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Verified Job Listings</div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '4.5rem 2rem', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a' }}>
              Built for the Entire Placement Ecosystem
            </h2>
            <p style={{ color: '#64748b', fontSize: '1.05rem', marginTop: '0.5rem' }}>
              Unified workflow serving all campus recruitment stakeholders.
            </p>
          </div>

          <div className="grid-cols-3">
            <div className="card">
              <div className="stat-icon" style={{ marginBottom: '1.25rem' }}>
                <GraduationCap size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>For Students</h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', color: '#475569', fontSize: '0.95rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} color="#10b981" /> Apply to top campus job listings</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} color="#10b981" /> Get AI skill-match recommendations</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} color="#10b981" /> Request referrals directly from alumni</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} color="#10b981" /> Analyze resume against ATS criteria</li>
              </ul>
            </div>

            <div className="card">
              <div className="stat-icon" style={{ marginBottom: '1.25rem', backgroundColor: '#eef2ff', color: '#4f46e5' }}>
                <Building2 size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>For Recruiters</h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', color: '#475569', fontSize: '0.95rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} color="#10b981" /> Post & manage job postings</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} color="#10b981" /> Filter student resumes & portfolios</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} color="#10b981" /> Update application pipeline status</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} color="#10b981" /> Direct messaging with top candidates</li>
              </ul>
            </div>

            <div className="card">
              <div className="stat-icon" style={{ marginBottom: '1.25rem', backgroundColor: '#ecfdf5', color: '#047857' }}>
                <Users size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>For Alumni</h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', color: '#475569', fontSize: '0.95rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} color="#10b981" /> Review junior referral requests</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} color="#10b981" /> Mentor students in target companies</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} color="#10b981" /> Share real company interview insights</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} color="#10b981" /> Give back to your alma mater</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '4.5rem 2rem', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Platform Key Features</h2>
          </div>

          <div className="grid-cols-2">
            <div className="card" style={{ display: 'flex', gap: '1rem' }}>
              <div className="stat-icon"><Sparkles size={24} /></div>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem' }}>AI Career Assistant & ATS Resume Analyzer</h4>
                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Get instant guidance on interview questions, resume scores, and skill roadmaps powered by smart AI services.</p>
              </div>
            </div>

            <div className="card" style={{ display: 'flex', gap: '1rem' }}>
              <div className="stat-icon" style={{ backgroundColor: '#eef2ff', color: '#4f46e5' }}><TrendingUp size={24} /></div>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem' }}>Transparent Job Skill Matching</h4>
                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Real skill-matching algorithms evaluate student profile skillsets against job requirements and show match breakdown percentages.</p>
              </div>
            </div>

            <div className="card" style={{ display: 'flex', gap: '1rem' }}>
              <div className="stat-icon" style={{ backgroundColor: '#ecfdf5', color: '#047857' }}><ShieldCheck size={24} /></div>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem' }}>Role-Based Access Control</h4>
                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Strict backend JWT authentication & role authorization for Students, Recruiters, Alumni, and Admins.</p>
              </div>
            </div>

            <div className="card" style={{ display: 'flex', gap: '1rem' }}>
              <div className="stat-icon" style={{ backgroundColor: '#fffbeb', color: '#b45309' }}><FileCheck size={24} /></div>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem' }}>Verified Interview Experiences & Reviews</h4>
                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Read round-by-round interview questions and honest company ratings submitted by alumni and students.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
