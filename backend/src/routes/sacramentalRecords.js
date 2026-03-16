const express = require('express');
const router = express.Router();
const sacramentalRecordsController = require('../controllers/sacramentalRecordsController');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

// All routes require authentication
router.use(authenticateJWT);

// Search and get records
router.get('/', sacramentalRecordsController.searchSacramentalRecords);
router.get('/stats', sacramentalRecordsController.getSacramentalRecordStats);
router.get('/export', sacramentalRecordsController.exportSacramentalRecords);

// Create record (digitization) - requires staff role
router.post('/', authorizeRoles('parish_admin', 'parish_staff', 'diocese_staff', 'diocese_admin'),
  upload.single('scannedCopy'),
  sacramentalRecordsController.createSacramentalRecord);

// Bulk upload - requires admin role
router.post('/bulk', authorizeRoles('diocese_staff', 'diocese_admin'),
  sacramentalRecordsController.bulkUploadSacramentalRecords);

// Single record routes
router.get('/:id', sacramentalRecordsController.getSacramentalRecord);
router.put('/:id', authorizeRoles('parish_admin', 'parish_staff', 'diocese_staff', 'diocese_admin'),
  upload.single('scannedCopy'),
  sacramentalRecordsController.updateSacramentalRecord);
router.delete('/:id', authorizeRoles('parish_admin', 'parish_staff', 'diocese_staff', 'diocese_admin'),
  sacramentalRecordsController.deleteSacramentalRecord);

module.exports = router;
