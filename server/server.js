const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const newsRoutes = require('./routes/auth');

dotenv.config(); // Load environment variables from .env file

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Parse incoming JSON requests

// Routes
app.use('/api', newsRoutes); // This is where your routes for /api/news, /api/wsj-news, etc., are handled

// Connect to the database
connectDB();

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
