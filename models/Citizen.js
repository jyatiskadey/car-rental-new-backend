const mongoose = require('mongoose');

const citizenSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
}, { timestamps: true });

const Citizen = mongoose.model('Citizen', citizenSchema);

module.exports = Citizen;
