require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const Car = require('../models/carModel'); // Import Mongoose model
const Driver = require('../models/Driver');
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
const AddCar = async (req, res) => {
    try {
        const { name, model, price, driverName } = req.body;
        const file = req.file;

        // Input Validations
        if (!name || !model || !price || !driverName) {
            return res.status(400).json({ message: 'All fields (name, model, price, driverName) are required' });
        }
        if (!file) {
            return res.status(400).json({ message: 'Image file is required' });
        }

        // Check if driver exists
        const existingDriver = await Driver.findOne({ name: driverName.trim() });
        if (!existingDriver) {
            return res.status(404).json({ message: 'Driver not found. Please register the driver first.' });
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
            driverName: driverName.trim(),
            imageUrl: result.secure_url
        });

        await newCar.save();

        res.status(201).json({
            message: '✅ Car Added successfully',
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
        const cars = await Car.find()
            .populate('driverName', 'name') // Populating driver name (assuming driverName is a reference to Driver model)
            .sort({ createdAt: -1 }); // Sort by latest first

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
    

const deleteCar = async (req, res) => {
    try {
        const { id } = req.params;
        const car = await Car.findByIdAndDelete(id);

        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }

        res.status(200).json({ message: 'Car deleted successfully' });
    } catch (error) {
        console.error('Error deleting car:', error.message);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};
module.exports = {
    AddCar,
    upload, // This is the multer instance to use in routes
    getCars,
    deleteCar
};
