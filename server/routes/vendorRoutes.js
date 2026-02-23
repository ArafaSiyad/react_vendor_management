const express = require('express');
const router = express.Router();
const { getVendors, createVendor } = require('../controllers/vendorController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, authorize('Admin', 'Staff'), getVendors);
router.post('/', protect, authorize('Admin', 'Staff'), createVendor);

module.exports = router;
