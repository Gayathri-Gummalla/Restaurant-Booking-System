require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Table = require('./models/Table');
const Reservation = require('./models/Reservation');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant_booking';

const tables = [
    { tableNumber: 1, capacity: 2, location: 'window', description: 'Cozy 2-seater by the window' },
    { tableNumber: 2, capacity: 2, location: 'window', description: 'Romantic window table' },
    { tableNumber: 3, capacity: 4, location: 'indoor', description: 'Central indoor table' },
    { tableNumber: 4, capacity: 4, location: 'indoor', description: 'Quiet corner booth' },
    { tableNumber: 5, capacity: 4, location: 'outdoor', description: 'Outdoor patio seating' },
    { tableNumber: 6, capacity: 6, location: 'indoor', description: 'Large family table' },
    { tableNumber: 7, capacity: 6, location: 'outdoor', description: 'Garden patio table' },
    { tableNumber: 8, capacity: 8, location: 'private', description: 'Private dining room A' },
    { tableNumber: 9, capacity: 8, location: 'private', description: 'Private dining room B' },
    { tableNumber: 10, capacity: 10, location: 'private', description: 'Large private event space' },
];

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        await Promise.all([
            User.deleteMany({}),
            Table.deleteMany({}),
            Reservation.deleteMany({}),
        ]);
        console.log('🗑️  Cleared existing data');

        // Create Admin
        const admin = await User.create({
            name: 'Restaurant Admin',
            email: 'admin@restaurant.com',
            password: 'admin123',
            role: 'admin',
        });
        console.log(`👤 Admin created: ${admin.email}`);

        // Create Tables
        const createdTables = await Table.insertMany(tables);
        console.log(`🪑 Created ${createdTables.length} tables`);

        console.log('\n🎉 Seed complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error);
        process.exit(1);
    }
}

seed();
