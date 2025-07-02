import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  const samplePolicies = [
    {
      id: 'SafePulse',
      name: 'Family Health Optima',
      insurer: 'SafePulse Health',
      description: "Cherish your 50s without worrying about your medical expenses. This policy's wide coverage ensures financial assistance to you and your family",
      image: 'https://images.moneycontrol.com/static-mcnews/2023/06/Health-insurance-770x433.png?impolicy=website&width=770&height=431'
    },
    {
      id: 'LifeBridge', 
      name: 'Health Companion',
      insurer: 'LifeBridge',
      description: 'Affordable individual and family cover with lifelong renewability and modern treatments.',
      image: 'https://images.moneycontrol.com/static-mcnews/2024/08/20240814053845_Health-insu.jpg?impolicy=website&width=770&height=431' // Optional image placeholder
    },
    {
      id: 'CuraShield',
      name: 'Medicare Premier',
      insurer: 'CuraShield',
      description: 'Premium plan offering high coverage limits with extensive hospital network tie-ups.',
      image: 'https://www.reliancegeneral.co.in/SiteAssets/RgiclAssets/images/blogs-images/mediclaim-vs-health-insurance-what-is-the-difference2.webp' // Optional image placeholder
    }
  ];

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
        <h2 className="mb-4">Welcome</h2>
        <div className="row">
          {samplePolicies.map((policy) => (
            <div className="col-md-4 mb-4" key={policy.id}>
              <div className="card h-100 shadow-sm">
                {policy.image && (
                  <img
                    src={policy.image}
                    alt={`${policy.insurer} Logo`}
                    className="card-img-top"
                    style={{ height: '180px', objectFit: 'cover' }}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">{policy.insurer}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">{policy.name}</h6>
                  <p className="card-text">{policy.description}</p>
                  <Link to={`/admin/policy-details/${policy.id}`} className="btn btn-primary">
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
