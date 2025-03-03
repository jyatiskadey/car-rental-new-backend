const express = require('express');
const { createCitizen, loginCitizen, getCitizenProfile } = require('../controllers/citizenController');
const authenticateToken = require('../middleware/authMiddleware');  // Add this for token verification middleware

const router = express.Router();

// Citizen Registration
router.post('/register', createCitizen);

// Citizen Login
router.post('/login', loginCitizen);

// Get Citizen Profile (protected route)
router.get('/profile', authenticateToken, getCitizenProfile);

module.exports = router;
