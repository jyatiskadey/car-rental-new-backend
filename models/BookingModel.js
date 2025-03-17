const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Linking to User
    name: { type: String, required: true },
    date: { type: Date, required: true }, // Changed to Date type
    pickupLocation: { type: String, required: true },
    dropLocation: { type: String, required: true },
    carName: { type: String, required: true },
    price: { type: Number, required: true } // Changed to Number type
}, {
    timestamps: true // Automatically adds createdAt and updatedAt
});

module.exports = mongoose.model('Booking', bookingSchema);
