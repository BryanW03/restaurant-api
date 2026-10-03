const pick = (obj, keys) =>
  keys.reduce((acc, key) => {
    if (obj[key] !== undefined) acc[key] = obj[key];
    return acc;
  }, {});

const httpError = (status, message) => {
  const err = new Error(message);
  err.status = status;
  return err;
};

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = { pick, httpError, asyncHandler };
