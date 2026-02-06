const express = require('express');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// All user routes require authentication
router.use(authenticateJWT);

// Get current user profile
router.get('/me', async (req, res) => {
  res.json({ 
    message: 'Get user profile endpoint',
    userId: req.user.userId,
    role: req.user.role,
  });
});

// Update user profile
router.put('/me', async (req, res) => {
  res.json({ 
    message: 'Update user profile endpoint',
    todo: 'Implementation in next phase'
  });
});

module.exports = router;