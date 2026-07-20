import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/api';

const Login = ({ onLoginSuccess }) => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(form);
      if (res.data.user.role !== 'admin') {
        setError('This account does not have admin access.');
        setLoading(false);
        return;
      }
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      onLoginSuccess(res.data.user);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <span className="page-header__eyebrow">Admin access</span>
      <h2 style={{ marginBottom: 24 }}>Log in</h2>

      {error && <div className="form-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label>Username</label>
          <input
            type="text"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
        </div>
        <div className="form-field">
          <label>Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>
        <button className="btn btn--primary" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'Logging in...' : 'Log in'}
        </button>
      </form>
      {/* <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: 16 }}>
        Default seeded admin: <strong>admin</strong> / <strong>admin123</strong>
      </p> */}
    </div>
  );
};

export default Login;
