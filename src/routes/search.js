const express = require('express');
const { connectDb } = require('../db/mongo');

const router = express.Router();

router.get('/', async (req, res) => {
  const q = req.query.q || '';

  if (!q || q.trim() === '') {
    return res.json([]);
  }

  const rx = new RegExp(q, 'i');
  const n = parseFloat(q);
  const isFiniteN = Number.isFinite(n);

  const orClauses = [
    { topic: { $regex: rx } },
    { location: { $regex: rx } }
  ];

  if (isFiniteN) {
    orClauses.push({ price: n });
    orClauses.push({ space: n });
  }

  try {
    const { lessons } = await connectDb();
    const results = await lessons.find({ $or: orClauses }).toArray();
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
