const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const { createDriver, getAllDrivers } = require('../controllers/driverController');
const upload = multer({ storage });

router.post('/create', upload.single('image'), createDriver);
router.get('/get-all-drivers', getAllDrivers);

module.exports = router;
