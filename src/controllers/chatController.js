const pool = require("../config/database");
const { v4: uuidv4 } = require("uuid");

const getUserChats = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      `
      SELECT 
        c.chat_id, c.user1_id, c.user2_id, c.created_at,
        u1.uid as user1_uid, u1.name as user1_name, u1.email as user1_email,
        u2.uid as user2_uid, u2.name as user2_name, u2.email as user2_email,
        m.message_id, m.content, m.sent_at as last_message_time
      FROM "Chat" c
      LEFT JOIN "User" u1 ON c.user1_id = u1.uid
      LEFT JOIN "User" u2 ON c.user2_id = u2.uid
      LEFT JOIN LATERAL (
        SELECT message_id, content, sent_at
        FROM "Message" 
        WHERE chat_id = c.chat_id 
        ORDER BY sent_at DESC 
        LIMIT 1
      ) m ON true
      WHERE c.user1_id = $1 OR c.user2_id = $1
      ORDER BY c.created_at DESC
    `,
      [userId]
    );

    const chats = result.rows.map((row) => ({
      chat_id: row.chat_id,
      user1_id: row.user1_id,
      user2_id: row.user2_id,
      created_at: row.created_at,
      user1: {
        uid: row.user1_uid,
        name: row.user1_name,
        email: row.user1_email,
      },
      user2: {
        uid: row.user2_uid,
        name: row.user2_name,
        email: row.user2_email,
      },
      messages: row.message_id
        ? [
            {
              message_id: row.message_id,
              content: row.content,
              sent_at: row.last_message_time,
            },
          ]
        : [],
    }));

    res.json(chats);
  } catch (error) {
    next(error);
  }
};

const createChat = async (req, res, next) => {
  try {
    const { user1_id, user2_id } = req.body;

    // Check if chat already exists
    const existingResult = await pool.query(
      `
      SELECT 
        c.chat_id, c.user1_id, c.user2_id, c.created_at,
        u1.uid as user1_uid, u1.name as user1_name, u1.email as user1_email,
        u2.uid as user2_uid, u2.name as user2_name, u2.email as user2_email
      FROM "Chat" c
      LEFT JOIN "User" u1 ON c.user1_id = u1.uid
      LEFT JOIN "User" u2 ON c.user2_id = u2.uid
      WHERE (c.user1_id = $1 AND c.user2_id = $2) 
         OR (c.user1_id = $2 AND c.user2_id = $1)
      LIMIT 1
    `,
      [user1_id, user2_id]
    );

    if (existingResult.rows.length > 0) {
      const row = existingResult.rows[0];
      return res.json({
        chat_id: row.chat_id,
        user1_id: row.user1_id,
        user2_id: row.user2_id,
        created_at: row.created_at,
        user1: {
          uid: row.user1_uid,
          name: row.user1_name,
          email: row.user1_email,
        },
        user2: {
          uid: row.user2_uid,
          name: row.user2_name,
          email: row.user2_email,
        },
      });
    }

    // Create new chat
    const chatId = uuidv4();
    await pool.query(
      'INSERT INTO "Chat" (chat_id, user1_id, user2_id, created_at) VALUES ($1, $2, $3, NOW())',
      [chatId, user1_id, user2_id]
    );

    // Get the created chat with user details
    const newChatResult = await pool.query(
      `
      SELECT 
        c.chat_id, c.user1_id, c.user2_id, c.created_at,
        u1.uid as user1_uid, u1.name as user1_name, u1.email as user1_email,
        u2.uid as user2_uid, u2.name as user2_name, u2.email as user2_email
      FROM "Chat" c
      LEFT JOIN "User" u1 ON c.user1_id = u1.uid
      LEFT JOIN "User" u2 ON c.user2_id = u2.uid
      WHERE c.chat_id = $1
    `,
      [chatId]
    );

    const row = newChatResult.rows[0];
    const chat = {
      chat_id: row.chat_id,
      user1_id: row.user1_id,
      user2_id: row.user2_id,
      created_at: row.created_at,
      user1: {
        uid: row.user1_uid,
        name: row.user1_name,
        email: row.user1_email,
      },
      user2: {
        uid: row.user2_uid,
        name: row.user2_name,
        email: row.user2_email,
      },
    };

    res.status(201).json(chat);
  } catch (error) {
    next(error);
  }
};

const getChatById = async (req, res, next) => {
  try {
    const { chatId } = req.params;

    const chatResult = await pool.query(
      `
      SELECT 
        c.chat_id, c.user1_id, c.user2_id, c.created_at,
        u1.uid as user1_uid, u1.name as user1_name, u1.email as user1_email,
        u2.uid as user2_uid, u2.name as user2_name, u2.email as user2_email
      FROM "Chat" c
      LEFT JOIN "User" u1 ON c.user1_id = u1.uid
      LEFT JOIN "User" u2 ON c.user2_id = u2.uid
      WHERE c.chat_id = $1
    `,
      [chatId]
    );

    if (chatResult.rows.length === 0) {
      return res.status(404).json({
        error: "Chat not found",
        message: "Chat with the specified ID does not exist",
      });
    }

    const messagesResult = await pool.query(
      `
      SELECT 
        m.message_id, m.content, m.sent_at, m.sender_id,
        u.uid as sender_uid, u.name as sender_name, u.email as sender_email
      FROM "Message" m
      LEFT JOIN "User" u ON m.sender_id = u.uid
      WHERE m.chat_id = $1
      ORDER BY m.sent_at ASC
    `,
      [chatId]
    );

    const chatRow = chatResult.rows[0];
    const chat = {
      chat_id: chatRow.chat_id,
      user1_id: chatRow.user1_id,
      user2_id: chatRow.user2_id,
      created_at: chatRow.created_at,
      user1: {
        uid: chatRow.user1_uid,
        name: chatRow.user1_name,
        email: chatRow.user1_email,
      },
      user2: {
        uid: chatRow.user2_uid,
        name: chatRow.user2_name,
        email: chatRow.user2_email,
      },
      messages: messagesResult.rows.map((msgRow) => ({
        message_id: msgRow.message_id,
        content: msgRow.content,
        sent_at: msgRow.sent_at,
        sender_id: msgRow.sender_id,
        sender: {
          uid: msgRow.sender_uid,
          name: msgRow.sender_name,
          email: msgRow.sender_email,
        },
      })),
    };

    res.json(chat);
  } catch (error) {
    next(error);
  }
};

const deleteChat = async (req, res, next) => {
  try {
    const { chatId } = req.params;

    // Delete related messages first
    await pool.query('DELETE FROM "Message" WHERE chat_id = $1', [chatId]);

    // Delete the chat
    const result = await pool.query('DELETE FROM "Chat" WHERE chat_id = $1', [
      chatId,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: "Chat not found",
        message: "Chat with the specified ID does not exist",
      });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserChats,
  createChat,
  getChatById,
  deleteChat,
};
