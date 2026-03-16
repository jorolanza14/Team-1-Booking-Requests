const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

// All routes require authentication
router.use(authenticateJWT);

// Get payments for a specific booking
router.get('/booking/:bookingType/:bookingId', paymentController.getBookingPayments);

// Get all payments (with filters) - requires staff role
router.get('/', authorizeRoles('parish_admin', 'parish_staff', 'diocese_staff', 'diocese_admin'),
  paymentController.getPayments);

// Get payment statistics - requires staff role
router.get('/stats', authorizeRoles('parish_admin', 'parish_staff', 'diocese_staff', 'diocese_admin'),
  paymentController.getPaymentStats);

// Create payment with optional proof of payment upload
router.post('/', upload.single('proofOfPayment'), paymentController.createPayment);

// Single payment routes
router.get('/:id', paymentController.getPayment);
router.put('/:id', authorizeRoles('parish_admin', 'parish_staff', 'diocese_staff', 'diocese_admin'),
  upload.single('proofOfPayment'),
  paymentController.updatePayment);
router.delete('/:id', authorizeRoles('parish_admin', 'parish_staff', 'diocese_staff', 'diocese_admin'),
  paymentController.deletePayment);

module.exports = router;
