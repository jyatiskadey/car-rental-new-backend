const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
    driverId: { type: String, unique: true, required: true }, // Ensure it's unique
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    image: { type: String },
}, { timestamps: true });

const Driver = mongoose.model('Driver', DriverSchema);
module.exports = Driver;
