function logger(req, res, next) {
  const ts = new Date().toISOString();
  console.log(`[${ts}] ${req.method} ${req.originalUrl || req.url}`);
  next();
}

module.exports = logger;
