import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import { adminService } from '../../services/adminService';
import { Users, Briefcase, FileText, Building, ShieldCheck } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getStats()
      .then(res => {
        if (res.success) {
          setStats(res.stats);
          setRecentUsers(res.recentUsers);
        }
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
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a' }}>Platform Analytics & Control</h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '0.2rem' }}>
              Real-time platform activity metrics calculated directly from database records
            </p>
          </div>

          {loading ? (
            <div className="loader-overlay">
              <div className="loading-spinner"></div>
              <p>Fetching platform statistics...</p>
            </div>
          ) : stats && (
            <>
              <div className="grid-cols-4" style={{ marginBottom: '2rem' }}>
                <div className="stat-card">
                  <div>
                    <div className="stat-val">{stats.totalUsers}</div>
                    <div className="stat-lbl">Registered Users</div>
                  </div>
                  <div className="stat-icon"><Users size={24} /></div>
                </div>

                <div className="stat-card">
                  <div>
                    <div className="stat-val">{stats.totalJobs}</div>
                    <div className="stat-lbl">Total Job Postings</div>
                  </div>
                  <div className="stat-icon" style={{ backgroundColor: '#eef2ff', color: '#4f46e5' }}><Briefcase size={24} /></div>
                </div>

                <div className="stat-card">
                  <div>
                    <div className="stat-val">{stats.totalApplications}</div>
                    <div className="stat-lbl">Applications Submitted</div>
                  </div>
                  <div className="stat-icon" style={{ backgroundColor: '#ecfdf5', color: '#047857' }}><FileText size={24} /></div>
                </div>

                <div className="stat-card">
                  <div>
                    <div className="stat-val">{stats.totalCompanies}</div>
                    <div className="stat-lbl">Verified Companies</div>
                  </div>
                  <div className="stat-icon" style={{ backgroundColor: '#fffbeb', color: '#b45309' }}><Building size={24} /></div>
                </div>
              </div>

              <div className="grid-cols-3" style={{ marginBottom: '2rem' }}>
                <div className="stat-card">
                  <div>
                    <div className="stat-val">{stats.studentCount}</div>
                    <div className="stat-lbl">Active Students</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div>
                    <div className="stat-val">{stats.recruiterCount}</div>
                    <div className="stat-lbl">Active Recruiters</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div>
                    <div className="stat-val">{stats.alumniCount}</div>
                    <div className="stat-lbl">Active Alumni</div>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem' }}>Recently Joined Platform Users</h3>
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>User Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Joined Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentUsers.map((u) => (
                        <tr key={u._id}>
                          <td><strong>{u.name}</strong></td>
                          <td>{u.email}</td>
                          <td><span className="badge badge-primary">{u.role}</span></td>
                          <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                          <td><span className={`badge ${u.isActive ? 'badge-success' : 'badge-danger'}`}>{u.isActive ? 'Active' : 'Deactivated'}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
