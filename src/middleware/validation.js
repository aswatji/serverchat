const validateUser = (req, res, next) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      error: "Validation failed",
      message: "Name and email are required",
    });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({
      error: "Validation failed",
      message: "Invalid email format",
    });
  }

  next();
};

const validateChat = (req, res, next) => {
  const { user1_id, user2_id } = req.body;

  if (!user1_id || !user2_id) {
    return res.status(400).json({
      error: "Validation failed",
      message: "user1_id and user2_id are required",
    });
  }

  if (user1_id === user2_id) {
    return res.status(400).json({
      error: "Validation failed",
      message: "Cannot create chat with yourself",
    });
  }

  next();
};

const validateMessage = (req, res, next) => {
  const { chat_id, sent_by, content } = req.body;

  if (!chat_id || !sent_by || !content) {
    return res.status(400).json({
      error: "Validation failed",
      message: "chat_id, sent_by, and content are required",
    });
  }

  if (content.trim().length === 0) {
    return res.status(400).json({
      error: "Validation failed",
      message: "Message content cannot be empty",
    });
  }

  next();
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

module.exports = {
  validateUser,
  validateChat,
  validateMessage,
};
