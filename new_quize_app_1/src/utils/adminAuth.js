import { getFromLocalStorage, saveToLocalStorage } from './storage';

/**
 * Check if the current user is an admin
 * @param {string} username - The username to check
 * @returns {boolean} - Whether the user is an admin
 */
export const isAdmin = (username) => {
  // Check if the user is explicitly set as admin
  if (username === 'admin') return true;
  
  // Check if the user has admin role in stored users
  const users = getFromLocalStorage('users', []);
  const user = users.find(user => user.username === username);
  
  return user?.role === 'admin';
};

/**
 * Set admin status for a user
 * @param {string} username - The username to set as admin
 * @param {boolean} status - Whether to set or unset admin status
 */
export const setAdminStatus = (username, status = true) => {
  const users = getFromLocalStorage('users', []);
  const userIndex = users.findIndex(user => user.username === username);
  
  if (userIndex !== -1) {
    users[userIndex].role = status ? 'admin' : 'user';
    saveToLocalStorage('users', users);
  }
};

/**
 * Get all admin users
 * @returns {Array} - Array of admin users
 */
export const getAdminUsers = () => {
  const users = getFromLocalStorage('users', []);
  return users.filter(user => user.role === 'admin');
};

/**
 * Check if a user has permission for a specific action
 * @param {string} username - The username to check
 * @param {string} permission - The permission to check
 * @returns {boolean} - Whether the user has the permission
 */
export const hasPermission = (username, permission) => {
  // Admin has all permissions
  if (isAdmin(username)) return true;
  
  // Check if the user is a moderator for certain permissions
  const users = getFromLocalStorage('users', []);
  const user = users.find(user => user.username === username);
  
  if (user?.role === 'moderator') {
    // Moderators can manage content but not users or settings
    const moderatorPermissions = [
      'view_dashboard',
      'manage_quizzes',
      'manage_questions',
      'manage_categories',
      'view_reports'
    ];
    
    return moderatorPermissions.includes(permission);
  }
  
  return false;
};

/**
 * Log admin activity for auditing
 * @param {string} username - The username performing the action
 * @param {string} action - The action performed
 * @param {Object} details - Additional details about the action
 */
export const logAdminActivity = (username, action, details = {}) => {
  const logs = getFromLocalStorage('adminActivityLogs', []);
  
  logs.push({
    username,
    action,
    details,
    timestamp: new Date().toISOString()
  });
  
  // Keep only the last 100 logs to prevent storage issues
  const trimmedLogs = logs.slice(-100);
  saveToLocalStorage('adminActivityLogs', trimmedLogs);
};

/**
 * Get admin activity logs
 * @param {number} limit - Maximum number of logs to return
 * @returns {Array} - Array of activity logs
 */
export const getAdminActivityLogs = (limit = 50) => {
  const logs = getFromLocalStorage('adminActivityLogs', []);
  return logs.slice(-limit).reverse();
};

/**
 * Initialize admin user if none exists
 */
export const initializeAdmin = () => {
  const users = getFromLocalStorage('users', []);
  
  // Check if admin user exists
  const adminExists = users.some(user => user.role === 'admin');
  
  if (!adminExists) {
    // Create default admin user
    users.push({
      id: '1',
      username: 'admin',
      email: 'admin@quizmaster.com',
      role: 'admin',
      status: 'active',
      quizzesTaken: 0,
      dateJoined: new Date().toISOString()
    });
    
    saveToLocalStorage('users', users);
  }
};