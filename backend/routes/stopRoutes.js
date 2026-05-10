const express = require('express');
const router = express.Router();
const stopController = require('../controllers/stopController');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/trip/:trip_id', authenticateToken, stopController.getStopsByTrip);
router.post('/', authenticateToken, stopController.addStop);
router.delete('/:id', authenticateToken, stopController.deleteStop);

module.exports = router;
