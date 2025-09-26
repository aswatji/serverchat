const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  if (err.code === "P2002") {
    return res.status(400).json({
      error: "Unique constraint violation",
      message: "Data already exists",
    });
  }

  if (err.code === "P2025") {
    return res.status(404).json({
      error: "Record not found",
      message: "The requested resource was not found",
    });
  }

  res.status(500).json({
    error: "Internal server error",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
  });
};

const notFound = (req, res, next) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.originalUrl} not found`,
  });
};

module.exports = {
  errorHandler,
  notFound,
};
