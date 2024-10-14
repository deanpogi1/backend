const express = require('express');
const authController = require('../controllers/authcontroller');
const authenticateToken = require('../middlewares/authMiddleware'); // Add your middleware if needed

const router = express.Router();

// Registration route
router.post('/register', register);

// Login route
router.post('/login', login);

module.exports = router;
