const express = require('express');
const router = express.Router();
const { getDB } = require('../config/database');
const { executeUserQuery } = require('../services/postgresService');

router.post('/', async (req, res) => {
  try {
    const { assignmentId, query, sessionId } = req.body;

    if (!assignmentId || !query || !sessionId) {
      return res.status(400).json({ error: 'Missing assignmentId, query, or sessionId' });
    }

    // Get all assignments and find by index-based id
    const db = getDB();
    const assignments = await db.collection('assignments').find({}).toArray();
    const assignment = assignments[Number(assignmentId) - 1];

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // Execute in sandbox
    const result = await executeUserQuery(sessionId, assignment, query);
    res.json(result);

  } catch (error) {
    console.error('Execution error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;