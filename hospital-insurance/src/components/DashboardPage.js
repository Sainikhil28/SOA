// src/components/DashboardPage.js
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const DashboardPage = () => {
  const [searchName, setSearchName] = useState('');
  const [applicant, setApplicant] = useState(null);
  const [error, setError] = useState('');
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [claimForm, setClaimForm] = useState({
    insuranceHistory: {},
    insuredPerson: {},
    hospitalizationDetails: {},
    claimDetails: {},
    documents: [],
  });

  // 🔹 Load Test State
  const [loadError, setLoadError] = useState('');
  const [activeUsers, setActiveUsers] = useState(0);

  // Register/unregister user for load test
  useEffect(() => {
    const enter = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/loadtest/start', {
          method: 'POST',
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setActiveUsers(data.activeUsers);
      } catch (err) {
        setLoadError(err.message);
      }
    };

    enter();

    return async () => {
      try {
        await fetch('http://localhost:5000/api/loadtest/end', { method: 'POST' });
      } catch (err) {
        console.error('Error unregistering load test user:', err);
      }
    };
  }, []);

  const fetchApplicant = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/applicants/${searchName}`);
      if (!response.ok) throw new Error('Applicant not found');
      const data = await response.json();
      setApplicant(data);
      setError('');
    } catch (err) {
      setError(err.message);
      setApplicant(null);
    }
  };

  const handleClaim = () => {
    setShowClaimForm(true);
  };

  const handleClaimInput = (section, field, value) => {
    setClaimForm((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const handleDocumentToggle = (doc) => {
    setClaimForm((prev) => {
      const docs = prev.documents.includes(doc)
        ? prev.documents.filter((d) => d !== doc)
        : [...prev.documents, doc];
      return { ...prev, documents: docs };
    });
  };

  const calculateTotal = () => {
    const c = claimForm.claimDetails || {};
    return (
      (parseFloat(c.preHospitalization) || 0) +
      (parseFloat(c.hospitalization) || 0) +
      (parseFloat(c.postHospitalization) || 0) +
      (parseFloat(c.ambulanceCharges) || 0) +
      (parseFloat(c.healthCheckup) || 0) +
      (parseFloat(c.others) || 0)
    );
  };

  const submitClaimForm = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        policyNumber: applicant.policyNumber,
        applicantName: applicant.name,
        applicantAge: applicant.age,
        applicantAddress: applicant.address,
        ...claimForm,
        claimDetails: { ...claimForm.claimDetails, total: calculateTotal() },
      };

      const response = await fetch('http://localhost:5000/api/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        // update claim count now
        const updateRes = await fetch(
          `http://localhost:5000/api/applicants/${applicant.name}/claim`,
          { method: 'POST' }
        );
        const updated = await updateRes.json();
        setApplicant(updated.applicant);

        alert('✅ Claim form submitted successfully!');
        setShowClaimForm(false);
      } else {
        alert(data.message || 'Error submitting claim form');
      }
    } catch (err) {
      console.error('❌ Error submitting claim form:', err);
    }
  };

  const getPlanColor = (plan) => {
    if (plan === 'Young Saver Plan') return '#4caf50';
    if (plan === 'Standard Life Plan') return '#2196f3';
    if (plan === 'Senior Care Plan') return '#f44336';
    return '#9e9e9e';
  };

  const claimDocuments = [
    'Claim form duly signed',
    'Copy of the claim intimation, if any',
    'Hospital Main Bill',
    'Hospital Break-up Bill',
    'Hospital Bill Payment Receipt',
    'Hospital Discharge Summary',
    'Pharmacy Bill',
    'Operation Theater Notes',
    'ECG',
    'Doctor’s request for investigation',
    'Investigation Reports (Including CT / MRI / USG / HPE)',
    'Doctor’s Prescriptions',
    'Others',
  ];

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Dashboard</h2>

      {/* 🔹 Load Test Alert */}
      {loadError && <div className="alert alert-danger">{loadError}</div>}
      {!loadError && (
        <div className="alert alert-info text-center">
          👥 Active Users: {activeUsers} / 15
        </div>
      )}

      {/* Search */}
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by Name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <button className="btn btn-primary" onClick={fetchApplicant}>
          Search
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {applicant && (
        <div className="card shadow p-4">
          <h4>Applicant Details</h4>
          <ul className="list-group mb-3">
            <li className="list-group-item"><b>Name:</b> {applicant.name}</li>
            <li className="list-group-item"><b>Gender:</b> {applicant.gender}</li>
            <li className="list-group-item"><b>Age:</b> {applicant.age}</li>
            <li className="list-group-item"><b>Address:</b> {applicant.address}</li>
            <li className="list-group-item">
              <b>Plan:</b>{' '}
              <span style={{ color: getPlanColor(applicant.plan), fontWeight: 'bold' }}>
                {applicant.plan}
              </span>
            </li>
            <li className="list-group-item"><b>Amount:</b> ₹{applicant.amount}</li>
            <li className="list-group-item"><b>Policy Number:</b> {applicant.policyNumber || 'Not Assigned'}</li>
          </ul>

          {applicant.claimStatus && (
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart
                  data={[
                    { status: 'Pending', count: applicant.claimStatus.pending || 0 },
                    { status: 'Approved', count: applicant.claimStatus.approved || 0 },
                    { status: 'Rejected', count: applicant.claimStatus.rejected || 0 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill={getPlanColor(applicant.plan)} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          <button className="btn btn-success mt-3" onClick={handleClaim}>
            Claim Insurance
          </button>
        </div>
      )}

      {/* Claim Form */}
            {showClaimForm && (
        <div className="mt-4 card p-4 shadow">
          <h5 className="mb-3">Insurance Claim Form</h5>
          <form onSubmit={submitClaimForm}>
            {/* Insurance History */}
            <h6>Details of Insurance History</h6>
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Currently covered by any other Mediclaim / Health Insurance"
              onChange={(e) => handleClaimInput('insuranceHistory', 'otherCoverage', e.target.value)}
            />
            <h6>Date of commencement of first Insurance</h6>
            <input
              type="date"
              className="form-control mb-2"
              placeholder="Date of commencement of first Insurance"
              onChange={(e) => handleClaimInput('insuranceHistory', 'firstInsuranceDate', e.target.value)}
            />
            <h6>Insurance Company Name</h6>
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Company Name"
              onChange={(e) => handleClaimInput('insuranceHistory', 'companyName', e.target.value)}
            />
            <h6>Policy No</h6>
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Policy No."
              onChange={(e) => handleClaimInput('insuranceHistory', 'otherPolicyNo', e.target.value)}
            />
            <h6>Sum Insured Rs.</h6>
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Sum Insured (Rs.)"
              onChange={(e) => handleClaimInput('insuranceHistory', 'sumInsured', e.target.value)}
            />
            <h6>Hospitalized in last 4 years?</h6>
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Hospitalized in last 4 years?"
              onChange={(e) => handleClaimInput('insuranceHistory', 'hospitalizedLast4Years', e.target.value)}
            />
            <h6>Diagnosis</h6>
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Diagnosis"
              onChange={(e) => handleClaimInput('insuranceHistory', 'diagnosis', e.target.value)}
            />
            <h6>Previously covered by any other Mediclaim</h6>
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Previously covered by any other Mediclaim"
              onChange={(e) => handleClaimInput('insuranceHistory', 'previouslyCovered', e.target.value)}
            />

            {/* Insured Person */}
            <h6 className="mt-3">Details of Insured Person Hospitalized</h6>
            <br></br>
            <h6>Applicant Name</h6>
            <input type="text" className="form-control mb-2" value={applicant.name} readOnly />
            <h6>Applicant Age</h6>
            <input type="number" className="form-control mb-2" value={applicant.age} readOnly />
            <h6>Applicant Address</h6>
            <input type="text" className="form-control mb-2" value={applicant.address} readOnly />
            <h6>Phone Number</h6>
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Phone Number"
              onChange={(e) => handleClaimInput('insuredPerson', 'phone', e.target.value)}
            />
            <h6>Applicant Proof ID</h6>
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Proof ID"
              onChange={(e) => handleClaimInput('insuredPerson', 'proofId', e.target.value)}
            />
            <h6>Applicant Email ID</h6>
            <input
              type="email"
              className="form-control mb-2"
              placeholder="Email ID"
              onChange={(e) => handleClaimInput('insuredPerson', 'email', e.target.value)}
            />
            <h6>InsuredPerson Relationship</h6>
            <select
              className="form-control mb-2"
              onChange={(e) => handleClaimInput('insuredPerson', 'relationship', e.target.value)}
            >
              <option>SELF</option>
              <option>SPOUSE</option>
              <option>CHILD</option>
              <option>FATHER</option>
              <option>MOTHER</option>
              <option>OTHER</option>
            </select>
            <h6>InsuredPerson Occupation</h6>
            <select
              className="form-control mb-2"
              onChange={(e) => handleClaimInput('insuredPerson', 'occupation', e.target.value)}
            >
              <option>Service</option>
              <option>Self employed</option>
              <option>Home maker</option>
              <option>Retired</option>
              <option>Other</option>
            </select>
            <h6>InsuredPerson Pincode</h6>
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Pincode"
              onChange={(e) => handleClaimInput('insuredPerson', 'pincode', e.target.value)}
            />

            {/* Hospitalization */}
            <h6 className="mt-3">Details of Hospitalization</h6>
            <h6>Hospital Name</h6>
            <input
              type="text"
              placeholder="Hospital Name"
              className="form-control mb-2"
              onChange={(e) => handleClaimInput('hospitalizationDetails', 'hospitalName', e.target.value)}
            />
            <h6>Hospital RoomCategory</h6>
            <select
              className="form-control mb-2"
              onChange={(e) => handleClaimInput('hospitalizationDetails', 'roomCategory', e.target.value)}
            >
              <option>Day care</option>
              <option>Single occupancy</option>
              <option>Twin sharing</option>
              <option>3 or more beds per room</option>
            </select>
            <h6>Hospitalization Cause</h6>
            <select
              className="form-control mb-2"
              onChange={(e) => handleClaimInput('hospitalizationDetails', 'cause', e.target.value)}
            >
              <option>Injury</option>
              <option>Illness</option>
              <option>Maternity</option>
            </select>
            <h6>Hospitalization DetectedDate</h6>
            <input
              type="date"
              className="form-control mb-2"
              onChange={(e) => handleClaimInput('hospitalizationDetails', 'detectedDate', e.target.value)}
            />
            <h6>Hospitalization AdmissionDate</h6>
            <input
              type="date"
              className="form-control mb-2"
              onChange={(e) => handleClaimInput('hospitalizationDetails', 'admissionDate', e.target.value)}
            />
            <h6>Hospitalization AdmissionTime</h6>
            <input
              type="time"
              className="form-control mb-2"
              onChange={(e) => handleClaimInput('hospitalizationDetails', 'admissionTime', e.target.value)}
            />
            <h6>Hospitalization DischargeDate</h6>
            <input
              type="date"
              className="form-control mb-2"
              onChange={(e) => handleClaimInput('hospitalizationDetails', 'dischargeDate', e.target.value)}
            />
            <h6>Hospitalization DischargeTime</h6>
            <input
              type="time"
              className="form-control mb-2"
              onChange={(e) => handleClaimInput('hospitalizationDetails', 'dischargeTime', e.target.value)}
            />
            <h6>Hospitalization InjuryCause</h6>
            <select
              className="form-control mb-2"
              onChange={(e) => handleClaimInput('hospitalizationDetails', 'injuryCause', e.target.value)}
            >
              <option>If Injury cause</option>
              <option>Self inflicted</option>
              <option>Road accident</option>
              <option>Alcohol consumption</option>
            </select>

            {/* Claim Details */}
            <h6 className="mt-3">Claim Details</h6>
            <h6>Hospitalization Amount details</h6>
            {['preHospitalization', 'hospitalization', 'postHospitalization', 'ambulanceCharges', 'healthCheckup', 'others'].map((field) => (
              <input
                key={field}
                type="number"
                placeholder={field}
                className="form-control mb-2"
                onChange={(e) => handleClaimInput('claimDetails', field, e.target.value)}
              />
            ))}
            <div className="alert alert-info">Total: ₹{calculateTotal()}</div>

            {/* Documents */}
            <h6>Claim Documents Submitted</h6>
            {claimDocuments.map((doc) => (
              <div key={doc} className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={claimForm.documents.includes(doc)}
                  onChange={() => handleDocumentToggle(doc)}
                />
                <label className="form-check-label">{doc}</label>
              </div>
            ))}

            <button type="submit" className="btn btn-primary w-100 mt-3">
              Submit Claim Form
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
