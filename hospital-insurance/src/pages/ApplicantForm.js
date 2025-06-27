import React, { useState } from 'react';
import './App.css';
import { Link } from 'react-router-dom';

const ApplicantForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    age: '',
    gender: '',
    proofId: '',
    address: '',
    state: '',
    pincode: '',
    profileImage: null,
  });

  const [members, setMembers] = useState([
    { relation: 'Self', age: '', name: '', proofId: '', suggestedPlan: '' },
  ]);

  const MAX_SONS = 2;
  const MAX_DAUGHTERS = 2;

  const addMember = (relation) => {
    const relationCount = members.filter((m) => m.relation === relation).length;

    if (relation === 'Spouse' && relationCount >= 1) return alert('Spouse already added.');
    if (relation === 'Son' && relationCount >= MAX_SONS) return alert('Maximum 2 sons allowed.');
    if (relation === 'Daughter' && relationCount >= MAX_DAUGHTERS) return alert('Maximum 2 daughters allowed.');
    if ((relation === 'Mother' || relation === 'Father') && relationCount >= 1)
      return alert(`${relation} already added.`);

    setMembers((prev) => [...prev, { relation, age: '', name: '', proofId: '', suggestedPlan: '' }]);
  };

  const removeMember = (index) => {
    const newMembers = [...members];
    newMembers.splice(index, 1);
    setMembers(newMembers);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profileImage') {
      setFormData((prev) => ({ ...prev, profileImage: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleMemberChange = (index, field, value) => {
    const updated = [...members];
    updated[index][field] = value;

    if (field === 'age') {
      const age = parseInt(value);
      if (age >= 1 && age <= 18) updated[index].suggestedPlan = 'Child Plan';
      else if (age >= 19 && age <= 60) updated[index].suggestedPlan = 'Adult Standard Plan';
      else if (age > 60) updated[index].suggestedPlan = 'Senior Citizen Plan';
      else updated[index].suggestedPlan = '';
    }

    setMembers(updated);
  };

  const calculatePremium = () => {
    const updatedMembers = members.map((m) => {
      const age = parseInt(m.age);
      let plans = [];
      if (age <= 18) {
        plans = [
          { name: 'Child Plan Basic', price: '₹2000/year', benefits: 'Covers up to ₹2L hospitalization' },
          { name: 'Child Plan Plus', price: '₹3500/year', benefits: 'Covers up to ₹5L + OPD care' }
        ];
      } else if (age <= 60) {
        plans = [
          { name: 'Adult Basic', price: '₹3500/year', benefits: '₹5L coverage + health checkups' },
          { name: 'Adult Plus', price: '₹6000/year', benefits: '₹10L + maternity & wellness' }
        ];
      } else {
        plans = [
          { name: 'Senior Basic', price: '₹8000/year', benefits: '₹3L coverage + OPD support' },
          { name: 'Senior Premium', price: '₹15000/year', benefits: '₹7L + pre-existing disease cover' }
        ];
      }
      return { ...m, plans };
    });

    setMembers(updatedMembers);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Applicant Details:', formData);
    console.log('Members:', members);
    alert('Application submitted!');
  };

  return (
    <div className="main-container full-height">
      <div className="form-section">
        <h2>Applicant Details</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid-container">
            <div><label>Full Name</label><input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required /></div>
            <div><label>Phone Number</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} required /></div>
            <div><label>Age</label><input type="number" name="age" value={formData.age} onChange={handleChange} required /></div>
            <div>
              <label>Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
              </select>
            </div>
            <div><label>Proof ID</label><input type="text" name="proofId" value={formData.proofId} onChange={handleChange} required /></div>
            <div><label>Address</label><textarea name="address" value={formData.address} onChange={handleChange} rows="2" required /></div>
            <div>
              <label>State</label>
              <select name="state" value={formData.state} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="TN">Tamil Nadu</option>
                <option value="KA">Karnataka</option>
                <option value="MH">Maharashtra</option>
                <option value="DL">Delhi</option>
              </select>
            </div>
            <div><label>Pincode</label><input type="text" name="pincode" value={formData.pincode} onChange={handleChange} required /></div>
            <div><label>Profile Image</label><input type="file" name="profileImage" accept="image/*" onChange={handleChange} /></div>
          </div>
          <button className="submit-button" type="submit">Submit Application</button>
        </form>

        <h3 className="mt-5">Members to be Insured</h3>
        <div className="insured-grid">
          {members.map((member, index) => (
            <div key={index} className="insured-member">
              <span>{member.relation}</span>
              <input type="text" placeholder="Name" value={member.name || ''} onChange={(e) => handleMemberChange(index, 'name', e.target.value)} required />
              <input type="number" placeholder="Age" value={member.age || ''} onChange={(e) => handleMemberChange(index, 'age', e.target.value)} required />
              <input type="text" placeholder="Proof ID" value={member.proofId || ''} onChange={(e) => handleMemberChange(index, 'proofId', e.target.value)} required />
              {member.plans && member.plans.map((plan, i) => (
                <div className="plan-suggestion" key={i}>
                  <strong>{plan.name}</strong>: {plan.price}<br />
                  <small>{plan.benefits}</small>
                  <button className="opt-btn">Opt</button>
                </div>
              ))}
              {index !== 0 && (
                <button type="button" className="remove-icon-circle" onClick={() => removeMember(index)}>×</button>
              )}
            </div>
          ))}
        </div>

        <div className="add-members mt-4">
          <h4>Add Family Members</h4>
          <button onClick={() => addMember('Spouse')}>+ Add Spouse</button>
          <button onClick={() => addMember('Son')}>+ Add Son</button>
          <button onClick={() => addMember('Daughter')}>+ Add Daughter</button>
          <button onClick={() => addMember('Father')}>+ Add Father</button>
          <button onClick={() => addMember('Mother')}>+ Add Mother</button>
        </div>

        <button className="calculate-btn" type="button" onClick={calculatePremium}>CALCULATE PREMIUM</button>
            <br></br>
        <Link to="/admin" className="btn btn-secondary mt-4">← Back to Dashboard</Link>
      </div>
    </div>
  );
};

export default ApplicantForm;
