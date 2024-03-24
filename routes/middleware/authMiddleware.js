const User = require('../../models/User');
const logger = require('../../services/logger');

const isAuthenticated = async (req, res, next) => {
  if (req.session && req.session.userId) {
    try {
      const user = await User.findById(req.session.userId);
      if (!user) {
        logger.warn('Authentication failed: User not found in the database.');
        return res.status(401).send('Authentication failed: User not found.');
      }
      req.user = user; // Attaching the user to the request object
      return next(); // User is authenticated, proceed to the next middleware/route handler
    } catch (error) {
      logger.error(`Error during authentication: ${error.message}`, error.stack);
      return res.status(500).send('Internal server error during authentication.');
    }
  } else {
    logger.warn('User is not authenticated, session or userId missing.');
    return res.status(401).send('You are not authenticated'); // User is not authenticated
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next(); // User is admin, proceed to the next middleware/route handler
  } else {
    logger.warn('Access denied: User is not an admin.');
    return res.status(403).send('Access denied: You do not have admin privileges.');
  }
};

module.exports = {
  isAuthenticated,
  isAdmin
};