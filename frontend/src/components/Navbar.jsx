import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { notificationService } from '../services/notificationService';
import { Briefcase, Bell, LogOut, Sparkles, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [notes, setNotes] = useState([]);
  const notesRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setUnreadCount(0);
      return;
    }
    notificationService.getNotifications()
      .then((res) => {
        setUnreadCount(res.unreadCount || 0);
        setNotes((res.notifications || []).slice(0, 6));
      })
      .catch(() => setUnreadCount(0));
  }, [isAuthenticated, location.pathname]);

  useEffect(() => {
    const onClick = (e) => {
      if (notesRef.current && !notesRef.current.contains(e.target)) {
        setNotesOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'student': return '/student/dashboard';
      case 'recruiter': return '/recruiter/dashboard';
      case 'alumni': return '/alumni/dashboard';
      case 'admin': return '/admin/dashboard';
      default: return '/';
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <Briefcase style={{ color: '#2563eb' }} />
        <span>HireConnect</span>
      </Link>

      <button type="button" className="nav-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div className={`nav-cluster ${menuOpen ? 'open' : ''}`}>
        <ul className="nav-links">
          <li><Link to="/jobs" className={`nav-link ${location.pathname.startsWith('/jobs') ? 'active' : ''}`}>Jobs</Link></li>
          <li><Link to="/companies" className={`nav-link ${location.pathname.startsWith('/companies') ? 'active' : ''}`}>Companies</Link></li>
          <li><Link to="/alumni-network" className={`nav-link ${location.pathname.startsWith('/alumni-network') ? 'active' : ''}`}>Alumni</Link></li>
          <li><Link to="/company-reviews" className={`nav-link ${location.pathname === '/company-reviews' ? 'active' : ''}`}>Reviews</Link></li>
          <li><Link to="/interview-experiences" className={`nav-link ${location.pathname.startsWith('/interview-experiences') ? 'active' : ''}`}>Interviews</Link></li>
          <li><Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>About</Link></li>
        </ul>

        {isAuthenticated ? (
          <div className="nav-actions">
            <Link to={getDashboardLink()} className="btn btn-outline btn-sm">Dashboard</Link>
            {user.role === 'student' && (
              <Link to="/student/ai-assistant" className="btn btn-primary btn-sm">
                <Sparkles size={14} /> AI
              </Link>
            )}
            <div ref={notesRef} style={{ position: 'relative' }}>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setNotesOpen(!notesOpen)}>
                <Bell size={16} />
                {unreadCount > 0 && <span className="notif-dot">{unreadCount}</span>}
              </button>
              {notesOpen && (
                <div className="notif-panel">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <strong>Notifications</strong>
                    <Link to="/notifications" onClick={() => setNotesOpen(false)}>View all</Link>
                  </div>
                  {notes.length === 0 ? (
                    <p style={{ color: '#64748b', fontSize: '0.85rem' }}>No notifications yet.</p>
                  ) : notes.map((n) => (
                    <Link key={n._id} to={n.link || '/notifications'} className="notif-item" onClick={() => setNotesOpen(false)}>
                      <strong>{n.title}</strong>
                      <span>{n.message}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <button onClick={handleLogout} className="btn btn-secondary btn-sm" title="Logout">
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <div className="nav-actions">
            <Link to="/login" className="btn btn-secondary btn-sm">Sign In</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
