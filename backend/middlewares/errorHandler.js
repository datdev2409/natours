module.exports = (err, req, res, next) => {
  console.error(err);
  res.status(err.status).json({
    error: {
      status: err.status,
      message: err.message,
      stack: err.stack,
    },
  });
};
