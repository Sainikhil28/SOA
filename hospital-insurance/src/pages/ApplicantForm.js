import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignJWT } from 'jose';



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

//save in mongodb

 
  
  const [familyMembers, setFamilyMembers] = useState([]);

  const handleApplicantChange = (e) => {
    setApplicant({ ...applicant, [e.target.name]: e.target.value });
  };

  const handleFamilyMemberChange = (index, field, value) => {
    const updated = [...familyMembers];
    updated[index][field] = value;
    setFamilyMembers(updated);
  };

 const handleVerifyApplicantPAN = async () => {
  try {
    const panNumber = applicant.proofId?.trim();
    if (!panNumber) {
      alert("Please enter Proof ID (PAN) first");
      return;
    }

    // Check for duplicate PAN with family members
    const duplicatePAN = familyMembers.some(
      (member) => member.proofId?.trim().toUpperCase() === panNumber.toUpperCase()
    );
    if (duplicatePAN) {
      alert("❌ This PAN is already used by a family member.");
      return;
    }

    const payload = { pan_number: panNumber };
    const secret = new TextEncoder().encode(
      "jAvPqTPwhD_5hD5FRqe1hdtBv2j1IAqO7aOhgl5FfKIs-u0I8M46WkB2AC0ZXBg-3dhiU0g9jqEuvL0ptkgLTg"
    );

    const pan_token = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS512" })
      .sign(secret);

    const accessToken =
      "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzYWkiLCJyb2xlIjoidXNlciJ9.G-PPWtgvtqKVaEmDcTp9BUbCMhQE1fXqPE1IWnpl0kReaXoXz7G3O8Hbfz9w2MwBNNY_PLowhe-auXY3kIV-zQ";

    const response = await fetch(
      `http://192.168.161.3:8000/pancard/validate-sai`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pan_token }),
      }
    );

    const data = await response.json();

    if (response.ok && data.result_token) {
      const tokenParts = data.result_token.split(".");
      const payloadBase64 = tokenParts[1];
      const decodedPayload = JSON.parse(atob(payloadBase64));

      const status = decodedPayload.message;
      const dobString = decodedPayload.date_of_birth || decodedPayload.dob;

      alert(`✅ PAN Status: ${status}`);
      if (dobString) {
        alert(`📅 Date of Birth: ${dobString}`);
      }

      if (status.toLowerCase() === "valid") {
        if (!dobString) {
          alert("⚠️ Date of birth missing in PAN response.");
          return;
        }

        const dob = new Date(dobString);
        const ageDiffMs = Date.now() - dob.getTime();
        const ageDate = new Date(ageDiffMs);
        const age = Math.abs(ageDate.getUTCFullYear() - 1970);

        let plan = "";
        let amount = 0;
        if (age < 30) {
          plan = "Young Saver Plan";
          amount = 2000;
        } else if (age < 60) {
          plan = "Standard Life Plan";
          amount = 3000;
        } else {
          plan = "Senior Care Plan";
          amount = 4000;
        }

        setApplicant((prev) => ({
          ...prev,
          age,
          plan,
          amount,
        }));
      } else {
        alert("❌ PAN is invalid.");
      }
    } else {
      alert(`❌ Verification failed: ${data.error || "Unknown error"}`);
    }
  } catch (err) {
    console.error("PAN verification failed", err);
    alert("Error verifying PAN.");
  }
};

  const handleVerifyFamilyMemberPAN = async (index) => {
  try {
    const member = familyMembers[index];

    // Validate required fields before PAN verification
    if (!member.name.trim()) {
      alert("Please enter the family member's name.");
      return;
    }
    if (!member.gender) {
      alert("Please select gender for the family member.");
      return;
    }
    if (!member.relationship.trim()) {
      alert("Please enter relationship.");
      return;
    }
    if (!member.address.trim()) {
      alert("Please enter address.");
      return;
    }
    if (!member.proofId.trim()) {
      alert("Please enter Proof ID (PAN) for the family member.");
      return;
    }

    // Create signed token
    const payload = { pan_number: member.proofId };
    const secret = new TextEncoder().encode(
      "jAvPqTPwhD_5hD5FRqe1hdtBv2j1IAqO7aOhgl5FfKIs-u0I8M46WkB2AC0ZXBg-3dhiU0g9jqEuvL0ptkgLTg"
    );
    const pan_token = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS512" })
      .sign(secret);

    const accessToken =
      "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzYWkiLCJyb2xlIjoidXNlciJ9.G-PPWtgvtqKVaEmDcTp9BUbCMhQE1fXqPE1IWnpl0kReaXoXz7G3O8Hbfz9w2MwBNNY_PLowhe-auXY3kIV-zQ";

    // Call PAN validation API
    const response = await fetch(
      `http://192.168.161.3:8000/pancard/validate-sai`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pan_token }),
      }
    );

    const data = await response.json();

    if (response.ok && data.result_token) {
      const tokenParts = data.result_token.split(".");
      const payloadBase64 = tokenParts[1];
      const decodedPayload = JSON.parse(atob(payloadBase64));

      const status = decodedPayload.message;
      const dobString = decodedPayload.date_of_birth || decodedPayload.dob;

      alert(`✅ PAN Status: ${status}`);
      alert(`📅 Date of Birth: ${dobString || "Not Available"}`);

      if (status.toLowerCase() === "valid") {
        if (!dobString) {
          alert("⚠️ Date of birth missing in PAN response.");
          return;
        }

        // Calculate age
        const dob = new Date(dobString);
        const ageDiffMs = Date.now() - dob.getTime();
        const ageDate = new Date(ageDiffMs);
        const age = Math.abs(ageDate.getUTCFullYear() - 1970);

        // Decide plan & amount
        let plan = "";
        let amount = 0;
        if (age < 30) {
          plan = "Young Saver Plan";
          amount = 2000;
        } else if (age < 60) {
          plan = "Standard Life Plan";
          amount = 3000;
        } else {
          plan = "Senior Care Plan";
          amount = 4000;
        }

        // Update only this family member
        const updatedMembers = [...familyMembers];
        updatedMembers[index] = {
          ...member,
          age,
          plan,
          amount,
        };
        setFamilyMembers(updatedMembers);
      } else {
        alert("❌ PAN is invalid.");
      }
    } else {
      alert(`❌ Verification failed: ${data.error || "Unknown error"}`);
    }
  } catch (err) {
    console.error("PAN verification failed", err);
    alert("Error verifying PAN.");
  }
};


  const addFamilyMember = () => {
    setFamilyMembers([
      ...familyMembers,
      {
        name: '',
        gender: '',
        relationship: '',
        proofId: '',
        age: '',
        address: '',
        plan: '',
        amount: 0,
      },
    ]);
  };

