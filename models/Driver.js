const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    image: { type: String, required: true }  // Cloudinary URL
}, {
    timestamps: true
});

module.exports = mongoose.model('Driver', driverSchema);
