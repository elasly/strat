const logger = require('./logger');

// Role-based access control configuration
const rolesPermissions = {
  admin: {
    can: [
      'create_strategy',
      'edit_any_strategy',
      'delete_any_strategy',
      'view_any_strategy',
      'manage_users',
      'view_dashboard',
    ],
  },
  user: {
    can: [
      'create_strategy',
      'edit_own_strategy',
      'delete_own_strategy',
      'view_own_strategy',
      'view_dashboard',
    ],
  },
};

/**
 * Check if a user has permission to perform an action.
 * @param {String} role - The role of the user.
 * @param {String} action - The action to check permission for.
 * @returns {Boolean} True if the user has permission, false otherwise.
 */
function hasPermission(role, action) {
  try {
    const rolePermissions = rolesPermissions[role];
    if (!rolePermissions) {
      logger.error(`Role ${role} not found in role permissions.`);
      return false;
    }
    return rolePermissions.can.includes(action);
  } catch (error) {
    logger.error(`Error checking permission for role ${role} and action ${action}: ${error.message}`, error.stack);
    return false;
  }
}

module.exports = {
  hasPermission,
};