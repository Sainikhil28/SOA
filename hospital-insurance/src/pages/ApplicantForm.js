import React, { useState } from 'react';
import axios from 'axios';

// Plan definitions
const allPlans = [
  { name: 'Child Basic Plan', amount: 2000, minAge: 0, maxAge: 18 },
  { name: 'Child Premium Plan', amount: 3000, minAge: 0, maxAge: 18 },
  { name: 'Adult Normal Plan', amount: 4000, minAge: 19, maxAge: 59 },
  { name: 'Adult Premium Plan', amount: 6000, minAge: 19, maxAge: 59 },
  { name: 'Senior Basic Plan', amount: 7000, minAge: 60, maxAge: 120 },
  { name: 'Senior Premium Plan', amount: 9000, minAge: 60, maxAge: 120 },
];

const getPlansByAge = (age) => allPlans.filter(p => age >= p.minAge && age <= p.maxAge);

const relationshipLimits = {
  Son: 2,
  Daughter: 2,
};

const ApplicantForm = () => {
  const [proofId, setProofId] = useState('');
  const [formData, setFormData] = useState({ name: '', gender: '', phoneNo: '' });
  const [applicant, setApplicant] = useState(null);
  const [error, setError] = useState('');
  const [familyMembers, setFamilyMembers] = useState([]);
  const [memberInput, setMemberInput] = useState({ name: '', gender: '', phoneNo: '', proofId: '', relationship: '' });
  const [agreed, setAgreed] = useState(false);
  const [showModal, setShowModal] = useState(true);

  const fetchDetails = async (proofId) => {
    const res = await axios.get(`http://localhost:5000/api/proof/${proofId}`);
    return res.data;
  };

  const handleFetchApplicant = async () => {
    try {
      setError('');
      const { age, address } = await fetchDetails(proofId);
      const plans = getPlansByAge(age);
      const defaultPlan = plans[0];

      setApplicant({
        ...formData,
        proofId,
        age,
        address,
        plan: defaultPlan.name,
        amount: defaultPlan.amount,
        planOptions: plans,
      });
    } catch {
      setApplicant(null);
      setError('Proof not found for given ID');
    }
  };

  const handleApplicantPlanChange = (e) => {
    const selected = applicant.planOptions.find(p => p.name === e.target.value);
    setApplicant({ ...applicant, plan: selected.name, amount: selected.amount });
  };

  const countRelationship = (relation) => {
    return familyMembers.filter(m => m.relationship === relation).length;
  };

  const handleAddFamilyMember = async () => {
    try {
      setError('');

      const currentCount = countRelationship(memberInput.relationship);
      if (relationshipLimits[memberInput.relationship] && currentCount >= relationshipLimits[memberInput.relationship]) {
        setError(`Only ${relationshipLimits[memberInput.relationship]} ${memberInput.relationship}s are allowed.`);
        return;
      }

      const { age, address } = await fetchDetails(memberInput.proofId);
      const plans = getPlansByAge(age);
      const defaultPlan = plans[0];

      const newMember = { 
        ...memberInput,
        age,
        address,
        plan: defaultPlan.name,
        amount: defaultPlan.amount,
        planOptions: plans,
      };

      setFamilyMembers([...familyMembers, newMember]);
      setMemberInput({ name: '', gender: '', phoneNo: '', proofId: '', relationship: '' });
    } catch {
      setError('Family member proof ID not found.');
    }
  };

  const handleMemberPlanChange = (idx, selectedPlanName) => {
    setFamilyMembers(prev =>
      prev.map((member, i) =>
        i === idx
          ? {
              ...member,
              plan: selectedPlanName,
              amount: member.planOptions.find(p => p.name === selectedPlanName).amount,
            }
          : member
      )
    );
  };

  const netAmount = (applicant?.amount || 0) + familyMembers.reduce((sum, m) => sum + m.amount, 0);
  const gst = netAmount * 0.18;
  const totalWithGST = netAmount + gst;

  return (
    <div className="container mt-5">
      {/* Modal for Terms */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Health Insurance Terms & Conditions</h5>
              </div>
              <div className="modal-body">
                <p><strong>Section 80D of the Income Tax Act:</strong></p>
                <ul>
                  <li>Deduction of up to ₹25,000/year for health insurance premiums.</li>
                  <li>Up to ₹50,000/year for senior citizens (age 60+).</li>
                  <li>Includes ₹5,000 for preventive health checkups.</li>
                </ul>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={() => { setAgreed(true); setShowModal(false); }}>
                  I Agree & Proceed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <h3>Applicant Insurance Form</h3>

      {!agreed && <p className="text-danger">⚠️ Please accept the terms to continue.</p>}

      <div className="row mb-3">
        <div className="col-md-3">
          <label>Name</label>
          <input className="form-control" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} disabled={!agreed} />
        </div>
        <div className="col-md-3">
          <label>Gender</label>
          <select className="form-control" value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })} disabled={!agreed}>
            <option value="">Select</option><option>Male</option><option>Female</option><option>Other</option>
          </select>
        </div>
        <div className="col-md-3">
          <label>Phone No</label>
          <input className="form-control" value={formData.phoneNo} onChange={e => setFormData({ ...formData, phoneNo: e.target.value })} disabled={!agreed} />
        </div>
        <div className="col-md-3">
          <label>Proof ID</label>
          <input className="form-control" value={proofId} onChange={e => setProofId(e.target.value)} disabled={!agreed} />
        </div>
      </div>

      <button className="btn btn-primary mb-3" onClick={handleFetchApplicant} disabled={!agreed}>Fetch Applicant Details</button>
      {error && <div className="alert alert-danger">{error}</div>}

      {applicant && (
        <div className="border p-3 mb-4">
          <h5>Applicant Info</h5>
          <p><strong>Name:</strong> {formData.name}</p>
          <p><strong>Gender:</strong> {formData.gender}</p>
          <p><strong>Phone:</strong> {formData.phoneNo}</p>
          <p><strong>Proof ID:</strong> {applicant.proofId}</p>
          <p><strong>Age:</strong> {applicant.age}</p>
          <p><strong>Address:</strong> {applicant.address}</p>
          <label><strong>Select Plan</strong></label>
          <select className="form-control mb-2" value={applicant.plan} onChange={handleApplicantPlanChange}>
            {applicant.planOptions.map((p, i) => (
              <option key={i} value={p.name}>{p.name} - ₹{p.amount}</option>
            ))}
          </select>
          <p><strong>Amount:</strong> ₹{applicant.amount}</p>
        </div>
      )}

      {/* Family Member Form */}
      <h5>Add Family Member</h5>
      <div className="row mb-3">
        {['name', 'gender', 'phoneNo', 'proofId'].map((field, i) => (
          <div className="col-md-2" key={i}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            {field === 'gender' ? (
              <select className="form-control" value={memberInput[field]} onChange={e => setMemberInput({ ...memberInput, [field]: e.target.value })}>
                <option value="">Select</option><option>Male</option><option>Female</option><option>Other</option>
              </select>
            ) : (
              <input className="form-control" value={memberInput[field]} onChange={e => setMemberInput({ ...memberInput, [field]: e.target.value })} />
            )}
          </div>
        ))}
        <div className="col-md-2">
          <label>Relationship</label>
          <select className="form-control" value={memberInput.relationship} onChange={e => setMemberInput({ ...memberInput, relationship: e.target.value })}>
            <option value="">Select</option>
            <option>Father</option>
            <option>Mother</option>
            <option>Spouse</option>
            <option>Son</option>
            <option>Daughter</option>
          </select>
        </div>
      </div>
      <button className="btn btn-success mb-4" onClick={handleAddFamilyMember}>Add Family Member</button>

      {familyMembers.length > 0 && (
        <>
          <h5>Family Members</h5>
          <table className="table table-bordered">
            <thead>
              <tr><th>S.No</th><th>Name</th><th>Gender</th><th>Phone</th><th>Relationship</th><th>Age</th><th>Address</th><th>Plan</th><th>Amount</th></tr>
            </thead>
            <tbody>
              {familyMembers.map((m, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{m.name}</td>
                  <td>{m.gender}</td>
                  <td>{m.phoneNo}</td>
                  <td>{m.relationship}</td>
                  <td>{m.age}</td>
                  <td>{m.address}</td>
                  <td>
                    <select className="form-control" value={m.plan} onChange={e => handleMemberPlanChange(idx, e.target.value)}>
                      {m.planOptions.map((p, i) => (
                        <option key={i} value={p.name}>{p.name} - ₹{p.amount}</option>
                      ))}
                    </select>
                  </td>
                  <td>₹{m.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {(applicant || familyMembers.length > 0) && (
        <div className="mt-4">
          <h4>Net Amount: ₹{netAmount}</h4>
          <h5>+ GST (18%): ₹{gst.toFixed(2)}</h5>
          <h4><strong>Total Payable: ₹{totalWithGST.toFixed(2)}</strong></h4>
          <p className="text-muted mt-3">
            💡 <strong>Income Tax Benefit (Sec 80D):</strong> You can claim up to ₹25,000 (₹50,000 for senior citizens) as tax deduction on health insurance premiums.
          </p>
        </div>
      )}
    </div>
  );
};

export default ApplicantForm;
