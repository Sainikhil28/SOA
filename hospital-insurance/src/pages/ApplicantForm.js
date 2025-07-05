import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ApplicantForm = () => {
  const navigate = useNavigate();

  const [applicant, setApplicant] = useState({
    name: '',
    gender: '',
    proofId: '',
    age: '',
    address: '',
    plan: '',
    amount: 0,
  });

  const [familyMembers, setFamilyMembers] = useState([]);

  const handleApplicantChange = (e) => {
    setApplicant({ ...applicant, [e.target.name]: e.target.value });
  };

  const handleFetchApplicantDetails = () => {
    // Simulated fetch based on proof ID
    const dummyData = {
      age: 28,
      address: 'Chennai, TN',
    };
    const plan = dummyData.age < 30 ? 'Young Saver Plan' : 'Standard Life Plan';
    const amount = dummyData.age < 30 ? 2000 : 3000;

    setApplicant((prev) => ({
      ...prev,
      age: dummyData.age,
      address: dummyData.address,
      plan,
      amount,
    }));
  };

  const handleFamilyMemberChange = (index, field, value) => {
    const updated = [...familyMembers];
    updated[index][field] = value;
    setFamilyMembers(updated);
  };

  const handleFetchFamilyMemberDetails = (index) => {
    const dummyData = {
      age: 45,
      address: 'Coimbatore, TN',
    };
    const age = dummyData.age;
    const plan = age < 30 ? 'Young Saver Plan' : age < 60 ? 'Standard Life Plan' : 'Senior Care Plan';
    const amount = age < 30 ? 1500 : age < 60 ? 2500 : 4000;

    const updated = [...familyMembers];
    updated[index] = {
      ...updated[index],
      age,
      address: dummyData.address,
      plan,
      amount,
    };
    setFamilyMembers(updated);
  };

  const addFamilyMember = () => {
    setFamilyMembers([...familyMembers, {
      name: '',
      gender: '',
      relationship: '',
      proofId: '',
      age: '',
      address: '',
      plan: '',
      amount: 0,
    }]);
  };

  const handleProceed = () => {
    navigate('/summary', {
      state: {
        applicant,
        familyMembers,
      },
    });
  };

  return (
    <div className="container mt-5">
      <h3>Applicant Insurance Form</h3>

      {/* Applicant Section */}
      <div className="card p-3 mb-4">
        <h5>Applicant Details</h5>
        <div className="row mb-2">
          <div className="col-md-4">
            <label>Name</label>
            <input type="text" name="name" value={applicant.name} onChange={handleApplicantChange} className="form-control" />
          </div>
          <div className="col-md-4">
            <label>Gender</label>
            <select name="gender" value={applicant.gender} onChange={handleApplicantChange} className="form-control">
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
          <div className="col-md-4">
            <label>Proof ID</label>
            <input type="text" name="proofId" value={applicant.proofId} onChange={handleApplicantChange} className="form-control" />
          </div>
        </div>

        <button onClick={handleFetchApplicantDetails} className="btn btn-primary mb-3">Fetch</button>

        {applicant.age && (
          <>
            <p><strong>Age:</strong> {applicant.age}</p>
            <p><strong>Address:</strong> {applicant.address}</p>
            <p><strong>Suggested Plan:</strong> {applicant.plan}</p>
            <p><strong>Amount:</strong> ₹{applicant.amount}</p>
          </>
        )}
      </div>

      {/* Family Members */}
      <div className="card p-3 mb-4">
        <h5>Family Members</h5>
        {familyMembers.map((member, index) => (
          <div key={index} className="border p-3 mb-3">
            <div className="row mb-2">
              <div className="col-md-3">
                <label>Name</label>
                <input type="text" className="form-control" value={member.name} onChange={(e) => handleFamilyMemberChange(index, 'name', e.target.value)} />
              </div>
              <div className="col-md-2">
                <label>Gender</label>
                <select className="form-control" value={member.gender} onChange={(e) => handleFamilyMemberChange(index, 'gender', e.target.value)}>
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="col-md-3">
                <label>Relationship</label>
                <input type="text" className="form-control" value={member.relationship} onChange={(e) => handleFamilyMemberChange(index, 'relationship', e.target.value)} />
              </div>
              <div className="col-md-3">
                <label>Proof ID</label>
                <input type="text" className="form-control" value={member.proofId} onChange={(e) => handleFamilyMemberChange(index, 'proofId', e.target.value)} />
              </div>
              <div className="col-md-1 d-flex align-items-end">
                <button onClick={() => handleFetchFamilyMemberDetails(index)} className="btn btn-secondary">Fetch</button>
              </div>
            </div>

            {member.age && (
              <div className="mt-2">
                <p><strong>Age:</strong> {member.age}</p>
                <p><strong>Address:</strong> {member.address}</p>
                <p><strong>Suggested Plan:</strong> {member.plan}</p>
                <p><strong>Amount:</strong> ₹{member.amount}</p>
              </div>
            )}
          </div>
        ))}
        <button onClick={addFamilyMember} className="btn btn-outline-success">+ Add Family Member</button>
      </div>

      <div className="text-end">
        <button className="btn btn-success" onClick={handleProceed}>Proceed</button>
      </div>
    </div>
  );
};

export default ApplicantForm;
