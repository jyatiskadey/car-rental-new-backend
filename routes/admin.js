const express = require('express');
const { createAdmin, adminLogin } = require('../controllers/adminController');

const router = express.Router();

router.post('/create', createAdmin);
router.post('/login', adminLogin);

module.exports = router;
