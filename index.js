const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
require("dotenv").config();

// Import configurations
const initializeSocket = require("./src/config/socket");
const prisma = require("./src/config/database");

// Import middleware
const { errorHandler, notFound } = require("./src/middleware/errorHandler");

// Import routes
const apiRoutes = require("./src/routes");

// Import socket handler
const handleSocketConnection = require("./src/sockets/chatSocket");

const app = express();
const server = createServer(app);
const io = initializeSocket(server);

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check route
app.get("/", (req, res) => {
  res.json({
    message: "Chat Server is running!",
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// API routes
app.use("/api", apiRoutes);

// Socket.IO connection handling
handleSocketConnection(io);

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);

  try {
    // Close server
    server.close(() => {
      console.log("HTTP server closed.");
    });

    // Disconnect from database
    await prisma.$disconnect();
    console.log("Database connection closed.");

    // Close socket.io
    io.close(() => {
      console.log("Socket.IO server closed.");
    });

    console.log("Graceful shutdown completed.");
    process.exit(0);
  } catch (error) {
    console.error("Error during graceful shutdown:", error);
    process.exit(1);
  }
};

// Handle shutdown signals
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  gracefulShutdown("UNCAUGHT_EXCEPTION");
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  gracefulShutdown("UNHANDLED_REJECTION");
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Socket.IO server ready for connections`);
  console.log(`🗄️  Database connected`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
});
