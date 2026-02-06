const express = require('express');
const { authenticateJWT } = require('../middleware/auth');

const router = express.Router();

// All intention routes require authentication
router.use(authenticateJWT);

// Get mass intentions
router.get('/', async (req, res) => {
  res.json({ 
    message: 'Get mass intentions endpoint',
    todo: 'Implementation in next phase'
  });
});

// Create mass intention
router.post('/', async (req, res) => {
  res.json({ 
    message: 'Create mass intention endpoint',
    todo: 'Implementation in next phase'
  });
});

module.exports = router;