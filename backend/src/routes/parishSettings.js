const express = require('express');
const router = express.Router();
const parishSettingsController = require('../controllers/parishSettingsController');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateJWT);

// Slot settings routes
router.get('/:parishId/slot-settings', parishSettingsController.getParishSlotSettings);
router.post('/:parishId/slot-settings', authorizeRoles('parish_admin', 'parish_staff', 'diocese_staff', 'diocese_admin'),
  parishSettingsController.upsertParishSlotSetting);
router.delete('/:parishId/slot-settings/:serviceType', authorizeRoles('parish_admin', 'parish_staff', 'diocese_staff', 'diocese_admin'),
  parishSettingsController.deleteParishSlotSetting);

// Blackout dates routes
router.get('/:parishId/blackout-dates', parishSettingsController.getBlackoutDates);
router.post('/:parishId/blackout-dates', authorizeRoles('parish_admin', 'parish_staff', 'diocese_staff', 'diocese_admin'),
  parishSettingsController.createBlackoutDate);
router.put('/:parishId/blackout-dates/:id', authorizeRoles('parish_admin', 'parish_staff', 'diocese_staff', 'diocese_admin'),
  parishSettingsController.updateBlackoutDate);
router.delete('/:parishId/blackout-dates/:id', authorizeRoles('parish_admin', 'parish_staff', 'diocese_staff', 'diocese_admin'),
  parishSettingsController.deleteBlackoutDate);

// Parish configuration routes
router.get('/:parishId/configuration', parishSettingsController.getParishConfiguration);
router.put('/:parishId/settings', authorizeRoles('parish_admin', 'parish_staff', 'diocese_staff', 'diocese_admin'),
  parishSettingsController.updateParishSettings);

// Parish statistics
router.get('/:parishId/stats', authorizeRoles('parish_admin', 'parish_staff', 'diocese_staff', 'diocese_admin'),
  parishSettingsController.getParishBookingStats);

module.exports = router;
