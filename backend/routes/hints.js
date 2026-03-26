const express = require('express');
const router = express.Router();
const { getDB } = require('../config/database');
const { generateHint } = require('../services/llmService');

router.post('/', async (req, res) => {
  try {
    const { assignmentId, query, errorMessage } = req.body;

    if (!assignmentId) {
      return res.status(400).json({ error: 'Missing assignmentId' });
    }

    // Get all assignments and find by index-based id
    const db = getDB();
    const assignments = await db.collection('assignments').find({}).toArray();
    const assignment = assignments[Number(assignmentId) - 1];

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // Generate hint
    const hint = await generateHint(assignment, query, errorMessage);
    res.json({ hint });

  } catch (error) {
    console.error('Hint error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;