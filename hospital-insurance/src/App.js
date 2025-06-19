import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import AdminDashboard from './components/AdminDashboard';
import PolicyForm from './components/PolicyForm';
import PolicyList from './components/PolicyList';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/create-policy" element={<PolicyForm />} />
        <Route path="/admin/policies" element={<PolicyList />} />

      </Routes>
    </Router>
  );
}

export default App;
