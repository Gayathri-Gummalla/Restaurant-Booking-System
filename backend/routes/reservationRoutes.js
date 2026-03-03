const express = require('express');
const router = express.Router();
const {
    createReservation,
    getReservations,
    getReservationById,
    updateReservation,
    cancelReservation,
} = require('../controllers/reservationController');
const { protect, optionalAuth } = require('../middleware/auth');

// Public (with optional admin detection)
router.post('/', optionalAuth, createReservation);
router.get('/', optionalAuth, getReservations);
router.get('/:id', getReservationById);
router.put('/:id', optionalAuth, updateReservation);
router.delete('/:id', optionalAuth, cancelReservation);

module.exports = router;
