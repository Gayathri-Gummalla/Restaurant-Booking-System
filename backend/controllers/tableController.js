const Table = require('../models/Table');
const Reservation = require('../models/Reservation');

// GET /api/tables
const getTables = async (req, res) => {
    try {
        const tables = await Table.find({ isActive: true }).sort({ tableNumber: 1 });
        res.json({ success: true, count: tables.length, tables });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// POST /api/tables (admin only)
const createTable = async (req, res) => {
    try {
        const { tableNumber, capacity, location, description } = req.body;
        const table = await Table.create({ tableNumber, capacity, location, description });
        res.status(201).json({ success: true, table });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Table number already exists' });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

// PUT /api/tables/:id (admin only)
const updateTable = async (req, res) => {
    try {
        const table = await Table.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!table) return res.status(404).json({ success: false, message: 'Table not found' });
        res.json({ success: true, table });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// DELETE /api/tables/:id (admin only - soft delete)
const deleteTable = async (req, res) => {
    try {
        const table = await Table.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );
        if (!table) return res.status(404).json({ success: false, message: 'Table not found' });
        res.json({ success: true, message: 'Table deactivated' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getTables, createTable, updateTable, deleteTable };
