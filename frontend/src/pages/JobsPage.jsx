import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { jobService } from '../services/jobService';
import { useAuth } from '../context/AuthContext';
import { Search, MapPin, Briefcase, DollarSign, Clock, Bookmark, ExternalLink, Filter } from 'lucide-react';

const JobsPage = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [externalJobs, setExternalJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [employmentType, setEmploymentType] = useState('');
  const [activeTab, setActiveTab] = useState('campus');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      if (activeTab === 'campus') {
        const res = await jobService.getJobs({ search, location, employmentType });
        if (res.success) setJobs(res.jobs);
      } else {
        const res = await jobService.getExternalJobs({ search });
        if (res.success) setExternalJobs(res.jobs);
      }
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [activeTab]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div className="app-container">
      <Navbar />

      <div style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '2.5rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
            Explore Opportunities & Placement Listings
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: '1.5rem' }}>
            Browse active campus placement openings, verified recruiter listings, and remote global jobs.
          </p>

          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 2, minWidth: '250px', position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Job title, skills, or company name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div style={{ flex: 1, minWidth: '180px', position: 'relative' }}>
              <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="City or Remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <select
              className="form-select"
              style={{ width: 'auto', minWidth: '160px' }}
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}
            >
              <option value="">All Job Types</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
            </select>

            <button type="submit" className="btn btn-primary">
              Search Jobs
            </button>
          </form>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
            <button
              className={`btn ${activeTab === 'campus' ? 'btn-primary btn-sm' : 'btn-secondary btn-sm'}`}
              onClick={() => setActiveTab('campus')}
            >
              HireConnect Campus Jobs
            </button>
            <button
              className={`btn ${activeTab === 'external' ? 'btn-primary btn-sm' : 'btn-secondary btn-sm'}`}
              onClick={() => setActiveTab('external')}
            >
              Global Remote Jobs Feed
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1.5rem', width: '100%', flex: 1 }}>
        {loading ? (
          <div className="loader-overlay">
            <div className="loading-spinner"></div>
            <p>Fetching active opportunities...</p>
          </div>
        ) : activeTab === 'campus' ? (
          jobs.length === 0 ? (
            <div className="empty-state">
              <Briefcase className="empty-icon" />
              <h3>No campus jobs found</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                Try adjusting your search keywords or location filter.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {jobs.map((job) => (
                <div key={job._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>{job.title}</h3>
                      <span className="badge badge-primary">{job.employmentType}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap', color: '#64748b', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                      <span style={{ fontWeight: 600, color: '#1e293b' }}>{job.companyName}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={16} /> {job.location}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><DollarSign size={16} /> {job.salary}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={16} /> Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                    </div>

                    <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {job.description}
                    </p>

                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {job.skills && job.skills.map((skill, index) => (
                        <span key={index} className="badge" style={{ backgroundColor: '#f1f5f9', color: '#475569' }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '140px' }}>
                    <Link to={`/jobs/${job._id}`} className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                      View & Apply
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          externalJobs.length === 0 ? (
            <div className="empty-state">
              <Briefcase className="empty-icon" />
              <h3>No external jobs available</h3>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {externalJobs.map((ext) => (
                <div key={ext.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {ext.companyLogo ? (
                      <img src={ext.companyLogo} alt={ext.companyName} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'contain' }} />
                    ) : (
                      <div className="stat-icon"><Briefcase size={24} /></div>
                    )}
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>{ext.title}</h3>
                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem' }}>
                        <span style={{ fontWeight: 600 }}>{ext.companyName}</span>
                        <span>{ext.location}</span>
                        <span>{ext.salary}</span>
                      </div>
                    </div>
                  </div>
                  <a href={ext.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm" style={{ gap: '0.35rem' }}>
                    Apply External <ExternalLink size={14} />
                  </a>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      <Footer />
    </div>
  );
};

export default JobsPage;
