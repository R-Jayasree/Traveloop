const express = require('express');
const router = express.Router();
const cityController = require('../controllers/cityController');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/', authenticateToken, cityController.getCities);
router.get('/:id', authenticateToken, cityController.getCityById);

module.exports = router;
