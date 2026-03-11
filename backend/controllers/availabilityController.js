const Reservation = require('../models/Reservation');
const Table = require('../models/Table');

// Time slot duration in minutes (30 min slots)
const SLOT_DURATION = 30;

// Get available tables for a date, time, and guest count
const getAvailability = async (req, res) => {
    try {
        const { date, timeSlot, guestCount } = req.query;

        if (!date || !timeSlot) {
            return res.status(400).json({
                success: false,
                message: 'Date and timeSlot are required',
            });
        }

        const searchDate = new Date(date);
        searchDate.setHours(0, 0, 0, 0);
        const endDate = new Date(searchDate);
        endDate.setHours(23, 59, 59, 999);

        // Find tables already booked for this date + timeslot
        const bookedReservations = await Reservation.find({
            date: { $gte: searchDate, $lte: endDate },
            timeSlot,
            status: { $in: ['confirmed', 'checked-in'] },
        }).select('table');

        const bookedTableIds = bookedReservations.map((r) => r.table.toString());

        // Build query for available tables
        const tableQuery = {
            isActive: true,
            _id: { $nin: bookedTableIds },
        };

        if (guestCount) {
            tableQuery.capacity = { $gte: parseInt(guestCount) };
        }

        const availableTables = await Table.find(tableQuery).sort({ capacity: 1 });

        // Get all tables to compute stats
        const allTables = await Table.find({ isActive: true });
        const totalTables = allTables.length;
        const bookedCount = allTables.filter((t) =>
            bookedTableIds.includes(t._id.toString())
        ).length;

        res.json({
            success: true,
            date,
            timeSlot,
            guestCount: guestCount || 1,
            availableTables,
            totalTables,
            bookedCount,
            availableCount: availableTables.length,
            occupancyRate:
                totalTables > 0 ? Math.round((bookedCount / totalTables) * 100) : 0,
        });
    } catch (error) {
        console.error('Availability Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all time slots with availability status for a date
const getTimeSlotAvailability = async (req, res) => {
    try {
        const { date, guestCount } = req.query;

        if (!date) {
            return res.status(400).json({
                success: false,
                message: 'Date is required',
            });
        }

        const TIME_SLOTS = [
            '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
            '14:00', '14:30', '15:00', '15:30',
            '18:00', '18:30', '19:00', '19:30',
            '20:00', '20:30', '21:00', '21:30', '22:00',
        ];

        const searchDate = new Date(date);
        searchDate.setHours(0, 0, 0, 0);
        const endDate = new Date(searchDate);
        endDate.setHours(23, 59, 59, 999);

        // Get all confirmed reservations for that date
        const reservations = await Reservation.find({
            date: { $gte: searchDate, $lte: endDate },
            status: { $in: ['confirmed', 'checked-in'] },
        }).select('table timeSlot');

        // Get all active tables
        let tableQuery = { isActive: true };
        if (guestCount) {
            tableQuery.capacity = { $gte: parseInt(guestCount) };
        }
        const eligibleTables = await Table.find(tableQuery);
        const totalEligible = eligibleTables.length;

        // Build availability map
        const slotAvailability = TIME_SLOTS.map((slot) => {
            const bookedInSlot = reservations
                .filter((r) => r.timeSlot === slot)
                .map((r) => r.table.toString());

            const available = eligibleTables.filter(
                (t) => !bookedInSlot.includes(t._id.toString())
            ).length;

            return {
                timeSlot: slot,
                available,
                total: totalEligible,
                isAvailable: available > 0,
                occupancyRate:
                    totalEligible > 0
                        ? Math.round(((totalEligible - available) / totalEligible) * 100)
                        : 100,
            };
        });

        res.json({ success: true, date, slotAvailability });
    } catch (error) {
        console.error('Time Slot Availability Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get high-level summary for today
const getSummary = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tonight = new Date(today);
        tonight.setHours(23, 59, 59, 999);

        const [totalTables, bookedToday] = await Promise.all([
            Table.countDocuments({ isActive: true }),
            Reservation.countDocuments({
                date: { $gte: today, $lte: tonight },
                status: { $in: ['confirmed', 'checked-in'] },
            }),
        ]);

        res.json({
            success: true,
            totalTables,
            bookedToday,
            occupancyRate: totalTables > 0 ? Math.round((bookedToday / (totalTables * 19)) * 100) : 0, // Assuming 19 slots per table
            message: bookedToday >= (totalTables * 15) ? 'High Demand' : 'Normal',
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getAvailability, getTimeSlotAvailability, getSummary };
