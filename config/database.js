const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Determine if using remote or local database
const useRemoteDB = process.env.DB_ENV === 'remote';

// Create a pool of connections to the database
const pool = mysql.createPool({
    host: useRemoteDB ? process.env.REMOTE_DB_HOST : process.env.DB_HOST,
    user: useRemoteDB ? process.env.REMOTE_DB_USER : process.env.DB_USER,
    password: useRemoteDB ? process.env.REMOTE_DB_PASSWORD : process.env.DB_PASSWORD,
    database: useRemoteDB ? process.env.REMOTE_DB_NAME : process.env.DB_NAME,
    port: useRemoteDB ? process.env.REMOTE_DB_PORT : process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test the database connection
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log(`Connected to the ${useRemoteDB ? 'remote' : 'local'} MySQL database!`);
        connection.release(); // Release the connection back to the pool
    } catch (err) {
        console.error('Database connection error:', err);
    }
};

// Immediately test the connection when the module is loaded
testConnection();

// Export the connection pool for use in other modules
module.exports = pool;
