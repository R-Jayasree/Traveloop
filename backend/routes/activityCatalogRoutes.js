const express = require('express');
const router = express.Router();
const activityCatalogController = require('../controllers/activityCatalogController');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/:city_id', authenticateToken, activityCatalogController.getActivitiesByCity);

module.exports = router;
