import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const DashboardAuth = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === 'dashboard1234') {
      navigate('/dashboard');
    } else {
      setError('Incorrect password!');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card shadow-lg p-4">
            <h4 className="text-center mb-3">Enter Dashboard Password</h4>
            <form onSubmit={handleSubmit}>
              <input
                type="password"
                className="form-control mb-3"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && <div className="alert alert-danger">{error}</div>}
              <button type="submit" className="btn btn-primary w-100">
                Go to Dashboard
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAuth;
