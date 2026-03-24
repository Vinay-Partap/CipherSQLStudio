require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectMongoDB } = require('./config/database');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/assignments', require('./routes/assignments'));
app.use('/api/execute', require('./routes/execution'));
app.use('/api/hints', require('./routes/hints'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

const PORT = process.env.PORT || 5000;
app.use(cors({
  origin: [
    "http://localhost:5174",
    "https://cipher-sql-studio-mu.vercel.app"
  ]
}));

// Start server after DB connection
async function startServer() {
  await connectMongoDB();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();