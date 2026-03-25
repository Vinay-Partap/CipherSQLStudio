const express = require('express');
const router = express.Router();
const { getDB } = require('../config/database');

router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const assignments = await db.collection('assignments').find({}).toArray();
    const formatted = assignments.map((a, index) => ({
      id: index + 1,
      ...a,
    }));
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;