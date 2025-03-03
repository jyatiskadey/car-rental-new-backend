const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: String, required: true },
    pickupLocation: { type: String, required: true },
    dropLocation: { type: String, required: true },
    carName: { type: String, required: true },
    price: { type: String, required: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);
