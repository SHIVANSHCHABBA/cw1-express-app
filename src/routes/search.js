// routes/search.js
const router = require("express").Router();
const { connectDb } = require("../db/mongo");

router.get("/", async (req, res, next) => {
  try {
    const q = (req.query.q || "").toString().trim();
    if (!q) return res.json([]);

    const { lessons } = await connectDb();

    const rx = new RegExp(q, "i");
    const N = Number(q);
    const useNum = Number.isFinite(N);

    const filters = [{ topic: { $regex: rx } }, { location: { $regex: rx } }];
    if (useNum) { filters.push({ price: N }, { space: N }); }

    const results = await lessons.find({ $or: filters }).toArray();
    res.json(results);
  } catch (e) { next(e); }
});

module.exports = router;
