const express = require('express');
const cors = require('cors');
const app = express();
const newsRoutes = require('./routes/auth');
app.use(cors());
app.use(express.json());

app.use('/api', newsRoutes); // <-- This is what enables /api/news, /api/wsj-news, etc.

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
