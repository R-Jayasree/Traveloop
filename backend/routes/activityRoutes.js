const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/stop/:stop_id', authenticateToken, activityController.getActivitiesByStop);
router.post('/', authenticateToken, activityController.addActivity);
router.delete('/:id', authenticateToken, activityController.deleteActivity);

module.exports = router;
