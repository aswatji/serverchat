const prisma = require("../config/database");

const getUserChats = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const chats = await prisma.chat.findMany({
      where: {
        OR: [{ user1_id: userId }, { user2_id: userId }],
      },
      include: {
        user1: {
          select: { uid: true, name: true, email: true },
        },
        user2: {
          select: { uid: true, name: true, email: true },
        },
        messages: {
          orderBy: { sent_at: "desc" },
          take: 1,
        },
      },
    });
    res.json(chats);
  } catch (error) {
    next(error);
  }
};

const createChat = async (req, res, next) => {
  try {
    const { user1_id, user2_id } = req.body;

    // Check if chat already exists
    const existingChat = await prisma.chat.findFirst({
      where: {
        OR: [
          { AND: [{ user1_id }, { user2_id }] },
          { AND: [{ user1_id: user2_id }, { user2_id: user1_id }] },
        ],
      },
      include: {
        user1: {
          select: { uid: true, name: true, email: true },
        },
        user2: {
          select: { uid: true, name: true, email: true },
        },
      },
    });

    if (existingChat) {
      return res.json(existingChat);
    }

    const chat = await prisma.chat.create({
      data: {
        user1_id,
        user2_id,
      },
      include: {
        user1: {
          select: { uid: true, name: true, email: true },
        },
        user2: {
          select: { uid: true, name: true, email: true },
        },
      },
    });
    res.status(201).json(chat);
  } catch (error) {
    next(error);
  }
};

const getChatById = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const chat = await prisma.chat.findUnique({
      where: { chat_id: chatId },
      include: {
        user1: {
          select: { uid: true, name: true, email: true },
        },
        user2: {
          select: { uid: true, name: true, email: true },
        },
        messages: {
          include: {
            sender: {
              select: { uid: true, name: true, email: true },
            },
          },
          orderBy: { sent_at: "asc" },
        },
      },
    });

    if (!chat) {
      return res.status(404).json({
        error: "Chat not found",
        message: "Chat with the specified ID does not exist",
      });
    }

    res.json(chat);
  } catch (error) {
    next(error);
  }
};

const deleteChat = async (req, res, next) => {
  try {
    const { chatId } = req.params;

    // Delete related messages and last messages first
    await prisma.message.deleteMany({
      where: { chat_id: chatId },
    });

    await prisma.lastMessage.deleteMany({
      where: { chat_id: chatId },
    });

    await prisma.chat.delete({
      where: { chat_id: chatId },
    });

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
