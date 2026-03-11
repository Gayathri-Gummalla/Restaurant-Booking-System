const express = require('express');
const router = express.Router();
const { getAvailability, getTimeSlotAvailability, getSummary } = require('../controllers/availabilityController');

router.get('/', getAvailability);
router.get('/slots', getTimeSlotAvailability);
router.get('/summary', getSummary);

module.exports = router;
