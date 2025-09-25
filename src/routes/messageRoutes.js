const express = require("express");
const router = express.Router();
const { validateMessage } = require("../middleware/validation");
const {
  getChatMessages,
  createMessage,
  getMessageById,
  updateMessage,
  deleteMessage,
} = require("../controllers/messageController");

// GET /api/messages/:chatId - Get messages for a chat
router.get("/:chatId", getChatMessages);

// POST /api/messages - Send a new message
router.post("/", validateMessage, createMessage);

// GET /api/messages/message/:messageId - Get message by ID
router.get("/message/:messageId", getMessageById);

// PUT /api/messages/message/:messageId - Update message
router.put("/message/:messageId", updateMessage);

// DELETE /api/messages/message/:messageId - Delete message
router.delete("/message/:messageId", deleteMessage);

module.exports = router;
