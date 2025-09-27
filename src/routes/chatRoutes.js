const express = require("express");
const router = express.Router();
const { validateChat } = require("../middleware/validation");
const {
  getUserChats,
  createChat,
  getChatById,
  deleteChat,
} = require("../controllers/chatController");

// GET /api/chats - Get all chats info
router.get("/", (req, res) => {
  res.json({
    message: "Chat API endpoint",
    description: "Use /api/chats/:userId to get user's chats",
    endpoints: {
      "GET /:userId": "Get all chats for a user",
      "POST /": "Create a new chat",
      "GET /chat/:chatId": "Get chat by ID",
      "DELETE /chat/:chatId": "Delete chat"
    }
  });
});

// GET /api/chats/:userId - Get all chats for a user  
router.get("/:userId", getUserChats);

// POST /api/chats - Create a new chat
router.post("/", validateChat, createChat);

// GET /api/chats/chat/:chatId - Get chat by ID
router.get("/chat/:chatId", getChatById);

// DELETE /api/chats/chat/:chatId - Delete chat
router.delete("/chat/:chatId", deleteChat);

module.exports = router;
