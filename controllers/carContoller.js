require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const Car = require('../models/carModel'); // Import Mongoose model

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer Configuration (storing files in memory, ready for Cloudinary upload)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Create Car - Save to MongoDB with Cloudinary Image Upload
const createCar = async (req, res) => {
    try {
        const { name, model, price } = req.body;
        const file = req.file;

        // Input Validations
        if (!name || !model || !price) {
            return res.status(400).json({ message: 'All fields (name, model, price) are required' });
        }
        if (!file) {
            return res.status(400).json({ message: 'Image file is required' });
        }

        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(`data:image/jpeg;base64,${file.buffer.toString('base64')}`, {
            folder: 'car_images'
        });

        // Create and save car to MongoDB
        const newCar = new Car({
            name: name.trim(),
            model: model.trim(),
            price: parseFloat(price),
            imageUrl: result.secure_url
        });

        await newCar.save();

        res.status(201).json({
            message: 'Car created successfully',
            car: newCar
        });
    } catch (error) {
        console.error('Error creating car:', error.message);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Get All Cars - Fetch from MongoDB
const getCars = async (req, res) => {
    try {
        const cars = await Car.find().sort({ createdAt: -1 }); // Sort by latest first
        res.status(200).json({
            message: 'Cars fetched successfully',
            cars
        });
    } catch (error) {
        console.error('Error fetching cars:', error.message);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

module.exports = {
    createCar,
    upload, // This is the multer instance to use in routes
    getCars
};
