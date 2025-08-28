// index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./database/db');
const urlRoutes = require('./routes/urlRoutes');

dotenv.config(); // Load environment variables from .env file

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000; // Use port from .env or default to 5000

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Mount the URL routes
app.use('/', urlRoutes); // All our URL shortener routes will be under '/'

// Basic root route (optional)
app.get('/', (req, res) => {
  res.send('Welcome to the URL Shortener API!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});