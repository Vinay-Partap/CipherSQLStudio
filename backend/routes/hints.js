const express = require('express');
const router = express.Router();
const { getDB } = require('../config/database');
const { generateHint } = require('../services/llmService');

router.post('/', async (req, res) => {
  try {
    const { assignmentId, query, errorMessage, hintLevel } = req.body;

    if (!assignmentId) {
      return res.status(400).json({ error: 'Missing assignmentId' });
    }

    const db = getDB();
    const assignments = await db.collection('assignments').find({}).toArray();
    const assignment = assignments[Number(assignmentId) - 1];

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    const level = Math.min(Math.max(parseInt(hintLevel) || 1, 1), 3);
    const hint = await generateHint(assignment, query, errorMessage, level);
    res.json({ hint, level });

  } catch (error) {
    console.error('Hint error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;