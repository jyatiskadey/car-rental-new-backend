const express = require('express');
const router = express.Router();
const { createCar, upload, getCars } = require('../controllers/carContoller'); // Note: Corrected filename typo

// POST - Create Car with Image Upload
router.post('/create', upload.single('image'), createCar);
router.get('/get-car-details', getCars)

module.exports = router;
