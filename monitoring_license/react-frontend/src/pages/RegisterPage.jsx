import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', name: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (form.password !== form.confirmPassword) {
      setError('Password and confirmation must match.');
      return;
    }

    try {
      await registerUser(form);
      setSuccess('Registration successful. Please log in.');
      setForm({ username: '', name: '', password: '', confirmPassword: '' });
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <main className="page page-center">
      <section className="auth-card">
        <h1>Create Account</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Username
            <input
              type="text"
              value={form.username}
              onChange={(event) => setForm({ ...form, username: event.target.value })}
              required
            />
          </label>
          <label>
            Full Name
            <input
              type="text"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
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
          <label>
            Confirm Password
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })}
              required
            />
          </label>
          {error && <div className="form-error">{error}</div>}
          {success && <div className="form-success">{success}</div>}
          <button type="submit" className="primary-button">
            Register
          </button>
        </form>
        <div className="form-footer">
          <span>Already have an account?</span>
          <Link to="/login">Log in here</Link>
        </div>
      </section>
    </main>
  );
}
