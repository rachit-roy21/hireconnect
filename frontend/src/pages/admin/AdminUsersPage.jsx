import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import { adminService } from '../../services/adminService';
import { Users, Search, Power } from 'lucide-react';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('');
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminService.getUsers({ role, search });
      if (res.success) setUsers(res.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [role]);

  const handleToggle = async (userId) => {
    try {
      const res = await adminService.toggleUserStatus(userId);
      if (res.success) fetchUsers();
    } catch (err) {
      alert(err.message || 'Failed to toggle user status');
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  return (
    <div className="app-container">
      <Navbar />

      <div className="dashboard-layout">
        <Sidebar />

        <main className="dashboard-content">
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a' }}>Manage Platform Users</h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '0.2rem' }}>
              Search accounts and activate/deactivate student, recruiter, or alumni access
            </p>
          </div>

          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              className="form-input"
              style={{ flex: 1, minWidth: '200px' }}
              placeholder="Search user by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="form-select"
              style={{ width: 'auto', minWidth: '150px' }}
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">All User Roles</option>
              <option value="student">Student</option>
              <option value="recruiter">Recruiter</option>
              <option value="alumni">Alumni</option>
              <option value="admin">Admin</option>
            </select>

            <button type="submit" className="btn btn-primary">Search</button>
          </form>

          {loading ? (
            <div className="loader-overlay">
              <div className="loading-spinner"></div>
              <p>Loading platform accounts...</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td><strong>{u.name}</strong></td>
                      <td>{u.email}</td>
                      <td><span className="badge badge-primary">{u.role}</span></td>
                      <td><span className={`badge ${u.isActive ? 'badge-success' : 'badge-danger'}`}>{u.isActive ? 'Active' : 'Deactivated'}</span></td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          onClick={() => handleToggle(u._id)}
                          className={`btn ${u.isActive ? 'btn-danger' : 'btn-primary'} btn-sm`}
                          style={{ gap: '0.35rem' }}
                        >
                          <Power size={14} /> {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default AdminUsersPage;
