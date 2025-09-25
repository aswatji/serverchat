const prisma = require("../config/database");

const getAllUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        uid: true,
        name: true,
        email: true,
      },
    });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const user = await prisma.user.create({
      data: {
        name,
        email,
      },
    });
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await prisma.user.findUnique({
      where: { uid: userId },
      select: {
        uid: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
        message: "User with the specified ID does not exist",
      });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { name, email } = req.body;

    const user = await prisma.user.update({
      where: { uid: userId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
      },
    });

    res.json(user);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    await prisma.user.delete({
      where: { uid: userId },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
};
