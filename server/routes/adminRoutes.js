const express = require('express');
const router = express.Router();
const { getAdminOverview } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/overview', protect, admin, getAdminOverview);

module.exports = router;
