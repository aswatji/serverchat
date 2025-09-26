const errorHandler = (err, req, res, next) => {
  // Log detailed error for debugging
  console.error("❌ Error occurred:");
  console.error("URL:", req.method, req.originalUrl);
  console.error("Body:", req.body);
  console.error("Error:", err.message);
  console.error("Stack:", err.stack);
  console.error("Code:", err.code);

  // PostgreSQL unique constraint violation
  if (err.code === "23505") {
    return res.status(400).json({
      error: "Unique constraint violation",
      message: "Data already exists (email might be duplicate)",
      details: process.env.NODE_ENV === "development" ? err.detail : undefined
    });
  }

  // PostgreSQL foreign key constraint violation  
  if (err.code === "23503") {
    return res.status(400).json({
      error: "Foreign key constraint violation",
      message: "Referenced data does not exist",
      details: process.env.NODE_ENV === "development" ? err.detail : undefined
    });
  }

  // PostgreSQL table does not exist
  if (err.code === "42P01") {
    return res.status(500).json({
      error: "Database schema error",
      message: "Required table does not exist",
      details: process.env.NODE_ENV === "development" ? err.message : "Database not properly configured"
    });
  }

  // General database connection error
  if (err.code === "ECONNREFUSED" || err.code === "ENOTFOUND") {
    return res.status(503).json({
      error: "Database connection error",
      message: "Unable to connect to database",
      details: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }

  // Validation errors
  if (err.name === "ValidationError") {
    return res.status(400).json({
      error: "Validation error",
      message: err.message
    });
  }

  // Default internal server error
  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? err.message : "Something went wrong",
    details: process.env.NODE_ENV === "development" ? err.stack : undefined
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
