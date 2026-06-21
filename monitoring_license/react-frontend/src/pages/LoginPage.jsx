import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { loginUser } from '../services/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const data = await loginUser(form);
      login(data.user || { username: form.username, role: data.role });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <main className="login-page">
      <div className="login-hero">
        <div className="hero-copy">
          <span className="eyebrow">License Monitoring</span>
          <h1>Secure access to your license dashboard</h1>
          <p>Sign in to manage renewals, track expiring licenses, and keep your organization compliant.</p>
        </div>
      </div>
      <section className="auth-card auth-card-login">
        <h1>License Monitoring Login</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Username or Email
            <input
              type="text"
              value={form.username}
              onChange={(event) => setForm({ ...form, username: event.target.value })}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              required
            />
          </label>
          <p className="form-note">Try admin@amadeocoffee.ph / admin123</p>
          {error && <div className="form-error">{error}</div>}
          <button type="submit" className="primary-button">
            Log In
          </button>
        </form>
        <div className="form-footer">
          <span>Don't have an account?</span>
          <Link to="/register">Register here</Link>
        </div>
      </section>
    </main>
  );
}
