const express = require("express");
const router = express.Router();

// Import route modules
const userRoutes = require("./userRoutes");
const chatRoutes = require("./chatRoutes");
const messageRoutes = require("./messageRoutes");

// Use routes
router.use("/users", userRoutes);
router.use("/chats", chatRoutes);
router.use("/messages", messageRoutes);

// Health check route
router.get("/", (req, res) => {
  res.json({
    message: "Chat Server API is running!",
    version: "1.0.0",
    endpoints: {
      users: "/api/users",
      chats: "/api/chats", 
      messages: "/api/messages",
    },
  });
});

module.exports = router;
