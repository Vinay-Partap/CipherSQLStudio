const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const { getCollection } = require('../config/database');
const { generateHint } = require('../services/llmService');

router.post('/', async (req, res) => {
  try {
    const { assignmentId, query, errorMessage } = req.body;
    
    if (!assignmentId) {
      return res.status(400).json({ error: 'Missing assignmentId' });
    }
    
    // Get assignment
    const assignments = getCollection('assignments');
    const assignment = await assignments.findOne({ _id: new ObjectId(assignmentId) });
    
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