//   const handleProceed = () => {
//     const terms = `Health Insurance Terms & Conditions:

// Section 80D of the Income Tax Act:
// - Deduction of up to ₹25,000/year for health insurance premiums.
// - Up to ₹50,000/year for senior citizens (age 60+).
// - Includes ₹5,000 for preventive health checkups.

// Click OK to agree and proceed.`;

//     const agreed = window.confirm(terms);
//     if (agreed) {
//       navigate('/summary', {
//         state: {
//           applicant,
//           familyMembers,
//         },
//       });
//     }
//   };


  const handleProceed = async () => {
  const terms = `Health Insurance Terms & Conditions:

Section 80D of the Income Tax Act:
- Deduction of up to ₹25,000/year for health insurance premiums.
- Up to ₹50,000/year for senior citizens (age 60+).
- Includes ₹5,000 for preventive health checkups.

Click OK to agree and proceed.`;

  const agreed = window.confirm(terms);
  if (agreed) {
    try {
      const response = await fetch("http://localhost:5000/api/applicants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...applicant,
          familyMembers,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        //alert("✅ Applicant details saved successfully!");
        navigate("/summary", {
          state: {
            applicant,
            familyMembers,
          },
        });
      } else {
        alert(`❌ Failed to save applicant: ${data.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Error saving applicant:", err);
      alert("❌ Error saving applicant details.");
    }
  }
};


  return (
    <div className="container mt-5">
      <h3>Applicant Insurance Form</h3>

      <div className="card p-3 mb-4">
  <h5>Applicant Details</h5>
  <div className="row mb-2">
    
    {/* Name */}
    <div className="col-md-4">
      <label>
        Name <span className="text-danger">*</span>
      </label>
      <input
        type="text"
        name="name"
        value={applicant.name}
        onChange={handleApplicantChange}
        placeholder="Enter full name"
        className="form-control"
        required
      />
    </div>

    {/* Gender */}
    <div className="col-md-4">
      <label>
        Gender <span className="text-danger">*</span>
      </label>
      <select
        name="gender"
        value={applicant.gender}
        onChange={handleApplicantChange}
        className="form-control"
        required
      >
        <option value="">Select</option>
        <option>Male</option>
        <option>Female</option>
        <option>Other</option>
      </select>
    </div>

    {/* Proof ID */}
    <div className="col-md-4">
      <label>
        Proof ID (PAN) <span className="text-danger">*</span>
      </label>
      <input
        type="text"
        name="proofId"
        value={applicant.proofId}
        onChange={handleApplicantChange}
        placeholder="Enter PAN number"
        className="form-control"
        required
      />
    </div>

    {/* Address */}
    <div className="col-md-12 mt-2">
      <label>
        Address <span className="text-danger">*</span>
      </label>
      <input
        type="text"
        name="address"
        value={applicant.address}
        onChange={handleApplicantChange}
        placeholder="Enter full address"
        className="form-control"
        required
      />
    </div>
  </div>

  {/* Verify Button */}
  <button
    onClick={handleVerifyApplicantPAN}
    className="btn btn-warning mb-3"
  >
    Verify
  </button>
        {applicant.age && (
          <>
            <p><strong>Age:</strong> {applicant.age}</p>
            <p><strong>Address:</strong> {applicant.address}</p>
            <p><strong>Suggested Plan:</strong> {applicant.plan}</p>
            <p><strong>Amount:</strong> ₹{applicant.amount}</p>
          </>
        )}
      </div>

      <div className="card p-3 mb-4">
  <h5>Family Members</h5>
  {familyMembers.map((member, index) => (
    <div key={index} className="border p-3 mb-3">
      <div className="row mb-2">
        
        {/* Name */}
        <div className="col-md-3">
          <label>Name <span className="text-danger">*</span></label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter full name"
            value={member.name}
            onChange={(e) =>
              handleFamilyMemberChange(index, 'name', e.target.value)
            }
          />
        </div>

        {/* Gender */}
        <div className="col-md-2">
          <label>Gender <span className="text-danger">*</span></label>
          <select
            className="form-control"
            value={member.gender}
            onChange={(e) =>
              handleFamilyMemberChange(index, 'gender', e.target.value)
            }
          >
            <option value="">Select</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>

        {/* Relationship */}
        <div className="col-md-2">
          <label>Relationship <span className="text-danger">*</span></label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g., Spouse, Son"
            value={member.relationship}
            onChange={(e) =>
              handleFamilyMemberChange(index, 'relationship', e.target.value)
            }
          />
        </div>

        {/* Proof ID */}
        <div className="col-md-2">
          <label>Proof ID (PAN) <span className="text-danger">*</span></label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter PAN number"
            value={member.proofId}
            onChange={(e) =>
              handleFamilyMemberChange(index, 'proofId', e.target.value)
            }
          />
        </div>

        {/* Address */}
        <div className="col-md-3">
          <label>Address <span className="text-danger">*</span></label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter full address"
            value={member.address}
            onChange={(e) =>
              handleFamilyMemberChange(index, 'address', e.target.value)
            }
          />
        </div>

        {/* Verify Button */}
        <div className="col-md-12 mt-2 d-flex justify-content-end">
          <button
            onClick={() => handleVerifyFamilyMemberPAN(index)}
            className="btn btn-warning"
          >
            Verify
          </button>
        </div>
      </div>

      {/* Verified Details */}
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

  {/* Add Member Button */}
  <button onClick={addFamilyMember} className="btn btn-outline-success">
    + Add Family Member
  </button>
</div>


      <div className="text-end">
        <button className="btn btn-success" onClick={handleProceed}>
          Proceed
        </button>
      </div>
    </div>
  );
};

export default ApplicantForm;
