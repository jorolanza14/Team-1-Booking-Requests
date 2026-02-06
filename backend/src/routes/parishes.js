const express = require('express');
const router = express.Router();
const parishController = require('../controllers/parishController');

// Get all parishes
router.get('/', parishController.getAllParishes);

// Get parish by ID
router.get('/:id', parishController.getParishById);

// Search parishes
router.get('/search', parishController.searchParishes);

// Get parishes by service offered
router.get('/by-service/:service', parishController.getParishesByService);

module.exports = router;