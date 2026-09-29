import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  User,
  Briefcase,
  FileText,
  Bookmark,
  Users,
  Send,
  MessageSquare,
  Sparkles,
  Star,
  Award,
  PlusCircle,
  CheckCircle,
  Building,
  Shield,
  Settings
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  if (!user) return null;

  const renderStudentLinks = () => (
    <>
      <NavLink to="/student/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
        <LayoutDashboard size={18} /> Overview
      </NavLink>
      <NavLink to="/student/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
        <User size={18} /> My Resume Profile
      </NavLink>
      <NavLink to="/student/applications" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
        <FileText size={18} /> Applications
      </NavLink>
      <NavLink to="/student/saved-jobs" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
        <Bookmark size={18} /> Saved Jobs
      </NavLink>

      <NavLink to="/student/recommendations" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
        <Award size={18} /> Smart Matching
      </NavLink>
      <NavLink to="/student/ai-assistant" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
        <Sparkles size={18} /> AI Career Coach
      </NavLink>

      <NavLink to="/student/referrals" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
        <Send size={18} /> My Referrals
      </NavLink>
      <NavLink to="/messages" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
        <MessageSquare size={18} /> Chat Messages
      </NavLink>
    </>
  );

  const renderRecruiterLinks = () => (
    <>
      <NavLink to="/recruiter/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
        <LayoutDashboard size={18} /> Dashboard
      </NavLink>
      <NavLink to="/recruiter/jobs/new" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
        <PlusCircle size={18} /> Post New Job
      </NavLink>
      <NavLink to="/recruiter/jobs" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
        <Briefcase size={18} /> Manage Listings
      </NavLink>
      <NavLink to="/recruiter/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
        <Building size={18} /> Company Profile
      </NavLink>
      <NavLink to="/messages" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
        <MessageSquare size={18} /> Candidates Chat
      </NavLink>
    </>
  );

  const renderAlumniLinks = () => (
    <>
      <NavLink to="/alumni/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
        <LayoutDashboard size={18} /> Overview
      </NavLink>
      <NavLink to="/alumni/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
        <User size={18} /> Alumni Profile
      </NavLink>
      <NavLink to="/alumni/referrals" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
        <Send size={18} /> Referral Requests
      </NavLink>
      <NavLink to="/alumni/share-experience" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
        <Star size={18} /> Share Interview Tip
      </NavLink>
      <NavLink to="/messages" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
        <MessageSquare size={18} /> Student Mentorship
      </NavLink>
    </>
  );

  const renderAdminLinks = () => (
    <>
      <NavLink to="/admin/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
        <LayoutDashboard size={18} /> System Analytics
      </NavLink>
      <NavLink to="/admin/users" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
        <Users size={18} /> Manage Users
      </NavLink>
      <NavLink to="/admin/companies" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
        <Building size={18} /> Manage Companies
      </NavLink>
      <NavLink to="/admin/moderation" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
        <CheckCircle size={18} /> Content Moderation
      </NavLink>
    </>
  );

  return (
    <aside className="sidebar">
      <div style={{ paddingBottom: '0.75rem', marginBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.5px' }}>
          {user.role} Workspace
        </div>
        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--slate-900)', marginTop: '0.2rem' }}>
          {user.name}
        </div>
      </div>

      {user.role === 'student' && renderStudentLinks()}
      {user.role === 'recruiter' && renderRecruiterLinks()}
      {user.role === 'alumni' && renderAlumniLinks()}
      {user.role === 'admin' && renderAdminLinks()}
    </aside>
  );
};

export default Sidebar;
