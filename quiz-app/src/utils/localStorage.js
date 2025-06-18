// Local storage utility for managing quiz data
export const STORAGE_KEYS = {
  LEADERBOARD: 'quiz_leaderboard',
  THEME: 'quiz_theme',
  SOUND_SETTINGS: 'quiz_sound_settings',
  PLAYER_STATS: 'quiz_player_stats'
};

// Leaderboard management
export const saveScore = (playerName, score, difficulty, category, timeSpent) => {
  try {
    const leaderboard = getLeaderboard();
    const newEntry = {
      id: Date.now(),
      playerName: playerName || 'Anonymous',
      score,
      difficulty,
      category,
      timeSpent,
      date: new Date().toISOString(),
      percentage: Math.round((score.correct / score.total) * 100)
    };

    leaderboard.push(newEntry);
    
    // Sort by score (correct answers) and then by time
    leaderboard.sort((a, b) => {
      if (b.score.correct !== a.score.correct) {
        return b.score.correct - a.score.correct;
      }
      return a.timeSpent - b.timeSpent;
    });

    // Keep only top 50 scores
    const topScores = leaderboard.slice(0, 50);
    localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(topScores));
    
    return newEntry;
  } catch (error) {
    console.error('Error saving score:', error);
    return null;
  }
};

export const getLeaderboard = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.LEADERBOARD);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading leaderboard:', error);
    return [];
  }
};

export const getTopScores = (limit = 10) => {
  return getLeaderboard().slice(0, limit);
};

// Theme management
export const saveTheme = (theme) => {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch (error) {
    console.error('Error saving theme:', error);
  }
};

export const getTheme = () => {
  try {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
  } catch (error) {
    console.error('Error loading theme:', error);
    return 'light';
  }
};

// Sound settings management
export const saveSoundSettings = (settings) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SOUND_SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving sound settings:', error);
  }
};

export const getSoundSettings = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SOUND_SETTINGS);
    return stored ? JSON.parse(stored) : { muted: false, volume: 0.5 };
  } catch (error) {
    console.error('Error loading sound settings:', error);
    return { muted: false, volume: 0.5 };
  }
};

// Player statistics
export const savePlayerStats = (stats) => {
  try {
    const currentStats = getPlayerStats();
    const updatedStats = {
      ...currentStats,
      totalQuizzes: (currentStats.totalQuizzes || 0) + 1,
      totalQuestions: (currentStats.totalQuestions || 0) + stats.totalQuestions,
      totalCorrect: (currentStats.totalCorrect || 0) + stats.correct,
      totalTime: (currentStats.totalTime || 0) + stats.timeSpent,
      bestScore: Math.max(currentStats.bestScore || 0, stats.correct),
      averageScore: 0, // Will be calculated
      lastPlayed: new Date().toISOString()
    };
    
    // Calculate average score
    updatedStats.averageScore = Math.round((updatedStats.totalCorrect / updatedStats.totalQuestions) * 100);
    
    localStorage.setItem(STORAGE_KEYS.PLAYER_STATS, JSON.stringify(updatedStats));
    return updatedStats;
  } catch (error) {
    console.error('Error saving player stats:', error);
    return null;
  }
};

export const getPlayerStats = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PLAYER_STATS);
    return stored ? JSON.parse(stored) : {
      totalQuizzes: 0,
      totalQuestions: 0,
      totalCorrect: 0,
      totalTime: 0,
      bestScore: 0,
      averageScore: 0,
      lastPlayed: null
    };
  } catch (error) {
    console.error('Error loading player stats:', error);
    return {
      totalQuizzes: 0,
      totalQuestions: 0,
      totalCorrect: 0,
      totalTime: 0,
      bestScore: 0,
      averageScore: 0,
      lastPlayed: null
    };
  }
};

// Clear all data
export const clearAllData = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
};