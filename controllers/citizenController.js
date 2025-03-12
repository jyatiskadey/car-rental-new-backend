const Citizen = require('../models/Citizen');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Create Citizen
const createCitizen = async (req, res) => {
    const { name, email, phone, password } = req.body;

    try {
        const exists = await Citizen.findOne({ email });
        if (exists) {
            return res.status(400).json({ message: 'Citizen already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const citizen = await Citizen.create({
            name,
            email,
            phone,
            password: hashedPassword,
        });

        res.status(201).json({ message: 'Citizen created successfully', citizen });
    } catch (error) {
        res.status(500).json({ message: 'Error creating citizen', error });
    }
};

// Login Citizen
const loginCitizen = async (req, res) => {
    const { email, password } = req.body;

    try {
        const citizen = await Citizen.findOne({ email });
        if (!citizen) {
            return res.status(404).json({ message: 'Citizen not found' });
        }

        const isMatch = await bcrypt.compare(password, citizen.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: citizen._id, email: citizen.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            citizen: {
                id: citizen._id,
                name: citizen.name,
                email: citizen.email,
                phone: citizen.phone
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};

// const Citizen = require('../models/Citizen');  // make sure this path is correct

const getCitizenProfile = async (req, res) => {
    try {
        const citizen = await Citizen.findById(req.user.id).select('-password'); // exclude password

        if (!citizen) {
            return res.status(404).json({ message: 'Citizen not found' });
        }

        res.status(200).json({
            success: true,
            citizen: {
                id: citizen._id,
                name: citizen.name,
                email: citizen.email,
                phone: citizen.phone,
                createdAt: citizen.createdAt,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching citizen profile', error });
    }
};

const getAllCitizens = async (req, res) => {
    try {
        const citizens = await Citizen.find().sort({ createdAt: -1 });  // Latest first
        res.status(200).json({ citizens });
    } catch (error) {
        console.error('Get All Citizen Error:', error.message);
        res.status(500).json({ message: 'Failed to fetch drivers' });
    }
};



module.exports = { createCitizen, loginCitizen, getCitizenProfile, getAllCitizens };
