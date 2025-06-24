import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const CuraShield = () => {
   const [activeTab, setActiveTab] = useState('advantages');
  const navigate = useNavigate();

  const highlights = [
    { title: 'Unique Cover', desc: 'Policy for 50+ with no max age limit.' },
    { title: 'Long-Term Discount', desc: 'Discount on premium for >1 year term.' },
    { title: 'Outpatient Expenses', desc: 'Covered from day 1 up to limit.' },
    { title: 'Automatic Restoration', desc: '100% sum insured restored during period.' },
    { title: 'Wellness Program', desc: 'Earn health rewards and get discounts.' },
    { title: 'E-Pharmacy', desc: 'Discounted meds in 2780 cities.' }
  ];

  const importantHighlights = [
    ['Sum Insured', '₹5 Lakhs'],
    ['Room Type', 'AC / Non-AC'],
    ['Diseases Covered', 'Cardiology, Neurology, Radiology'],
    ['Age Limit', '50+ with no upper age limit'],
    ['Policy Term', '1 to 3 years with renewal option'],
    ['Pre & Post Hospitalization', 'Yes, with limits']
  ];

  const tabs = {
    advantages: [
      'Wellness Program - Earn rewards and discounts.',
      'Diagnostic Centres - 1635+ centers with home pickup.',
      'E-Pharmacy - Discounted medicines in 2780 cities.'
    ],
    claims: [
      '24*7 Customer Service - 1800-425-2255.',
      'In-house Claim Settlement - No TPAs.',
      '92% claims settled in 7 days (Reimbursement), 2 hrs (Cashless).'
    ],
    hospitals: [
      'Wide Network - 12,000+ hospitals.',
      'Cashless Hospitalization - Available.',
      'Agreed & Network Providers for Quality Treatment.'
    ]
  };

  return (
    <div className="container mt-5 mb-5">
   
  <style>{`
  .choose-card {
    border: 1px solid #dee2e6;
    transition: transform 0.3s ease, background-color 0.3s ease, color 0.3s ease;
  }

  .choose-card:hover {
    transform: scale(1.03);
    background-color:rgb(0, 124, 249) !important;
    color: white !important;
  }

  .choose-card:hover .card-title,
  .choose-card:hover .card-text,
  .choose-card:hover .text-muted {
    color: white !important;
  }
`}</style>


      {/* Header */}
      <div className="row mb-4">
        <div className="col-md-8">
          <h2 className="mb-3">CuraShield</h2>
          <p className="text-justify">
           We offer a variety of health plans enabling cashless treatment at 21700+ network hospitals and healthcare providers. Our health insurance plans include comprehensive coverage for modern and traditional treatments from AYUSH to robotic surgery and radiosurgery. Additionally, our travel insurance provides extensive coverage, protecting you against unexpected events and ensuring peace of mind during your journeys.
          </p>
        </div>
        <div className="col-md-4 text-end">
          <img
            src="https://assets-wp-cdn.onsurity.com/wp/wp-content/uploads/2024/12/06170641/health-insurance-plans-for-family.webp"
            alt="Health Insurance"
            className="img-fluid rounded"
            style={{ maxHeight: '260px', objectFit: 'cover' }}
          />
        </div>
      </div>

      {/* Highlights */}
      <div className="row text-center mb-5">
        {highlights.map((item, index) => (
          <div key={index} className="col-md-4 mb-4">
            <div className="shadow-sm p-4 bg-light rounded h-100">
              <img
                src="https://cdn-icons-png.flaticon.com/128/15394/15394985.png"
                alt="highlight icon"
                style={{ width: '40px', height: '40px' }}
              />
              <h5 className="text-primary mt-3">{item.title}</h5>
              <p>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed List */}
      <h4 className="text-center mt-5 mb-2">DETAILED LIST</h4>
      <p className="text-center mb-4">
        Understand what’s included and then SafePulse Health.
      </p>

      {/* Why Choose Cards */}
      <h4 className="text-center mb-4">Why Choose SafePulse Health?</h4>
      <div className="text-center mb-3">
        <button className={`btn btn-outline-primary me-2 ${activeTab === 'advantages' ? 'active' : ''}`} onClick={() => setActiveTab('advantages')}>Star Advantages</button>
        <button className={`btn btn-outline-primary me-2 ${activeTab === 'claims' ? 'active' : ''}`} onClick={() => setActiveTab('claims')}>Claims</button>
        <button className={`btn btn-outline-primary ${activeTab === 'hospitals' ? 'active' : ''}`} onClick={() => setActiveTab('hospitals')}>Hospitals</button>
      </div>

      <div className="row text-center mb-4">
        {tabs[activeTab].map((item, idx) => (
          <div key={idx} className="col-md-4 mb-4">
            <div className="card choose-card h-100 p-3">
              <img
                src="https://cdn-icons-png.flaticon.com/128/1055/1055646.png"
                alt="benefit"
                className="mx-auto"
                style={{ width: '60px', height: '60px' }}
              />
              <div className="card-body">
                <p className="card-text">{item}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Apply Button */}
      <div className="text-center mb-5">
        <button className="btn btn-success px-5" onClick={() => navigate('/admin/apply-policy')}>
          Apply Now
        </button>
      </div>

      {/* Important Highlights */}
      <h4 className="text-center mb-3">IMPORTANT HIGHLIGHTS</h4>
      <table className="table table-bordered">
        <tbody>
          {importantHighlights.map(([label, value], idx) => (
            <tr key={idx}>
              <th>{label}</th>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Tariff & Quotes */}
      <h4 className="text-center mt-5 mb-3">Insurance Tariff & Quotes</h4>
      <div className="row text-center mb-5">
        {[
          {
            title: 'Basic Plan',
            text: '₹10,000/year for ₹5 Lakhs coverage',
            note: 'Best for individuals aged 50–60'
          },
          {
            title: 'Family Floater',
            text: '₹25,000/year for ₹10 Lakhs coverage',
            note: 'Includes 2 adults + 2 children'
          },
          {
            title: 'Premium Plan',
            text: '₹40,000/year for ₹20 Lakhs coverage',
            note: 'With wellness and e-pharmacy benefits'
          }
        ].map((plan, idx) => (
          <div key={idx} className="col-md-4 mb-3">
            <div className="card choose-card h-100 p-3">
              <div className="card-body">
                <h5 className="card-title">{plan.title}</h5>
                <p className="card-text">{plan.text}</p>
                <p className="text-muted">{plan.note}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Help Center */}
      <div className="bg-light p-4 mt-5 rounded shadow-sm">
        <h4 className="mb-3">CuraShield</h4>
        <p>For help, contact our support center:</p>
        <p><strong>Phone:</strong> 1800-425-2255</p>
        <p><strong>Email:</strong> support@safepulse.com</p>
      </div>

      <Link to="/admin" className="btn btn-secondary mt-4">← Back to Dashboard</Link>
    </div>
  );
};

export default CuraShield;
