import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import CryptoJS from "crypto-js";
import axios from "axios"; // ✅ make sure you install axios

const Wrapper = styled.div`
  min-height: 100vh;
  background: #f3f4f6;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

const ReceiptCard = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  max-width: 800px;
  width: 100%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
`;

const Title = styled.h2`
  font-weight: 700;
  color: #16a34a;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const SectionTitle = styled.h4`
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  color: #1f2937;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.3rem;
`;

const Item = styled.p`
  font-size: 1rem;
  margin: 0.4rem 0;
  color: #374151;

  & strong {
    font-weight: 600;
    color: #111827;
  }
`;

export default function PaymentResult() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const encryptedData = params.get("data");
    if (encryptedData) {
      try {
        const secretKey = "12345678901234567890123456789012!"; // MUST match payment gateway
        const decoded = decodeURIComponent(encryptedData);
        const bytes = CryptoJS.AES.decrypt(decoded, secretKey);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);

        if (decrypted) {
          const parsed = JSON.parse(decrypted);
          setDetails(parsed);

          // ✅ Only save if payment was successful
          if (parsed.status === "success") {
            saveToBackend(parsed);
          }
        }
      } catch (err) {
        console.error("❌ Failed to decrypt payment data", err);
      }
    }
  }, [params]);

  const saveToBackend = async (data) => {
  try {
    // 🔗 Use your backend URL (update before deploy)
    const API_BASE = "http://192.168.161.133:5000"; // or your deployed backend URL

    // Save applicant properly
    if (data.applicant) {
      const applicantPayload = {
        name: data.applicant.name,
        gender: data.applicant.gender,
        age: data.applicant.age,
        address: data.applicant.address,
        plan: data.applicant.plan,
        amount: data.applicant.amount,
        gst: data.applicant.gst,
        total: data.applicant.total,
        familyMembers: data.familyDetails || [],
      };

      await axios.post(`${API_BASE}/api/applicants`, applicantPayload);
    }

    // Save payment
    const paymentPayload = {
  txId: data.txId,
  reference: data.reference,
  merchant: data.merchant,
  accountNumber: data.accountNumber,
  ifsc: data.ifsc,
  amount: data.amount,
  status: data.status,
  timestamp: data.timestamp,
  receipt: data,
};
await axios.post(`${API_BASE}/api/payments`, paymentPayload);

    setSaved(true);
    console.log("✅ Payment + Applicant saved to DB");
  } catch (error) {
    console.error("❌ Error saving to backend:", error.response?.data || error.message);
  }
};

  return (
    <Wrapper>
      <ReceiptCard>
        <Title>Payment Receipt</Title>

        {/* Payment Info */}
        <SectionTitle>Payment Details</SectionTitle>
        <Item><strong>Transaction ID:</strong> {details.txId || "N/A"}</Item>
        <Item><strong>Reference:</strong> {details.reference || "N/A"}</Item>
        <Item><strong>Merchant:</strong> {details.merchant || "N/A"}</Item>
        <Item><strong>Account:</strong> {details.accountNumber || "N/A"}</Item>
        <Item><strong>IFSC:</strong> {details.ifsc || "N/A"}</Item>
        <Item><strong>Amount:</strong> ₹{details.amount || 0}</Item>
        <Item><strong>Status:</strong> {details.status || "N/A"}</Item>
        <Item><strong>Timestamp:</strong> {details.timestamp || "N/A"}</Item>

        {saved && (
          <p style={{ color: "green", marginTop: "1rem" }}>
            ✅ Payment successfully saved in database.
          </p>
        )}

        <button className="btn btn-primary mt-4" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </ReceiptCard>
    </Wrapper>
  );
}
