const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const { createDriver, getAllDrivers, getAllDriverNames } = require('../controllers/driverController');
const upload = multer({ storage });

router.post('/create', upload.single('image'), createDriver);
router.get('/get-all-drivers', getAllDrivers);
router.get('/get-all-drivers-name', getAllDriverNames);

module.exports = router;
