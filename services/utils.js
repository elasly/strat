const logger = require('./logger');

/**
 * Safely logs details about a password mismatch during the login process.
 * @param {string} enteredPassword - The password entered by the user.
 * @param {string} storedHash - The password hash stored in the database.
 * @param {string} userId - The identifier of the user attempting to log in.
 */
const logPasswordMismatch = (enteredPassword, storedHash, userId) => {
  // Log the lengths and presence of special characters without exposing actual password content
  const enteredLength = enteredPassword.length;
  const storedLength = storedHash.length;
  const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/g.test(enteredPassword);

  logger.debug(`Password mismatch info for user ID: ${userId} - Entered password length: ${enteredLength}, Stored hash length: ${storedLength}, Special characters in entered password: ${hasSpecialChars}`);
};

module.exports = {
  logPasswordMismatch,
};