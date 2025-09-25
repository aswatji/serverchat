const express = require("express");
const router = express.Router();
const { validateUser } = require("../middleware/validation");
const {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

// GET /api/users - Get all users
router.get("/", getAllUsers);

// POST /api/users - Create a new user
router.post("/", validateUser, createUser);

// GET /api/users/:userId - Get user by ID
router.get("/:userId", getUserById);

// PUT /api/users/:userId - Update user
router.put("/:userId", updateUser);

// DELETE /api/users/:userId - Delete user
router.delete("/:userId", deleteUser);

module.exports = router;
