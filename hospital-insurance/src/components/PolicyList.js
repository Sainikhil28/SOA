import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PolicyList = () => {
  const [policies, setPolicies] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const navigate = useNavigate(); // ✅ navigation hook

  const fetchPolicies = async () => {
    const res = await axios.get('http://localhost:5000/api/policies');
    setPolicies(res.data);
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const handleEditClick = (policy) => {
    setEditId(policy._id);
    setEditForm(policy);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/api/policies/${editId}`, editForm);
      setEditId(null);
      fetchPolicies();
      alert("Policy updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Update failed.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Insurance Policy List</h2>
      <table className="table table-bordered mt-3">
        <thead className="table-light">
          <tr>
            <th>Policy Name</th>
            <th>Insurer</th>
            <th>Hospital Tie-Up</th>
            <th>Coverage Limit</th>
            <th>Validity</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {policies.map(policy => (
            <tr key={policy._id}>
              <td>
                {editId === policy._id ? (
                  <input type="text" name="policyName" value={editForm.policyName} onChange={handleChange} />
                ) : (
                  policy.policyName
                )}
              </td>
              <td>
                {editId === policy._id ? (
                  <input type="text" name="insurerName" value={editForm.insurerName} onChange={handleChange} />
                ) : (
                  policy.insurerName
                )}
              </td>
              <td>
                {editId === policy._id ? (
                  <select name="hospitalTieUp" value={editForm.hospitalTieUp ? 'yes' : 'no'} onChange={(e) =>
                    setEditForm({ ...editForm, hospitalTieUp: e.target.value === 'yes' })
                  }>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                ) : (
                  policy.hospitalTieUp ? "Yes" : "No"
                )}
              </td>
              <td>
                {editId === policy._id ? (
                  <input type="number" name="coverageLimit" value={editForm.coverageLimit} onChange={handleChange} />
                ) : (
                  `₹${policy.coverageLimit}`
                )}
              </td>
              <td>
                {editId === policy._id ? (
                  <>
                    <input type="date" name="validityStart" value={editForm.validityStart?.slice(0, 10)} onChange={handleChange} />
                    <input type="date" name="validityEnd" value={editForm.validityEnd?.slice(0, 10)} onChange={handleChange} />
                  </>
                ) : (
                  `${policy.validityStart?.slice(0, 10)} to ${policy.validityEnd?.slice(0, 10)}`
                )}
              </td>
              <td>
                {editId === policy._id ? (
                  <>
                    <button className="btn btn-success btn-sm me-2" onClick={handleSave}>Save</button>
                    <button className="btn btn-secondary btn-sm" onClick={() => setEditId(null)}>Cancel</button>
                  </>
                ) : (
                  <button className="btn btn-primary btn-sm" onClick={() => handleEditClick(policy)}>Edit</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Back to Dashboard Button */}
      <button
        type="button"
        className="btn btn-secondary mt-3"
        onClick={() => navigate('/admin')}
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default PolicyList;
