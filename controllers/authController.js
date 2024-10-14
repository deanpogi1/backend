const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register function
const register = async (req, res) => {
  const { fullname, username, password } = req.body;
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert the new user into the database
    await pool.query(
      'INSERT INTO users (fullname, username, password) VALUES (?, ?, ?)',
      [fullname, username, hashedPassword]
    );
    
    // Return success message
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    // Handle any errors
    res.status(500).json({ error: err.message });
  }
};

// Login function
const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    // Query the database for the user by username
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    // If the user doesn't exist, return an error
    if (rows.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const user = rows[0];

    // Compare the entered password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    // If passwords don't match, return an error
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate a JWT token for the user
    const token = jwt.sign(
      { user_id: user.user_id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_ACCESS_EXPIRATION_TIME }
    );

    // Send the token as the response
    res.json({ token });
  } catch (err) {
    // Handle any errors
    res.status(500).json({ error: err.message });
  }
};

// Export the functions
module.exports = { register, login };
