import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PolicyForm = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    policyName: '',
    insurerName: '',
    hospitalTieUp: true,
    ageMin: '',
    ageMax: '',
    diseases: [],
    roomType: '',
    amountCap: '',
    coverageLimit: '',
    validityStart: '',
    validityEnd: ''
  });

  const diseaseOptions = ["Cardiology", "Neurology", "Radiology", "Master Health checkup"];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'hospitalTieUp') {
      const tieUp = value === 'yes';
      setForm({
        ...form,
        hospitalTieUp: tieUp,
        ...(tieUp ? {} : {
          ageMin: '', ageMax: '', diseases: [], roomType: '', amountCap: '',
          coverageLimit: '', validityStart: '', validityEnd: ''
        })
      });
    } else if (name === 'diseases') {
      const newDiseases = checked
        ? [...form.diseases, value]
        : form.diseases.filter((d) => d !== value);
      setForm({ ...form, diseases: newDiseases });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/policies', form);
      alert("Policy Saved!");
      navigate('/admin');
    } catch (error) {
      console.error(error);
      alert("Error saving policy");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Onboard Insurance Policy</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Policy Name</label>
          <input type="text" className="form-control" name="policyName" onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label>Insurer Name</label>
          <input type="text" className="form-control" name="insurerName" onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label>Hospital Tie-Up</label>
          <select className="form-control" name="hospitalTieUp" onChange={handleChange}>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>

        {form.hospitalTieUp && (
          <>
            <div className="mb-3 row">
              <div className="col">
                <label>Age Min</label>
                <input type="number" className="form-control" name="ageMin" onChange={handleChange} />
              </div>
              <div className="col">
                <label>Age Max</label>
                <input type="number" className="form-control" name="ageMax" onChange={handleChange} />
              </div>
            </div>

            <div className="mb-3">
              <label>Diseases Covered</label>
              <div>
                {diseaseOptions.map((disease) => (
                  <div className="form-check form-check-inline" key={disease}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={disease}
                      name="diseases"
                      value={disease}
                      checked={form.diseases.includes(disease)}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor={disease}>
                      {disease}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <label>Room Type</label>
              <select className="form-control" name="roomType" onChange={handleChange}>
                <option value="">Select</option>
                <option value="AC">AC</option>
                <option value="Non AC">Non AC</option>
              </select>
            </div>

            <div className="mb-3">
              <label>Amount Cap (₹)</label>
              <input type="number" className="form-control" name="amountCap" onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label>Coverage Limit (₹)</label>
              <input type="number" className="form-control" name="coverageLimit" onChange={handleChange} />
            </div>

            <div className="mb-3 row">
              <div className="col">
                <label>Validity Start</label>
                <input type="date" className="form-control" name="validityStart" onChange={handleChange} />
              </div>
              <div className="col">
                <label>Validity End</label>
                <input type="date" className="form-control" name="validityEnd" onChange={handleChange} />
              </div>
            </div>
          </>
        )}

        <div className="d-flex justify-content-between">
          <button type="submit" className="btn btn-success">Submit Policy</button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin')}>
            Back to Dashboard
          </button>
        </div>
      </form>
    </div>
  );
};

export default PolicyForm;
