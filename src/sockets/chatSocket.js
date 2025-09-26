const pool = require("../config/database");
const { v4: uuidv4 } = require("uuid");

const handleSocketConnection = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join chat room
    socket.on("join_chat", (chatId) => {
      socket.join(chatId);
      console.log(`User ${socket.id} joined chat ${chatId}`);

      // Notify others in the room
      socket.to(chatId).emit("user_joined", {
        message: `User ${socket.id} joined the chat`,
        timestamp: new Date(),
      });
    });

    // Leave chat room
    socket.on("leave_chat", (chatId) => {
      socket.leave(chatId);
      console.log(`User ${socket.id} left chat ${chatId}`);

      // Notify others in the room
      socket.to(chatId).emit("user_left", {
        message: `User ${socket.id} left the chat`,
        timestamp: new Date(),
      });
    });

    // Handle sending messages via socket
    socket.on("send_message", async (data) => {
      try {
        const { chat_id, sent_by, content } = data;

        // Validate data
        if (!chat_id || !sent_by || !content) {
          socket.emit("error", {
            message: "chat_id, sent_by, and content are required",
          });
          return;
        }

        if (content.trim().length === 0) {
          socket.emit("error", {
            message: "Message content cannot be empty",
          });
          return;
        }

        // Create message in database
        const messageId = uuidv4();

        const result = await pool.query(
          `
          INSERT INTO "Message" (message_id, chat_id, sender_id, content, sent_at)
          VALUES ($1, $2, $3, $4, NOW())
          RETURNING message_id, chat_id, sender_id, content, sent_at
        `,
          [messageId, chat_id, sent_by, content.trim()]
        );

        // Get sender details
        const senderResult = await pool.query(
          'SELECT uid, name, email FROM "User" WHERE uid = $1',
          [sent_by]
        );

        const message = {
          ...result.rows[0],
          sender: senderResult.rows[0],
        };

        // Emit message to all users in the chat room
        io.to(chat_id).emit("new_message", message);

        // Confirm message sent to sender
        socket.emit("message_sent", {
          success: true,
          message_id: message.message_id,
          timestamp: message.sent_at,
        });
      } catch (error) {
        console.error("Socket message error:", error);
        socket.emit("error", {
          message: "Failed to send message",
          details:
            process.env.NODE_ENV === "development" ? error.message : undefined,
        });
      }
    });

    // Handle typing indicators
    socket.on("typing_start", (data) => {
      const { chat_id, user_id, user_name } = data;
      socket.to(chat_id).emit("user_typing", {
        user_id,
        user_name,
        isTyping: true,
      });
    });

    socket.on("typing_stop", (data) => {
      const { chat_id, user_id } = data;
      socket.to(chat_id).emit("user_typing", {
        user_id,
        isTyping: false,
      });
    });

    // Handle message read status
    socket.on("message_read", (data) => {
      const { chat_id, message_id, user_id } = data;
      socket.to(chat_id).emit("message_read_status", {
        message_id,
        read_by: user_id,
        read_at: new Date(),
      });
    });

    // Handle user status (online/offline)
    socket.on("user_status", (data) => {
      const { user_id, status } = data;
      socket.broadcast.emit("user_status_update", {
        user_id,
        status,
        timestamp: new Date(),
      });
    });

    // Handle disconnect
    socket.on("disconnect", (reason) => {
      console.log(`User disconnected: ${socket.id}, reason: ${reason}`);

      // Notify all rooms that this user was in
      socket.broadcast.emit("user_status_update", {
        socket_id: socket.id,
        status: "offline",
        timestamp: new Date(),
        reason,
      });
    });

    // Handle connection errors
    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });
  });
};

module.exports = handleSocketConnection;
