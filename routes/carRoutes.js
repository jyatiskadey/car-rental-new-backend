const express = require('express');
const router = express.Router();
const { AddCar, upload, getCars, deleteCar } = require('../controllers/carContoller'); // Note: Corrected filename typo

// POST - Create Car with Image Upload
router.post('/create', upload.single('image'), AddCar);
router.get('/get-car-details', getCars)
router.delete('/delete/:id', deleteCar)

module.exports = router;
