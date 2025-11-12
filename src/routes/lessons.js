const express = require('express');
const { ObjectId } = require('mongodb');
const { connectDb } = require('../db/mongo');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { lessons } = await connectDb();
    const docs = await lessons.find({}).toArray();
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  let oid;
  try {
    oid = new ObjectId(id);
  } catch (e) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  try {
    const { lessons } = await connectDb();
    const result = await lessons.findOneAndUpdate(
      { _id: oid },
      { $set: req.body },
      { returnDocument: 'after' }
    );

    if (!result.value) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    res.json(result.value);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
