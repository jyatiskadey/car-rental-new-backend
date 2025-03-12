const express = require('express');
const router = express.Router();
const Booking = require('../models/BookingModel'); 

// POST - Create new booking
router.post('/create', async (req, res) => {
    const { name, userId, date, pickupLocation, dropLocation, carName, price } = req.body;

    if (!name || !userId || !date || !pickupLocation || !dropLocation || !carName || !price) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const newBooking = new Booking({
            name,
            userId,
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

// GET - Fetch all bookings
router.get('/getAllBookings', async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.status(200).json({ success: true, bookings });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch bookings', error: error.message });
    }
});

// GET - Fetch bookings by user ID
router.get('/bookings/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const bookings = await Booking.find({ userId });

        if (bookings.length === 0) {
            return res.status(404).json({ message: 'No bookings found for this user' });
        }

        res.status(200).json({ success: true, bookings });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch bookings', error: error.message });
    }
});

module.exports = router;
