const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const cors = require('cors');
require('./scheduler/schedular');

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

connectDB();

// Routes
app.use('/api', authRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Real-time News API is running");
});

// Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(Server running on port ${PORT}));
