import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Summary = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { applicant = {}, familyMembers: initialFamilyMembers = [] } = state || {};

  const gstRate = 0.18;

  const calculateGST = (amount) => +(amount * gstRate).toFixed(2);

  const applicantGST = calculateGST(applicant.amount || 0);
  const applicantTotalWithGST = (applicant.amount || 0) + applicantGST;

  const [familyDetails, setFamilyDetails] = useState(
    initialFamilyMembers.map((member, index) => {
      const gst = calculateGST(member.amount);
      const total = member.amount + gst;
      return { ...member, gst, total, id: index };
    })
  );

  const handleEdit = (id) => {
    const memberToEdit = familyDetails.find((m) => m.id === id);
    navigate('/edit-family-member', { state: { member: memberToEdit, applicant } });
  };

  const handleDelete = (id) => {
    const updatedMembers = familyDetails.filter((m) => m.id !== id);
    setFamilyDetails(updatedMembers);
  };

  const familyTotal = familyDetails.reduce((sum, member) => sum + member.total, 0);
  const grandTotal = +(applicantTotalWithGST + familyTotal).toFixed(2);

  const generatePDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text('Insurance Purchase Summary', 14, 20);

    // Applicant Table
    autoTable(doc, {
      startY: 30,
      head: [['Field', 'Value']],
      body: [
        ['Name', applicant.name],
        ['Gender', applicant.gender],
        ['Age', applicant.age],
        ['Address', applicant.address],
        ['Plan', applicant.plan],
        ['Base Amount (₹)', applicant.amount],
        ['GST (18%) (₹)', applicantGST],
        ['Total with GST (₹)', applicantTotalWithGST],
      ],
      styles: { fontSize: 10 },
      headStyles: { fillColor: [52, 58, 64] },
    });

    // Family Table
    if (familyDetails.length > 0) {
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10,
        head: [[
          'Name', 'Gender', 'Relationship', 'Age',
          'Address', 'Plan', 'Base (₹)', 'GST (₹)', 'Total (₹)'
        ]],
        body: familyDetails.map(m => [
          m.name, m.gender, m.relationship, m.age,
          m.address, m.plan, m.amount, m.gst, m.total
        ]),
        styles: { fontSize: 9 },
        headStyles: { fillColor: [23, 162, 184] },
      });
    }

    // Total
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(
      `Total Insurance Plan Amount for Entire Family (Including GST): ₹${grandTotal}`,
      14,
      doc.lastAutoTable.finalY + 12
    );

    // Page 2 – Benefits + Terms
    doc.addPage();

    doc.setFontSize(14);
    doc.text('Benefits of Your Insurance Plan', 14, 20);
    doc.setFontSize(11);
    doc.text('- Comprehensive coverage for hospitalization, surgery, and critical illness.', 14, 30);
    doc.text('- Cashless treatment in partner hospitals.', 14, 38);
    doc.text('- No-claim bonus and annual health checkups.', 14, 46);

    doc.setFontSize(14);
    doc.text('How to Claim Insurance', 14, 60);
    doc.setFontSize(11);
    doc.text('- Visit nearest network hospital or use online claim portal.', 14, 70);
    doc.text('- Submit necessary documents and policy number.', 14, 78);
    doc.text('- Track claim status via mobile app or support line.', 14, 86);

    doc.setFontSize(14);
    doc.text('Contact Us', 14, 100);
    doc.setFontSize(11);
    doc.text('Customer Care: 1800-123-4567', 14, 110);
    doc.text('Email: support@insureplus.com', 14, 118);
    doc.text('Website: www.insureplus.com', 14, 126);

    doc.setFontSize(14);
    doc.text('Terms and Conditions', 14, 140);
    doc.setFontSize(11);
    doc.text('- The applicant confirms that the information provided is accurate.', 14, 150);
    doc.text('- The applicant agrees to the terms, conditions, and privacy policies.', 14, 158);
    doc.text('- Coverage begins post-payment confirmation.', 14, 166);
    doc.text('- Any fraudulent claim will void the policy.', 14, 174);

    doc.setFontSize(12);
    doc.setTextColor(80);
    doc.text(`✔️ Applicant "${applicant.name}" has accepted all terms & conditions.`, 14, 188);

    doc.save('Insurance_Summary.pdf');
  };

  const handlePayNow = () => {
    alert(`Proceeding to payment for ₹${grandTotal}`);
    // Add your payment logic or navigation here
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-4 text-center">Insurance Summary</h3>

      {/* Applicant Info */}
      <div className="card p-3 mb-4">
        <h5 className="mb-3">Applicant Information</h5>
        <table className="table table-bordered">
          <tbody>
            <tr><th>Name</th><td>{applicant.name}</td></tr>
            <tr><th>Gender</th><td>{applicant.gender}</td></tr>
            <tr><th>Age</th><td>{applicant.age}</td></tr>
            <tr><th>Address</th><td>{applicant.address}</td></tr>
            <tr><th>Plan</th><td>{applicant.plan}</td></tr>
            <tr><th>Base Amount</th><td>₹{applicant.amount}</td></tr>
            <tr><th>GST (18%)</th><td>₹{applicantGST}</td></tr>
            <tr><th>Total with GST</th><td><strong>₹{applicantTotalWithGST}</strong></td></tr>
          </tbody>
        </table>
      </div>

      {/* Family Members Info */}
      {familyDetails.length > 0 && (
        <div className="card p-3 mb-4">
          <h5 className="mb-3">Family Members</h5>
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Gender</th>
                <th>Relationship</th>
                <th>Age</th>
                <th>Address</th>
                <th>Plan</th>
                <th>Base</th>
                <th>GST</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {familyDetails.map((member) => (
                <tr key={member.id}>
                  <td>{member.name}</td>
                  <td>{member.gender}</td>
                  <td>{member.relationship}</td>
                  <td>{member.age}</td>
                  <td>{member.address}</td>
                  <td>{member.plan}</td>
                  <td>₹{member.amount}</td>
                  <td>₹{member.gst}</td>
                  <td><strong>₹{member.total}</strong></td>
                  <td>
                    <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(member.id)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(member.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Total and Actions */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5>Total Insurance Plan Amount: <strong>₹{grandTotal}</strong></h5>
        <div>
          <button className="btn btn-success me-2" onClick={generatePDF}>Download PDF</button>
          <button className="btn btn-warning" onClick={handlePayNow}>Pay Now</button>
        </div>
      </div>
    </div>
  );
};

export default Summary;
