const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const { getCollection } = require('../config/database');
const { executeUserQuery } = require('../services/postgresService');

router.post('/', async (req, res) => {
  try {
    const { assignmentId, query, sessionId } = req.body;
    
    if (!assignmentId || !query || !sessionId) {
      return res.status(400).json({ error: 'Missing assignmentId, query, or sessionId' });
    }
    
    // Get assignment from MongoDB
    const assignments = getCollection('assignments');
    const assignment = await assignments.findOne({ _id: new ObjectId(assignmentId) });
    
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