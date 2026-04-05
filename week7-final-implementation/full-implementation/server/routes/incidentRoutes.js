const express = require('express');
const {
  createIncident,
  getAllIncidents,
  getIncidentById,
  updateIncidentStatus,
  getNearbyIncidents,
  getHotspots
} = require('../controllers/incidentController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, createIncident);
router.get('/', protect, getAllIncidents);
router.get('/nearby', protect, getNearbyIncidents);
router.get('/hotspots', protect, restrictTo('admin'), getHotspots);
router.get('/:id', protect, getIncidentById);
router.patch('/:id/status', protect, restrictTo('admin'), updateIncidentStatus);

module.exports = router;
