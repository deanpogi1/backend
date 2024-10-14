const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    const { fullname, username, passwordx } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(passwordx, 10);

            const [rows] = await pool.query(
                'INSERT INTO users (fullname, username, passwordx) VALUES (?, ?, ?)',
                [fullname, username, hashedPassword]
            );
            res.status(201).json({ message: 'User registered successfully!' });
        } catch (err) {
          // Enhanced logging for debugging
          console.error('Database insert error:', err);
          
          // Send back the error message to client
          res.status(500).json({ error: err.message });
        }
      };

const login = async (req, res) => {
    const { username, passwordx } = req.body; 
    
    console.log ('Login Request Body: ', req.body);

    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

        console.log ('Query Results:', rows);

        if (rows.length === 0) {
            return res.status(400).json({ error: 'Invalid Credentials' });
        }

        const user = rows[0];

        const isMatch = await bcrypt.compare(passwordx, user.passwordx); 

        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid Credentials' });
        }

        const token = jwt.sign(
            { user_id: user.user_id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_ACCESS_EXPIRATION_TIME }
        );

        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { register, login };