const prisma = require("../config/database");

const getChatMessages = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const messages = await prisma.message.findMany({
      where: { chat_id: chatId },
      include: {
        sender: {
          select: { uid: true, name: true, email: true },
        },
      },
      orderBy: { sent_at: "desc" },
      skip: (page - 1) * limit,
      take: parseInt(limit),
    });

    res.json(messages.reverse());
  } catch (error) {
    next(error);
  }
};

const createMessage = async (req, res, next) => {
  try {
    const { chat_id, sent_by, content } = req.body;

    const message = await prisma.message.create({
      data: {
        chat_id,
        sent_by,
        content,
      },
      include: {
        sender: {
          select: { uid: true, name: true, email: true },
        },
      },
    });

    // Update last message
    await updateLastMessage(chat_id, sent_by, content);

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
    const message = await prisma.message.findUnique({
      where: { message_id: messageId },
      include: {
        sender: {
          select: { uid: true, name: true, email: true },
        },
        chat: {
          select: { chat_id: true },
        },
      },
    });

    if (!message) {
      return res.status(404).json({
        error: "Message not found",
        message: "Message with the specified ID does not exist",
      });
    }

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

    const message = await prisma.message.update({
      where: { message_id: messageId },
      data: { content },
      include: {
        sender: {
          select: { uid: true, name: true, email: true },
        },
      },
    });

    res.json(message);
  } catch (error) {
    next(error);
  }
};

const deleteMessage = async (req, res, next) => {
  try {
    const { messageId } = req.params;

    await prisma.message.delete({
      where: { message_id: messageId },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// Helper function to update last message
const updateLastMessage = async (chat_id, sent_by, content) => {
  try {
    const chat = await prisma.chat.findUnique({
      where: { chat_id },
      include: { user1: true, user2: true },
    });

    if (chat) {
      const partnerId =
        sent_by === chat.user1_id ? chat.user2_id : chat.user1_id;

      await prisma.lastMessage.upsert({
        where: {
          user_id_partner_id: {
            user_id: sent_by,
            partner_id: partnerId,
          },
        },
        update: {
          last_chat: content,
          last_chat_date: new Date(),
          chat_id,
        },
        create: {
          user_id: sent_by,
          partner_id: partnerId,
          chat_id,
          last_chat: content,
          last_chat_date: new Date(),
        },
      });
    }
  } catch (error) {
    console.error("Error updating last message:", error);
  }
};

module.exports = {
  getChatMessages,
  createMessage,
  getMessageById,
  updateMessage,
  deleteMessage,
  updateLastMessage,
};
