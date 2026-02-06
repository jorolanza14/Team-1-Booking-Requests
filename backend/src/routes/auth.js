const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Register new user
router.post(
  '/register',
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Invalid email address'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters'),
    body('firstName')
      .trim()
      .notEmpty()
      .withMessage('First name is required'),
    body('lastName')
      .trim()
      .notEmpty()
      .withMessage('Last name is required'),
  ],
  authController.register
);

// Login
router.post(
  '/login',
  authLimiter,
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Invalid email address'),
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
  ],
  authController.login
);

// Refresh access token
router.post('/refresh', authController.refreshToken);

// Google OAuth (for future implementation)
router.post('/google', authController.googleAuth);

// Get current user profile (protected route)
router.get('/me', require('../middleware/auth').authenticateJWT, authController.getCurrentUser);

// Update user profile (protected route)
router.put('/me', require('../middleware/auth').authenticateJWT, authController.updateProfile);

// Change password (protected route)
router.patch('/change-password', require('../middleware/auth').authenticateJWT, [
  body('oldPassword')
    .notEmpty()
    .withMessage('Old password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters'),
], authController.changePassword);

module.exports = router;