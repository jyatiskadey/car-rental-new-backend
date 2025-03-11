const Driver = require('../models/Driver');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary (make sure your .env has these keys)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Create Driver - with Cloudinary Upload
const createDriver = async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const file = req.file;

        // Input Validations
        if (!name || !email || !phone) {
            return res.status(400).json({ message: 'All fields (name, email, phone) are required' });
        }
        if (!file) {
            return res.status(400).json({ message: 'Driver image is required' });
        }

        // Check if driver already exists
        const existingDriver = await Driver.findOne({ email });
        if (existingDriver) {
            return res.status(400).json({ message: 'Driver with this email already exists.' });
        }

        const lastDriver = await Driver.findOne().sort({ createdAt: -1 });

        let newDriverId = "DVR0000001"; 
        if (lastDriver && lastDriver.driverId) {
            const lastIdNumber = parseInt(lastDriver.driverId.replace("DVR", ""), 10);
            newDriverId = `DVR${String(lastIdNumber + 1).padStart(7, "0")}`;
        }

        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(`data:image/jpeg;base64,${file.buffer.toString('base64')}`, {
            folder: 'driver_images'
        });

        // Create new Driver in MongoDB
        const newDriver = new Driver({
            driverId: newDriverId, 
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            image: result.secure_url 
        });

        await newDriver.save();

        res.status(201).json({
            message: 'Driver created successfully',
            driver: newDriver
        });

    } catch (error) {
        console.error('Create Driver Error:', error.message);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};


// Get All Drivers
const getAllDrivers = async (req, res) => {
    try {
        const drivers = await Driver.find().sort({ createdAt: -1 });  // Latest first
        res.status(200).json({ drivers });
    } catch (error) {
        console.error('Get All Drivers Error:', error.message);
        res.status(500).json({ message: 'Failed to fetch drivers' });
    }
};

module.exports = {
    createDriver,
    getAllDrivers
};
