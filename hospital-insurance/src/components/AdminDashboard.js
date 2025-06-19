import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any tokens if you use authentication (optional)
    navigate('/login');
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
        <Link className="navbar-brand" to="/admin">Admin Dashboard</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/admin/create-policy">Add Policy</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/policies">Policy List</Link>
            </li>
          </ul>
          <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="container mt-4">
        <h2>Welcome to Admin Dashboard</h2>
        <p>You can onboard and manage insurance policies from the navigation bar above.</p>
      </div>
    </>
  );
};

export default AdminDashboard;
