const express = require('express');
const router = express.Router();
const Booking = require('../models/BookingModel');
const mongoose = require('mongoose');
const Driver = require('../models/Driver');
const Car = require('../models/carModel');

// ================== Create a New Booking ==================
router.post('/create', async (req, res) => {
    const { userId, name, date, pickupLocation, dropLocation, carName, price } = req.body;

    // Validate input fields
    if (!userId || !name || !date || !pickupLocation || !dropLocation || !carName || !price) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate userId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID format' });
    }

    try {
        // Check if car exists and fetch driver details
        const car = await Car.findOne({ name: carName });
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }

        // Ensure driver exists
        const driver = await Driver.findOne({ name: car.driverName });
        if (!driver) {
            return res.status(404).json({ message: 'Assigned driver not found' });
        }

        // Create new booking with proper ObjectId conversion
        const newBooking = new Booking({
            userId: new mongoose.Types.ObjectId(userId), // Ensure it's a valid ObjectId
            name,
            date,
            pickupLocation,
            dropLocation,
            carName,
            price,
            driverName: driver.name
        });

        await newBooking.save();
        res.status(201).json({ message: 'Booking successful!', booking: newBooking });

    } catch (error) {
        res.status(500).json({ message: 'Failed to create booking', error: error.message });
    }
});


// ================== Fetch All Bookings ==================
router.get('/getAllBookings', async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.status(200).json({ success: true, bookings });
    } catch (error) {
        console.error("Error fetching all bookings:", error);
        res.status(500).json({ message: 'Failed to fetch bookings', error: error.message });
    }
});

// ================== Fetch Bookings by User ID ==================
router.get('/bookings/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Validate userId format
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }

        // Fetch bookings for the user
        const bookings = await Booking.find({ userId: mongoose.Types.ObjectId(userId) });

        if (!bookings.length) {
            return res.status(404).json({ message: 'No bookings found for this user' });
        }

        res.status(200).json({ success: true, bookings });
    } catch (error) {
        console.error("Error fetching bookings by user ID:", error);
        res.status(500).json({ message: 'Failed to fetch bookings', error: error.message });
    }
});

module.exports = router;
