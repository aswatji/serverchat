const pool = require("../config/database");
const { v4: uuidv4 } = require("uuid");

const getAllUsers = async (req, res, next) => {
  try {
    // First try to check if table exists
    const tableCheck = await pool.query(
      `SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'User')`
    );
    
    if (!tableCheck.rows[0].exists) {
      return res.status(200).json({
        message: "User table not found. Please run database schema setup.",
        users: [],
        setup_needed: true
      });
    }

    const result = await pool.query(
      'SELECT uid, name, email, created_at FROM "User" ORDER BY created_at DESC LIMIT 100'
    );
    
    res.json({
      message: "Users retrieved successfully",
      count: result.rows.length,
      users: result.rows
    });
  } catch (error) {
    console.error('getAllUsers error:', error);
    res.status(500).json({
      error: "Database error",
      message: error.message,
      details: "Check database connection and schema"
    });
  }
};

const createUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const uid = uuidv4();

    const result = await pool.query(
      'INSERT INTO "User" (uid, name, email, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING uid, name, email',
      [uid, name, email]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      'SELECT uid, name, email FROM "User" WHERE uid = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "User not found",
        message: "User with the specified ID does not exist",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { name, email } = req.body;

    let query = 'UPDATE "User" SET updated_at = NOW()';
    let params = [userId];
    let paramIndex = 2;

    if (name) {
      query += `, name = $${paramIndex}`;
      params.push(name);
      paramIndex++;
    }

    if (email) {
      query += `, email = $${paramIndex}`;
      params.push(email);
      paramIndex++;
    }

    query += " WHERE uid = $1 RETURNING uid, name, email";

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "User not found",
        message: "User with the specified ID does not exist",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const result = await pool.query('DELETE FROM "User" WHERE uid = $1', [
      userId,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: "User not found",
        message: "User with the specified ID does not exist",
      });
    }

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
