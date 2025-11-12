const express = require('express');
const { ObjectId } = require('mongodb');
const { connectDb } = require('../db/mongo');

const router = express.Router();

router.post('/', async (req, res) => {
  const { name, phone, items } = req.body || {};

  if (!name || !phone || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Missing name, phone or items' });
  }

  const ops = [];
  let totalSpaces = 0;
  const lessonIDs = [];

  for (const it of items) {
    if (!it || !it.lessonId || typeof it.qty !== 'number' || it.qty <= 0) {
      return res.status(400).json({ error: 'Each item must have lessonId and positive qty' });
    }
    let oid;
    try {
      oid = new ObjectId(it.lessonId);
    } catch (e) {
      return res.status(400).json({ error: `Invalid lessonId: ${it.lessonId}` });
    }
    ops.push({ oid, qty: it.qty });
    lessonIDs.push(oid);
    totalSpaces += it.qty;
  }

  try {
    const { lessons, orders } = await connectDb();

    const applied = [];
    // Atomically decrement space for each lesson if enough space exists.
    for (const op of ops) {
      const result = await lessons.findOneAndUpdate(
        { _id: op.oid, space: { $gte: op.qty } },
        { $inc: { space: -op.qty } },
        { returnDocument: 'after' }
      );

      if (!result.value) {
        // rollback previous updates
        for (const a of applied) {
          try {
            await lessons.updateOne({ _id: a.oid }, { $inc: { space: a.qty } });
          } catch (e) {
            // best-effort rollback; ignore errors here
          }
        }
        return res.status(400).json({ error: 'Not enough space for one or more lessons' });
      }

      applied.push(op);
    }

    const orderDoc = {
      name,
      phone,
      lessonIDs,
      spaces: totalSpaces,
      createdAt: new Date()
    };

    const insertRes = await orders.insertOne(orderDoc);
    orderDoc._id = insertRes.insertedId;

    return res.status(201).json(orderDoc);
  } catch (err) {
    // Attempt to rollback any partial updates if possible
    try {
      const { lessons } = await connectDb();
      if (Array.isArray(ops)) {
        for (const op of ops) {
          // best-effort: try to add back qty (safe if already rolled back or not applied)
          try {
            await lessons.updateOne({ _id: op.oid }, { $inc: { space: op.qty } });
          } catch (e) {}
        }
      }
    } catch (e) {}
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
