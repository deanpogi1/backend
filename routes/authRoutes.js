// routes/authRoutes.js

const express = require('express');
const authcontroller = require('../controllers/authcontroller'); // Ensure this matches the actual file name
const authenticateToken = require('../middlewares/authMiddleware'); // Include your middleware if needed

const router = express.Router();

// Registration route
router.post('/register', authcontroller.register); // Reference the correct function
// Login route
router.post('/login', authcontroller.login); // Reference the correct function

module.exports = router;
