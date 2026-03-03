const Reservation = require('../models/Reservation');
const Table = require('../models/Table');
const mongoose = require('mongoose');

// @desc    Get advanced dashboard statistics using aggregation pipelines
// @route   GET /api/admin/analytics
// @access  Private/Admin
const getAnalytics = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // 1. Total bookings & Status breakdown
        const statusStats = await Reservation.aggregate([
            {
                $facet: {
                    "overall": [
                        { $group: { _id: null, count: { $sum: 1 } } }
                    ],
                    "today": [
                        { $match: { date: { $gte: today, $lt: tomorrow } } },
                        { $group: { _id: "$status", count: { $sum: 1 } } }
                    ],
                    "cancellationRate": [
                        {
                            $group: {
                                _id: null,
                                total: { $sum: 1 },
                                cancelled: { $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] } }
                            }
                        },
                        { $project: { rate: { $multiply: [{ $divide: ["$cancelled", "$total"] }, 100] } } }
                    ]
                }
            }
        ]);

        // 2. Occupancy Rate (Tables booked today vs total tables)
        const totalTables = await Table.countDocuments({ isActive: true });
        const bookedTodayCount = await Reservation.distinct('table', {
            date: { $gte: today, $lt: tomorrow },
            status: 'confirmed'
        });
        const occupancyRate = totalTables > 0 ? (bookedTodayCount.length / totalTables) * 100 : 0;

        // 3. Peak Time Slots Aggregation
        const peakSlots = await Reservation.aggregate([
            { $match: { status: 'confirmed' } },
            { $group: { _id: "$timeSlot", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        // 4. Daily progression (last 7 days)
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const dailyStats = await Reservation.aggregate([
            { $match: { date: { $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        res.json({
            success: true,
            analytics: {
                statusStats: statusStats[0],
                occupancyRate: Math.round(occupancyRate),
                peakSlots,
                dailyStats,
                totalTables,
                bookedToday: bookedTodayCount.length
            }
        });
    } catch (error) {
        console.error('Analytics Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Keeping original dashboard stats for the UI
const getDashboardStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayEnd = new Date(today);
        todayEnd.setHours(23, 59, 59, 999);

        const [
            totalReservations,
            todayReservations,
            totalTables,
            activeTables,
        ] = await Promise.all([
            Reservation.countDocuments({ status: 'confirmed' }),
            Reservation.countDocuments({ date: { $gte: today, $lte: todayEnd }, status: 'confirmed' }),
            Table.countDocuments(),
            Table.countDocuments({ isActive: true }),
        ]);

        const upcoming = await Reservation.find({
            date: { $gte: today },
            status: 'confirmed',
        })
            .populate('table')
            .sort({ date: 1, timeSlot: 1 })
            .limit(10);

        res.json({
            success: true,
            stats: {
                totalReservations,
                todayReservations,
                activeTables,
            },
            upcomingReservations: upcoming,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getAllReservations = async (req, res) => {
    try {
        const { date, status, search } = req.query;
        let query = {};
        if (date) {
            const d = new Date(date);
            d.setHours(0, 0, 0, 0);
            const nextD = new Date(d);
            nextD.setDate(nextD.getDate() + 1);
            query.date = { $gte: d, $lt: nextD };
        }
        if (status) query.status = status;
        if (search) {
            query.$or = [
                { guestName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const reservations = await Reservation.find(query).populate('table').sort({ date: -1 });
        res.json({ success: true, count: reservations.length, reservations });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateReservationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const reservation = await Reservation.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate('table');

        const io = req.app.get('io');
        io.to('admin').emit('reservation_updated', { reservation });

        res.json({ success: true, reservation });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getAnalytics, getDashboardStats, getAllReservations, updateReservationStatus };
