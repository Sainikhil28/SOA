const express = require('express');
const router = express.Router();
const Proof = require('../models/proof');

// Age calculator
const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const diff = Date.now() - birthDate.getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

// GET - Fetch age and address by proofId
router.get('/:proofId', async (req, res) => {
  try {
    const proof = await Proof.findOne({ proofId: req.params.proofId });

    if (!proof) {
      return res.status(404).send({ error: 'Proof not found' });
    }

    const age = calculateAge(proof.dateOfBirth);

    res.send({
      age: age,
      address: proof.address
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
