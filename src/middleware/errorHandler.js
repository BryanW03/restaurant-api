const notFound = (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid id format' });
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation failed',
      errors: Object.values(err.errors).map((e) => ({ field: e.path, message: e.message })),
    });
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    return res.status(409).json({ message: `A record with this ${field} already exists` });
  }
  const status = err.status || 500;
  if (status === 500) console.error(err);
  return res.status(status).json({ message: status === 500 ? 'Internal server error' : err.message });
};

module.exports = { notFound, errorHandler };
