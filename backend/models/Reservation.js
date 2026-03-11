const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
    {
        guestName: {
            type: String,
            required: [true, 'Guest name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            lowercase: true,
            trim: true,
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            trim: true,
        },
        table: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Table',
            required: true,
        },
        date: {
            type: Date,
            required: [true, 'Reservation date is required'],
        },
        timeSlot: {
            type: String,
            required: [true, 'Time slot is required'],
            enum: [
                '11:00', '11:30',
                '12:00', '12:30',
                '13:00', '13:30',
                '14:00', '14:30',
                '15:00', '15:30',
                '18:00', '18:30',
                '19:00', '19:30',
                '20:00', '20:30',
                '21:00', '21:30',
                '22:00',
            ],
        },
        guestCount: {
            type: Number,
            required: [true, 'Number of guests is required'],
            min: 1,
            max: 20,
        },
        status: {
            type: String,
            enum: ['confirmed', 'cancelled', 'pending', 'checked-in'],
            default: 'confirmed',
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'failed'],
            default: 'pending',
        },
        paymentId: String,
        specialRequests: {
            type: String,
            default: '',
            maxlength: 500,
        },
        confirmationCode: {
            type: String,
            unique: true,
        },
        createdBy: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
    },
    { timestamps: true }
);

// Compound index to prevent double-booking
reservationSchema.index({ table: 1, date: 1, timeSlot: 1, status: 1 });
reservationSchema.index({ email: 1 });
reservationSchema.index({ confirmationCode: 1 });

// Generate confirmation code before saving
reservationSchema.pre('save', function (next) {
    if (!this.confirmationCode) {
        this.confirmationCode =
            'RB-' +
            Math.random().toString(36).substring(2, 7).toUpperCase() +
            '-' +
            Date.now().toString(36).toUpperCase();
    }
    next();
});

module.exports = mongoose.model('Reservation', reservationSchema);
