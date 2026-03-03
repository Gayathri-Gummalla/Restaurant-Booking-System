const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema(
    {
        tableNumber: {
            type: Number,
            required: true,
            unique: true,
        },
        capacity: {
            type: Number,
            required: true,
            min: 1,
            max: 20,
        },
        location: {
            type: String,
            required: true,
            trim: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        description: {
            type: String,
            default: '',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Table', tableSchema);
