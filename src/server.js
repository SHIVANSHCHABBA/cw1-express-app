require('dotenv').config();
const express = require('express');
const cors = require('cors');
const logger = require('./middleware/logger');
const lessonImage = require('./middleware/staticImages');
const lessonsRouter = require('./routes/lessons');
const ordersRouter = require('./routes/orders');
const searchRouter = require('./routes/search');
const { connectDb } = require('./db/mongo');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

// Root
app.get('/', (req, res) => {
  res.json({ ok: true, message: 'API is running. See /api/health or /api/lessons' });
});

// Mount routers
app.use('/api/lessons', lessonsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/search', searchRouter);

// Serve lesson images
app.get('/images/lessons/:file', lessonImage);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err && err.message ? err.message : 'Internal server error' });
});

// Start server only after DB connection
const port = process.env.PORT || 4000;

(async () => {
  try {
    await connectDb();
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err && err.message ? err.message : err);
    console.error('Check MONGO_URI and ensure credentials / special characters are URL-encoded.');
    process.exit(1);
  }

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
})();
