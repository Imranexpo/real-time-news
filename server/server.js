const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const cors = require('cors');
const serverless = require('serverless-http');
require('./scheduler/schedular'); // Import your scheduler (optional)

dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api', authRoutes);

// Export handler for serverless deployment
module.exports.handler = serverless(app);
