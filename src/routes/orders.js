// routes/orders.js
const router = require("express").Router();
const { ObjectId } = require("mongodb");
const { connectDb } = require("../db/mongo");

// POST /api/orders
// body: { name, phone, items: [{ lessonId, qty }] }
router.post("/", async (req, res, next) => {
  try {
    const { name, phone, items } = req.body || {};
    if (!name || !phone || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "name, phone and items[] required" });
    }

    const { lessons, orders } = await connectDb();

    // validate / load lessons
    const ids = items.map(i => new ObjectId(i.lessonId));
    const docs = await lessons.find({ _id: { $in: ids } }).toArray();

    // ensure all exist and capacity ok
    for (const i of items) {
      const doc = docs.find(d => String(d._id) === String(i.lessonId));
      if (!doc) return res.status(400).json({ error: `Lesson ${i.lessonId} not found` });
      if ((doc.space ?? 0) < (i.qty ?? 1)) {
        return res.status(400).json({ error: `Not enough space for ${doc.topic} (${doc.location})` });
      }
    }

    // create order
    const lessonIDs = items.map(i => new ObjectId(i.lessonId));
    const spaces = items.reduce((s, i) => s + (i.qty ?? 1), 0);
    const orderDoc = { name, phone, lessonIDs, spaces, createdAt: new Date() };
    const result = await orders.insertOne(orderDoc);

    // decrement spaces atomically
    for (const i of items) {
      await lessons.updateOne(
        { _id: new ObjectId(i.lessonId), space: { $gte: i.qty ?? 1 } },
        { $inc: { space: -(i.qty ?? 1) } }
      );
    }

    res.status(201).json({ _id: result.insertedId, ...orderDoc });
  } catch (e) { next(e); }
});

module.exports = router;
