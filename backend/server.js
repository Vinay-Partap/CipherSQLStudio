require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectMongoDB } = require('./config/database');

const app = express();

// Middleware - CORS pehle hona chahiye
app.use(cors({
  origin: [
    "http://localhost:5174",
    "https://cipher-sql-studio-mu.vercel.app"
  ]
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/assignments', require('./routes/assignments'));
app.use('/api/execute', require('./routes/execution'));
app.use('/api/hints', require('./routes/hints'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Temporary seed route
app.get('/api/seed', async (req, res) => {
  try {
    const { seedDatabase } = require('./utils/seedData');
    await seedDatabase();
    res.json({ status: 'Seeded successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectMongoDB();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();