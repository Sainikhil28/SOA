const express = require('express');
const router = express.Router();
const Policy = require('../models/Policy');

// Create a new policy
router.post('/', async (req, res) => {
  try {
    const policy = new Policy(req.body);
    await policy.save();
    res.status(201).send(policy);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Get all policies
router.get('/', async (req, res) => {
  try {
    const policies = await Policy.find();
    res.send(policies);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// GET all policies
router.get('/', async (req, res) => {
  try {
    const policies = await Policy.find();
    res.json(policies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update policy by ID
router.put('/:id', async (req, res) => {
  try {
    const updated = await Policy.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


module.exports = router;

