const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const policyRoutes = require('./routes/policyRoutes');
const proofRoutes = require('./routes/proofRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// Mount routes
app.use('/api/policies', policyRoutes);
app.use('/api/proof', proofRoutes); // NOTE: Changed to singular 'proof' for correct matching


// --- Payment Schema ---
const paymentSchema = new mongoose.Schema({
  txId: String,
  reference: String,
  merchant: String,
  accountNumber: String,
  ifsc: String,
  amount: Number,
  status: String,
  timestamp: String,
  receipt: Object,           // store receipt data
});

const Payment = mongoose.model("Payment", paymentSchema);

// --- Applicant Schema ---
const applicantSchema = new mongoose.Schema({
  name: String,
  gender: String,
  age: Number,
  address: String,
  plan: String,
  amount: Number,
  gst: Number,
  total: Number,
  familyMembers: Array,      // store all family members
  policyNumber: { type: String },   // new field for policy number
  claimStatus: {
    pending: { type: Number, default: 0 },
    approved: { type: Number, default: 0 },
    rejected: { type: Number, default: 0 },
    lastStatus: { type: String, default: "none" } // track last request
  }
});

const Applicant = mongoose.model("Applicant", applicantSchema);

// --- Routes ---
app.post("/api/payments", async (req, res) => {
  try {
    if (req.body.status !== "success") {
      return res.status(400).json({ message: "Payment not successful" });
    }
    const payment = new Payment(req.body);
    await payment.save();
    res.json({ message: "✅ Payment saved", payment });
  } catch (err) {
    console.error("❌ Error saving payment:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/applicants", async (req, res) => {
  try {
    const applicant = new Applicant(req.body);
    await applicant.save();
    res.json({ message: "✅ Applicant saved", applicant });
  } catch (err) {
    console.error("❌ Error saving applicant:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// --- Fetch applicant by name ---
app.get("/api/applicants/:name", async (req, res) => {
  try {
    const applicant = await Applicant.findOne({ name: req.params.name });
    if (!applicant) {
      return res.status(404).json({ message: "Applicant not found" });
    }
    res.json(applicant);
  } catch (err) {
    console.error("❌ Error fetching applicant:", err.message);
    res.status(500).json({ error: err.message });
  }
});


// --- Claim Route ---
app.post("/api/applicants/:name/claim", async (req, res) => {
  try {
    const applicant = await Applicant.findOne({ name: req.params.name });
    if (!applicant) {
      return res.status(404).json({ message: "Applicant not found" });
    }

    // Generate policy number if not exists
    if (!applicant.policyNumber) {
      applicant.policyNumber = "POL" + Math.floor(100000 + Math.random() * 900000);
    }

    // Increment pending claim
    applicant.claimStatus.pending += 1;
    applicant.claimStatus.lastStatus = "requested";

    await applicant.save();

    res.json({ message: "✅ Claim requested", applicant });
  } catch (err) {
    console.error("❌ Error updating claim:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// --- Claim Schema ---
const claimSchema = new mongoose.Schema({
  policyNumber: { type: String, required: true },
  applicantName: String,
  applicantAge: Number,
  applicantAddress: String,
  applicantPhone: String,
  applicantEmail: String,
  proofId: String,
  relationship: String,
  occupation: String,
  pincode: String,

  insuranceHistory: {
    otherCoverage: String,
    firstInsuranceDate: String,
    companyName: String,
    otherPolicyNo: String,
    sumInsured: String,
    hospitalizedLast4Years: String,
    diagnosis: String,
    previouslyCovered: String
  },

  hospitalizationDetails: {
    hospitalName: String,
    roomCategory: String,
    cause: String,
    detectedDate: String,
    admissionDate: String,
    admissionTime: String,
    dischargeDate: String,
    dischargeTime: String,
    injuryCause: String,
    medicoLegal: String,
    reportedToPolice: String,
    policeReportAttached: String,
    systemOfMedicine: String
  },

  claimDetails: {
    preHospitalization: Number,
    hospitalization: Number,
    postHospitalization: Number,
    ambulanceCharges: Number,
    healthCheckup: Number,
    others: Number,
    total: Number,
    preHospDays: Number,
    postHospDays: Number,
    domiciliary: String,
    dailyCash: Number,
    surgicalCash: Number,
    criticalIllness: Number,
    convalescence: Number,
    lumpSumOthers: Number,
    lumpSumTotal: Number
  },

  documents: [String], // checklist of submitted docs

  createdAt: { type: Date, default: Date.now }
});

const Claim = mongoose.model("Claim", claimSchema);

// --- Save Claim Form ---
app.post("/api/claims", async (req, res) => {
  try {
    const claim = new Claim(req.body);
    await claim.save();
    res.json({ message: "✅ Claim form submitted", claim });
  } catch (err) {
    console.error("❌ Error saving claim form:", err.message);
    res.status(500).json({ error: err.message });
  }
});

//load test
// Track active users
let activeUsers = 0;
const MAX_USERS = 15;

app.post("/api/loadtest/start", (req, res) => {
  if (activeUsers >= MAX_USERS) {
    return res.status(429).json({ message: "🚫 Load limit exceeded! Only 15 users allowed." });
  }
  activeUsers++;
  res.json({ message: "✅ User entered dashboard", activeUsers });
});

app.post("/api/loadtest/end", (req, res) => {
  if (activeUsers > 0) activeUsers--;
  res.json({ message: "👋 User left dashboard", activeUsers });
});

app.get("/api/loadtest/status", (req, res) => {
  res.json({ activeUsers, maxUsers: MAX_USERS });
});



// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
