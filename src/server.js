require('dotenv').config();
const express = require('express');
const cors = require('cors');
const logger = require('./middleware/logger');
const lessonImage = require('./middleware/staticImages');
const lessonsRouter = require('./routes/lessons');
const ordersRouter = require('./routes/orders');
const searchRouter = require('./routes/search');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

// add root route to avoid "Cannot GET /"
app.get('/', (req, res) => {
  res.json({ ok: true, message: 'API is running. See /api/health or /api/lessons' });
});

// Mount routes
app.use('/api/lessons', lessonsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/search', searchRouter);

// Static image handler
app.get('/images/lessons/:file', lessonImage);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
