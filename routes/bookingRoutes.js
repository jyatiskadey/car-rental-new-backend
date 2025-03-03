const express = require('express');
const router = express.Router();
const Booking = require('../models/BookingModel'); // Create this model (explained below)

// POST - Create new booking
router.post('/create', async (req, res) => {
    const { name, date, pickupLocation, dropLocation, carName, price } = req.body;

    if (!name || !date || !pickupLocation || !dropLocation || !carName || !price) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const newBooking = new Booking({
            name,
            date,
            pickupLocation,
            dropLocation,
            carName,
            price
        });

        await newBooking.save();
        res.status(201).json({ message: 'Booking successful!', booking: newBooking });

    } catch (error) {
        res.status(500).json({ message: 'Failed to create booking', error: error.message });
    }
});

module.exports = router;
