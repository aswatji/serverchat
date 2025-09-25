/**
 * Utility functions for the chat server
 */

/**
 * Generate a random string ID
 * @param {number} length - Length of the generated string
 * @returns {string} Random string
 */
const generateId = (length = 10) => {
  return Math.random()
    .toString(36)
    .substring(2, length + 2);
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Sanitize string input
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
const sanitizeString = (str) => {
  if (typeof str !== "string") return "";
  return str.trim().replace(/[<>]/g, "");
};

/**
 * Format date to ISO string
 * @param {Date} date - Date to format
 * @returns {string} Formatted date string
 */
const formatDate = (date = new Date()) => {
  return date.toISOString();
};

/**
 * Check if user is in chat
 * @param {string} userId - User ID to check
 * @param {Object} chat - Chat object with user1_id and user2_id
 * @returns {boolean} True if user is in chat
 */
const isUserInChat = (userId, chat) => {
  return chat.user1_id === userId || chat.user2_id === userId;
};

/**
 * Get chat partner ID
 * @param {string} userId - Current user ID
 * @param {Object} chat - Chat object with user1_id and user2_id
 * @returns {string} Partner user ID
 */
const getChatPartner = (userId, chat) => {
  return chat.user1_id === userId ? chat.user2_id : chat.user1_id;
};

/**
 * Parse pagination parameters
 * @param {Object} query - Query parameters
 * @returns {Object} Parsed pagination object
 */
const parsePagination = (query) => {
  const page = parseInt(query.page) || 1;
  const limit = Math.min(parseInt(query.limit) || 50, 100); // Max 100 items per page
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

/**
 * Create standardized API response
 * @param {boolean} success - Success status
 * @param {any} data - Response data
 * @param {string} message - Response message
 * @param {Object} meta - Additional metadata
 * @returns {Object} Standardized response object
 */
const createResponse = (success, data = null, message = "", meta = {}) => {
  return {
    success,
    message,
    data,
    timestamp: new Date().toISOString(),
    ...meta,
  };
};

module.exports = {
  generateId,
  isValidEmail,
  sanitizeString,
  formatDate,
  isUserInChat,
  getChatPartner,
  parsePagination,
  createResponse,
};
