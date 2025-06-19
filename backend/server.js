const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const policyRoutes = require('./routes/policyRoutes');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/policies', policyRoutes);


mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch(err => console.log(err));

app.use('/api/policies', require('./routes/policyRoutes'));

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
