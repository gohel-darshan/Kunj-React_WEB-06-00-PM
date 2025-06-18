/**
 * Saves data to localStorage
 * @param {string} key - The key to save under
 * @param {*} data - The data to save
 */
export const saveToLocalStorage = (key, data) => {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

/**
 * Retrieves data from localStorage
 * @param {string} key - The key to retrieve
 * @param {*} defaultValue - Default value if key doesn't exist
 * @returns {*} - The retrieved data or default value
 */
export const getFromLocalStorage = (key, defaultValue = null) => {
  try {
    const serializedData = localStorage.getItem(key);
    if (serializedData === null) {
      return defaultValue;
    }
    return JSON.parse(serializedData);
  } catch (error) {
    console.error('Error retrieving from localStorage:', error);
    return defaultValue;
  }
};

/**
 * Removes data from localStorage
 * @param {string} key - The key to remove
 */
export const removeFromLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

/**
 * Clears all data from localStorage
 */
export const clearLocalStorage = () => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

/**
 * Saves quiz progress to localStorage
 * @param {Object} progress - The quiz progress to save
 */
export const saveQuizProgress = (progress) => {
  saveToLocalStorage('quizProgress', progress);
};

/**
 * Retrieves quiz progress from localStorage
 * @returns {Object|null} - The quiz progress or null
 */
export const getQuizProgress = () => {
  return getFromLocalStorage('quizProgress');
};

/**
 * Saves user settings to localStorage
 * @param {Object} settings - The user settings to save
 */
export const saveUserSettings = (settings) => {
  saveToLocalStorage('quizUserSettings', settings);
};

/**
 * Retrieves user settings from localStorage
 * @returns {Object} - The user settings or default settings
 */
export const getUserSettings = () => {
  return getFromLocalStorage('quizUserSettings', {
    theme: 'light',
    sound: true,
    notifications: true,
    difficulty: 'medium',
    questionsPerQuiz: 10,
    timePerQuestion: 30,
  });
};

/**
 * Saves quiz result to leaderboard in localStorage
 * @param {Object} result - The quiz result to save
 */
export const saveQuizResult = (result) => {
  const leaderboard = getFromLocalStorage('quizLeaderboard', []);
  leaderboard.push({
    ...result,
    timestamp: new Date().toISOString(),
  });
  
  // Sort by score (highest first)
  leaderboard.sort((a, b) => b.score - a.score);
  
  saveToLocalStorage('quizLeaderboard', leaderboard);
};

/**
 * Retrieves leaderboard from localStorage
 * @param {string|null} categoryId - Optional category ID to filter by
 * @returns {Array} - The leaderboard entries
 */
export const getLeaderboard = (categoryId = null) => {
  const leaderboard = getFromLocalStorage('quizLeaderboard', []);
  
  if (categoryId) {
    return leaderboard.filter(entry => entry.categoryId === categoryId);
  }
  
  return leaderboard;
};

/**
 * Saves custom quiz to localStorage
 * @param {Object} quiz - The custom quiz to save
 */
export const saveCustomQuiz = (quiz) => {
  const customQuizzes = getFromLocalStorage('customQuizzes', []);
  
  // Check if quiz with same ID exists
  const existingIndex = customQuizzes.findIndex(q => q.id === quiz.id);
  
  if (existingIndex >= 0) {
    // Update existing quiz
    customQuizzes[existingIndex] = quiz;
  } else {
    // Add new quiz
    customQuizzes.push(quiz);
  }
  
  saveToLocalStorage('customQuizzes', customQuizzes);
};

/**
 * Retrieves custom quizzes from localStorage
 * @returns {Array} - The custom quizzes
 */
export const getCustomQuizzes = () => {
  return getFromLocalStorage('customQuizzes', []);
};

/**
 * Removes a custom quiz from localStorage
 * @param {string} quizId - The ID of the quiz to remove
 */
export const removeCustomQuiz = (quizId) => {
  const customQuizzes = getFromLocalStorage('customQuizzes', []);
  const updatedQuizzes = customQuizzes.filter(quiz => quiz.id !== quizId);
  saveToLocalStorage('customQuizzes', updatedQuizzes);
};