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

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
