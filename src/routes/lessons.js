// routes/lessons.js
const router = require("express").Router();
const { ObjectId } = require("mongodb");
const { connectDb } = require("../db/mongo");

// GET /api/lessons
router.get("/", async (_req, res, next) => {
  try {
    const { lessons } = await connectDb();
    const all = await lessons.find({}).toArray();
    res.json(all);
  } catch (e) { next(e); }
});

// PUT /api/lessons/:id   body: { ...fields to update... }
router.put("/:id", async (req, res, next) => {
  try {
    const { lessons } = await connectDb();
    const id = new ObjectId(req.params.id);
    const update = req.body || {};
    const out = await lessons.findOneAndUpdate(
      { _id: id },
      { $set: update },
      { returnDocument: "after" }
    );
    if (!out.value) return res.status(404).json({ error: "Lesson not found" });
    res.json(out.value);
  } catch (e) { next(e); }
});

module.exports = router;
