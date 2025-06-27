import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import AdminDashboard from './components/AdminDashboard';
import PolicyForm from './components/PolicyForm';
import PolicyList from './components/PolicyList';
import SafePulseHealth from './pages/SafePulseHealth';
import LifeBridge from './pages/LifeBridge';
import CuraShield from './pages/CuraShield';
import ApplicantForm from './pages/ApplicantForm';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/create-policy" element={<PolicyForm />} />
        <Route path="/admin/policies" element={<PolicyList />} />
         <Route path="/admin/policy-details/SafePulse" element={<SafePulseHealth />} />
        <Route path="/admin/policy-details/LifeBridge" element={<LifeBridge />} />
        <Route path="/admin/policy-details/CuraShield" element={<CuraShield />} />
        <Route path="/admin/apply-policy" element={<ApplicantForm />} />
      </Routes>
    </Router>
  );
}

export default App;
