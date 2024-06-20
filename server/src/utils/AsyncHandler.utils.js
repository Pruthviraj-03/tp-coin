const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (err) {
    if (!res.headersSent) {
      res.status(err.code || 500).json({
        success: false,
        message: err.message,
      });
    } else {
      next(err);
    }
  }
};

export { asyncHandler };
