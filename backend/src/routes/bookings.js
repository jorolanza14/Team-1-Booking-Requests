const express = require('express');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// All booking routes require authentication
router.use(authenticateJWT);

// Get all bookings (user sees their own, staff/admin see all)
router.get('/', async (req, res) => {
  res.json({ 
    message: 'Get bookings endpoint',
    todo: 'Implementation in next phase'
  });
});

// Create new booking
router.post('/', async (req, res) => {
  res.json({ 
    message: 'Create booking endpoint',
    todo: 'Implementation in next phase'
  });
});

module.exports = router;