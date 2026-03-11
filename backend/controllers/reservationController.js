const Reservation = require('../models/Reservation');
const Table = require('../models/Table');

// Helper: Find suitable available table for a given date/time/guestCount
const findAvailableTable = async (date, timeSlot, guestCount, excludeReservationId = null) => {
    const searchDate = new Date(date);
    searchDate.setHours(0, 0, 0, 0);
    const endDate = new Date(searchDate);
    endDate.setHours(23, 59, 59, 999);

    const conflictQuery = {
        date: { $gte: searchDate, $lte: endDate },
        timeSlot,
        status: { $in: ['confirmed', 'checked-in'] },
    };

    if (excludeReservationId) {
        conflictQuery._id = { $ne: excludeReservationId };
    }

    const conflicting = await Reservation.find(conflictQuery).select('table');
    const bookedTableIds = conflicting.map((r) => r.table.toString());

    // Find best-fit table (smallest capacity that fits the party)
    const availableTable = await Table.findOne({
        isActive: true,
        capacity: { $gte: guestCount },
        _id: { $nin: bookedTableIds },
    }).sort({ capacity: 1 });

    return availableTable;
};

// POST /api/reservations - Create new reservation
const createReservation = async (req, res) => {
    try {
        const { guestName, email, phone, guestCount, date, timeSlot, specialRequests } = req.body;

        // Validate required fields
        if (!guestName || !email || !phone || !guestCount || !date || !timeSlot) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required: guestName, email, phone, guestCount, date, timeSlot',
            });
        }

        // Find suitable table
        const availableTable = await findAvailableTable(date, timeSlot, parseInt(guestCount));

        if (!availableTable) {
            return res.status(409).json({
                success: false,
                message: 'No available tables for the selected date, time, and party size',
            });
        }

        // Create reservation
        const reservation = await Reservation.create({
            guestName,
            email,
            phone,
            table: availableTable._id,
            date: new Date(date),
            timeSlot,
            guestCount: parseInt(guestCount),
            specialRequests: specialRequests || '',
            createdBy: req.isAdmin ? 'admin' : 'user',
        });

        await reservation.populate('table');
        console.log(`✨ Reservation created: ${reservation.confirmationCode} for ${reservation.email}`);

        // Emit real-time update
        const io = req.app.get('io');
        const dateKey = new Date(date).toISOString().split('T')[0];
        io.to(`date_${dateKey}`).emit('availability_updated', {
            date: dateKey,
            timeSlot,
            action: 'booked',
            tableNumber: availableTable.tableNumber,
        });
        io.to('admin').emit('new_reservation', {
            reservation,
            action: 'created',
        });

        res.status(201).json({
            success: true,
            message: 'Reservation confirmed successfully!',
            reservation,
        });
    } catch (error) {
        console.error('Create Reservation Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/reservations - Get reservations (user by email or admin all)
const getReservations = async (req, res) => {
    try {
        const { email, confirmationCode, date, status, page = 1, limit = 20 } = req.query;

        let query = {};

        if (!req.isAdmin) {
            // Regular users can only see their reservations
            if (email) query.email = email.toLowerCase();
            else if (confirmationCode) query.confirmationCode = confirmationCode;
            else {
                return res.status(400).json({
                    success: false,
                    message: 'Email or confirmation code is required',
                });
            }
        } else {
            // Admin can filter
            if (date) {
                const searchDate = new Date(date);
                searchDate.setHours(0, 0, 0, 0);
                const endDate = new Date(searchDate);
                endDate.setHours(23, 59, 59, 999);
                query.date = { $gte: searchDate, $lte: endDate };
            }
            if (status) query.status = status;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await Reservation.countDocuments(query);
        const reservations = await Reservation.find(query)
            .populate('table')
            .sort({ date: 1, timeSlot: 1 })
            .skip(skip)
            .limit(parseInt(limit));

        res.json({
            success: true,
            count: reservations.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            reservations,
        });
    } catch (error) {
        console.error('Get Reservations Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/reservations/:id - Get single reservation
const getReservationById = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id).populate('table');

        if (!reservation) {
            return res.status(404).json({ success: false, message: 'Reservation not found' });
        }

        res.json({ success: true, reservation });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// PUT /api/reservations/:id - Update reservation
const updateReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const { guestCount, date, timeSlot, specialRequests, status, paymentStatus, paymentId } = req.body;

        const reservation = await Reservation.findById(id).populate('table');
        if (!reservation) {
            return res.status(404).json({ success: false, message: 'Reservation not found' });
        }

        if (reservation.status === 'cancelled') {
            return res.status(400).json({
                success: false,
                message: 'Cannot modify a cancelled reservation',
            });
        }

        // If updating date/time/guestCount, find a new available table
        const newDate = date || reservation.date;
        const newTimeSlot = timeSlot || reservation.timeSlot;
        const newGuestCount = guestCount ? parseInt(guestCount) : reservation.guestCount;

        const dateChanged = date && new Date(date).toDateString() !== reservation.date.toDateString();
        const timeChanged = timeSlot && timeSlot !== reservation.timeSlot;
        const guestChanged = guestCount && parseInt(guestCount) !== reservation.guestCount;

        let newTable = reservation.table;

        if (dateChanged || timeChanged || guestChanged) {
            const availableTable = await findAvailableTable(newDate, newTimeSlot, newGuestCount, id);
            if (!availableTable) {
                return res.status(409).json({
                    success: false,
                    message: 'No available tables for the updated date/time/party size',
                });
            }
            newTable = availableTable;
        }

        const oldDate = reservation.date.toISOString().split('T')[0];
        const oldTimeSlot = reservation.timeSlot;

        // Update fields
        if (date) reservation.date = new Date(date);
        if (timeSlot) reservation.timeSlot = timeSlot;
        if (guestCount) reservation.guestCount = parseInt(guestCount);
        if (specialRequests !== undefined) reservation.specialRequests = specialRequests;
        if (status && req.isAdmin) reservation.status = status;
        if (paymentStatus) reservation.paymentStatus = paymentStatus;
        if (paymentId) reservation.paymentId = paymentId;
        reservation.table = newTable._id;

        await reservation.save();
        await reservation.populate('table');

        // Emit real-time updates
        const io = req.app.get('io');
        const newDateKey = new Date(newDate).toISOString().split('T')[0];

        io.to(`date_${oldDate}`).emit('availability_updated', {
            date: oldDate,
            timeSlot: oldTimeSlot,
            action: 'updated',
        });
        io.to(`date_${newDateKey}`).emit('availability_updated', {
            date: newDateKey,
            timeSlot: newTimeSlot,
            action: 'updated',
        });
        io.to('admin').emit('reservation_updated', {
            reservation,
            action: 'updated',
        });

        res.json({
            success: true,
            message: 'Reservation updated successfully!',
            reservation,
        });
    } catch (error) {
        console.error('Update Reservation Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// DELETE /api/reservations/:id - Cancel reservation
const cancelReservation = async (req, res) => {
    try {
        const { id } = req.params;

        const reservation = await Reservation.findById(id).populate('table');
        if (!reservation) {
            return res.status(404).json({ success: false, message: 'Reservation not found' });
        }

        if (reservation.status === 'cancelled') {
            return res.status(400).json({
                success: false,
                message: 'Reservation is already cancelled',
            });
        }

        reservation.status = 'cancelled';
        await reservation.save();

        // Emit real-time updates
        const io = req.app.get('io');
        const dateKey = reservation.date.toISOString().split('T')[0];
        io.to(`date_${dateKey}`).emit('availability_updated', {
            date: dateKey,
            timeSlot: reservation.timeSlot,
            action: 'cancelled',
            tableNumber: reservation.table?.tableNumber,
        });
        io.to('admin').emit('reservation_updated', {
            reservation,
            action: 'cancelled',
        });

        res.json({
            success: true,
            message: 'Reservation cancelled successfully',
            reservation,
        });
    } catch (error) {
        console.error('Cancel Reservation Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createReservation,
    getReservations,
    getReservationById,
    updateReservation,
    cancelReservation,
};
