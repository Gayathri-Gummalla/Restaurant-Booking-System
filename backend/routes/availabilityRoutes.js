const express = require('express');
const router = express.Router();
const { getAvailability, getTimeSlotAvailability } = require('../controllers/availabilityController');

router.get('/', getAvailability);
router.get('/slots', getTimeSlotAvailability);

module.exports = router;
