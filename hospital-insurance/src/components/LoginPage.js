import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    // Admin login
    if (email === 'admin@gmail.com' && password === 'admin') {
      localStorage.setItem('token', 'admin-token');
      localStorage.setItem('username', 'Admin');
      localStorage.setItem('user_id', 'admin');
      navigate('/admin');
      return;
    }

    try {
      const payload = { email };

      const response = await fetch('http://192.168.166.32:5000/service/verify_email', {
        method: 'POST',
        headers: {
          'X-API-KEY': '0898c79d9edee1eaf79e1f97718ea84da47472f70884944ba1641b58ed24796c',
          'X-CLIENT-SECRET': 'Sainikhil28',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!data.exists) {
        setError('User not registered. Please sign up first.');
        return;
      }

      if (data.verified && data.status === 'active') {
        localStorage.setItem('token', 'user-token');
        localStorage.setItem('username', data.username || email);
        localStorage.setItem('user_id', email);
        navigate('/admin');
      } else {
        setError('Your account is inactive or not verified.');
      }

    } catch (err) {
      console.error('Login error:', err);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow-lg p-4">
            <div className="card-body">
              <h3 className="text-center mb-4">Login</h3>
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label>Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
                <button type="submit" className="btn btn-primary w-100">Login</button>

                <button className="btn btn-secondary mt-3 w-100" onClick={() => navigate('/dashboard-auth')}>
  Go to Dashboard</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
