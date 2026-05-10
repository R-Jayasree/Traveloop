const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const authenticateToken = require('../middleware/authMiddleware');

router.use(authenticateToken);

router.get('/', tripController.getTrips);
router.get('/recent', tripController.getRecentTrips);
router.get('/dashboard', tripController.getDashboardData);
router.get('/:id', tripController.getTripById);
router.post('/', tripController.createTrip);
router.delete('/:id', tripController.deleteTrip);

module.exports = router;
