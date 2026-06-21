import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { deleteUser, getDashboardStats, getUsers, logoutUser, addUser, updateUser } from '../services/api';

const defaultUserForm = { username: '', password: '', name: '', role: 'User' };

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ totalUsers: 0, totalAdmins: 0, expiringLicenses: 0 });
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [userForm, setUserForm] = useState(defaultUserForm);
  const [error, setError] = useState('');

  const title = useMemo(() => {
    return user?.role === 'Admin' || user?.role === 'IT' ? 'Admin Dashboard' : 'User Dashboard';
  }, [user]);

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    try {
      const [statsData, usersData] = await Promise.all([getDashboardStats(), getUsers()]);
      setStats(statsData);
      setUsers(usersData);
    } catch (err) {
      setError(err.message || 'Unable to load dashboard data.');
    }
  }

  async function handleLogout() {
    await logoutUser();
    logout();
    navigate('/login');
  }

  function openNewUser() {
    setSelectedUser(null);
    setUserForm(defaultUserForm);
    setShowForm(true);
  }

  function openEditUser(userData) {
    setSelectedUser(userData);
    setUserForm({ ...userData, password: userData.password || '' });
    setShowForm(true);
  }

  async function handleUserSave(event) {
    event.preventDefault();
    setError('');

    try {
      if (selectedUser) {
        await updateUser({ ...userForm, user_id: selectedUser.user_id });
      } else {
        await addUser(userForm);
      }
      setShowForm(false);
      refresh();
    } catch (err) {
      setError(err.message || 'Save failed');
    }
  }

  async function handleDeleteUser(userId) {
    if (!window.confirm('Delete this user?')) return;
    try {
      await deleteUser(userId);
      refresh();
    } catch (err) {
      setError(err.message || 'Could not delete user.');
    }
  }

  return (
    <div className="page grid-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <h2>License Monitoring</h2>
        </div>
        <nav className="sidebar-nav">
          <button className="link-button" onClick={() => navigate('/dashboard')}>
            Dashboard
          </button>
          <button className="link-button" onClick={() => navigate('/licenses')}>
            License Renewal
          </button>
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-profile">
            <div className="profile-avatar">{user?.name?.charAt(0) || user?.username?.charAt(0)}</div>
            <div className="profile-meta">
              <strong>{user?.name || user?.username}</strong>
              <small>{user?.role || 'User'}</small>
            </div>
          </div>
          <button onClick={handleLogout} className="secondary-button signout-button">
            Sign Out
          </button>
        </div>
      </aside>

      <main className="content">
        <header className="page-header">
          <div>
            <h1>{title}</h1>
            <p>Welcome back, {user?.name || user?.username}.</p>
          </div>
        </header>

        <section className="stats-grid">
          <article className="stat-card">
            <strong>{stats.totalUsers}</strong>
            <span>Total Users</span>
          </article>
          <article className="stat-card">
            <strong>{stats.totalAdmins}</strong>
            <span>Total Admin / IT</span>
          </article>
          <article className="stat-card">
            <strong>{stats.expiringLicenses}</strong>
            <span>Expiring Licenses</span>
          </article>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h2>User Management</h2>
            <button className="primary-button" onClick={openNewUser}>
              + Add User
            </button>
          </div>
          {error && <div className="form-error">{error}</div>}
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Username</th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="5">No users found.</td>
                  </tr>
                ) : (
                  users.map((userData) => (
                    <tr key={userData.user_id}>
                      <td>{userData.user_id}</td>
                      <td>{userData.username}</td>
                      <td>{userData.name}</td>
                      <td>{userData.role}</td>
                      <td className="actions-cell">
                        <button className="small-button" onClick={() => openEditUser(userData)}>
                          Edit
                        </button>
                        <button className="small-button danger" onClick={() => handleDeleteUser(userData.user_id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {showForm && (
        <div className="modal-backdrop" onClick={() => setShowForm(false)}>
          <section className="modal-card" onClick={(event) => event.stopPropagation()}>
            <h3>{selectedUser ? 'Edit User' : 'Add User'}</h3>
            <form onSubmit={handleUserSave}>
              <label>
                Username
                <input
                  type="text"
                  value={userForm.username}
                  onChange={(event) => setUserForm({ ...userForm, username: event.target.value })}
                  required
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  value={userForm.password}
                  onChange={(event) => setUserForm({ ...userForm, password: event.target.value })}
                  required
                />
              </label>
              <label>
                Name
                <input
                  type="text"
                  value={userForm.name}
                  onChange={(event) => setUserForm({ ...userForm, name: event.target.value })}
                  required
                />
              </label>
              <label>
                Role
                <select value={userForm.role} onChange={(event) => setUserForm({ ...userForm, role: event.target.value })}>
                  <option value="IT">IT</option>
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
                </select>
              </label>
              <div className="modal-actions">
                <button type="submit" className="primary-button">
                  Save
                </button>
                <button type="button" className="secondary-button" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
