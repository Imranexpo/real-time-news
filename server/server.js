const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const cors = require('cors');
const serverless = require('serverless-http');
require('./scheduler/schedular')
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
connectDB();
app.use('/api', authRoutes);

module.exports.handler = serverless(app);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server running on port ${PORT}'));
