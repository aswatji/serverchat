const pool = require("../config/database");
const { v4: uuidv4 } = require("uuid");

const getChatMessages = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const offset = (page - 1) * parseInt(limit);

    const result = await pool.query(
      `
      SELECT 
        m.message_id, m.content, m.sent_at, m.sender_id,
        u.uid as sender_uid, u.name as sender_name, u.email as sender_email
      FROM "Message" m
      LEFT JOIN "User" u ON m.sender_id = u.uid
      WHERE m.chat_id = $1
      ORDER BY m.sent_at DESC
      LIMIT $2 OFFSET $3
    `,
      [chatId, parseInt(limit), offset]
    );

    const messages = result.rows
      .map((row) => ({
        message_id: row.message_id,
        content: row.content,
        sent_at: row.sent_at,
        sender_id: row.sender_id,
        chat_id: chatId,
        sender: {
          uid: row.sender_uid,
          name: row.sender_name,
          email: row.sender_email,
        },
      }))
      .reverse();

    res.json(messages);
  } catch (error) {
    next(error);
  }
};

const createMessage = async (req, res, next) => {
  try {
    const { chat_id, sent_by, content } = req.body;
    const messageId = uuidv4();

    const result = await pool.query(
      `
      INSERT INTO "Message" (message_id, chat_id, sender_id, content, sent_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING message_id, chat_id, sender_id, content, sent_at
    `,
      [messageId, chat_id, sent_by, content]
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

    // Emit message to socket (will be handled in socket handler)
    req.messageData = message;

    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};

const getMessageById = async (req, res, next) => {
  try {
    const { messageId } = req.params;

    const result = await pool.query(
      `
      SELECT 
        m.message_id, m.content, m.sent_at, m.sender_id, m.chat_id,
        u.uid as sender_uid, u.name as sender_name, u.email as sender_email
      FROM "Message" m
      LEFT JOIN "User" u ON m.sender_id = u.uid
      WHERE m.message_id = $1
    `,
      [messageId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Message not found",
        message: "Message with the specified ID does not exist",
      });
    }

    const row = result.rows[0];
    const message = {
      message_id: row.message_id,
      content: row.content,
      sent_at: row.sent_at,
      sender_id: row.sender_id,
      chat_id: row.chat_id,
      sender: {
        uid: row.sender_uid,
        name: row.sender_name,
        email: row.sender_email,
      },
      chat: {
        chat_id: row.chat_id,
      },
    };

    res.json(message);
  } catch (error) {
    next(error);
  }
};

const updateMessage = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        error: "Validation failed",
        message: "Content is required and cannot be empty",
      });
    }

    const result = await pool.query(
      `
      UPDATE "Message" 
      SET content = $1, updated_at = NOW()
      WHERE message_id = $2
      RETURNING message_id, chat_id, sender_id, content, sent_at
    `,
      [content, messageId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Message not found",
        message: "Message with the specified ID does not exist",
      });
    }

    // Get sender details
    const senderResult = await pool.query(
      'SELECT uid, name, email FROM "User" WHERE uid = $1',
      [result.rows[0].sender_id]
    );

    const message = {
      ...result.rows[0],
      sender: senderResult.rows[0],
    };

    res.json(message);
  } catch (error) {
    next(error);
  }
};

const deleteMessage = async (req, res, next) => {
  try {
    const { messageId } = req.params;

    const result = await pool.query(
      'DELETE FROM "Message" WHERE message_id = $1',
      [messageId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: "Message not found",
        message: "Message with the specified ID does not exist",
      });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getChatMessages,
  createMessage,
  getMessageById,
  updateMessage,
  deleteMessage,
};
