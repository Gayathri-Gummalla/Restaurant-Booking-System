const express = require('express');
const router = express.Router();
const {
    getAnalytics,
    getDashboardStats,
    getAllReservations,
    updateReservationStatus,
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/analytics', getAnalytics);
router.get('/dashboard', getDashboardStats);
router.get('/reservations', getAllReservations);
router.put('/reservations/:id/status', updateReservationStatus);

module.exports = router;
