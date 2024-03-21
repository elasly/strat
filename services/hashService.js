const bcrypt = require('bcrypt');
const logger = require('./logger');

/**
 * Hashes a password using bcrypt.
 * @param {string} password - The plain text password to hash.
 * @returns {Promise<string>} A promise that resolves with the hashed password.
 */
const hashPassword = async (password) => {
  try {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  } catch (error) {
    logger.error(`Error hashing password: ${error.message}`, error.stack);
    throw error;
  }
};

/**
 * Compares a plain text password with a hashed password to check if they match.
 * @param {string} password - The plain text password.
 * @param {string} hash - The hashed password.
 * @returns {Promise<boolean>} A promise that resolves with a boolean indicating if the passwords match.
 */
const comparePassword = async (password, hash) => {
  try {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
  } catch (error) {
    logger.error(`Error comparing password: ${error.message}`, error.stack);
    throw error;
  }
};

module.exports = {
  hashPassword,
  comparePassword,
};