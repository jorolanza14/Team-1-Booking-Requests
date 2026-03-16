const express = require('express');
const { body } = require('express-validator');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');
const parishController = require('../controllers/parishController');

const router = express.Router();

// Public routes (no authentication required)
// Get all parishes
router.get('/', parishController.getAllParishes);

// Get parish by ID
router.get('/:id', parishController.getParishById);

// Search parishes
router.get('/search', parishController.searchParishes);

// Get parishes by service offered
router.get('/by-service/:service', parishController.getParishesByService);

// Protected routes (authentication required)
// All protected routes require authentication
router.use(authenticateJWT);

// Create a new parish (diocese admin only)
router.post('/', 
  // Authorization is handled inside the controller
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Parish name is required')
      .isLength({ max: 255 })
      .withMessage('Parish name must not exceed 255 characters'),
    body('address')
      .trim()
      .notEmpty()
      .withMessage('Address is required'),
    body('contactEmail')
      .optional()
      .isEmail()
      .normalizeEmail()
      .withMessage('Valid email is required'),
    body('contactPhone')
      .optional()
      .isLength({ max: 20 })
      .withMessage('Phone number must not exceed 20 characters'),
    body('schedule')
      .optional()
      .isObject()
      .withMessage('Schedule must be an object'),
    body('servicesOffered')
      .optional()
      .isArray()
      .withMessage('Services offered must be an array'),
  ],
  parishController.createParish
);

// Update a parish (diocese admin or parish admin for their assigned parish)
router.put('/:id', 
  // Authorization is handled inside the controller
  [
    body('name')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Parish name cannot be empty')
      .isLength({ max: 255 })
      .withMessage('Parish name must not exceed 255 characters'),
    body('address')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Address cannot be empty'),
    body('contactEmail')
      .optional()
      .isEmail()
      .normalizeEmail()
      .withMessage('Valid email is required'),
    body('contactPhone')
      .optional()
      .isLength({ max: 20 })
      .withMessage('Phone number must not exceed 20 characters'),
    body('schedule')
      .optional()
      .isObject()
      .withMessage('Schedule must be an object'),
    body('servicesOffered')
      .optional()
      .isArray()
      .withMessage('Services offered must be an array'),
    body('isActive')
      .optional()
      .isBoolean()
      .withMessage('isActive must be a boolean'),
  ],
  parishController.updateParish
);

// Delete a parish (diocese admin only) - soft delete
router.delete('/:id', 
  // Authorization is handled inside the controller
  parishController.deleteParish
);

// Hard delete a parish (diocese admin only) - only for special cases
router.delete('/:id/hard-delete', 
  // Authorization is handled inside the controller
  parishController.hardDeleteParish
);

module.exports = router;