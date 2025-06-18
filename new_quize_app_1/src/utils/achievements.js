import { getFromLocalStorage, saveToLocalStorage } from './storage';

// Define achievements
export const ACHIEVEMENTS = [
  {
    id: 'first_quiz',
    name: 'First Steps',
    description: 'Complete your first quiz',
    icon: 'trophy',
    condition: (stats) => stats.quizzesCompleted >= 1
  },
  {
    id: 'quiz_master',
    name: 'Quiz Master',
    description: 'Score 100% on any quiz',
    icon: 'crown',
    condition: (stats) => stats.perfectScores >= 1
  },
  {
    id: 'quick_thinker',
    name: 'Quick Thinker',
    description: 'Complete a quiz with more than 50% of the time remaining',
    icon: 'clock',
    condition: (stats) => stats.quickCompletions >= 1
  },
  {
    id: 'persistent',
    name: 'Persistent',
    description: 'Complete 5 quizzes',
    icon: 'medal',
    condition: (stats) => stats.quizzesCompleted >= 5
  },
  {
    id: 'knowledge_seeker',
    name: 'Knowledge Seeker',
    description: 'Complete quizzes in 3 different categories',
    icon: 'book',
    condition: (stats) => stats.uniqueCategories >= 3
  },
  {
    id: 'creator',
    name: 'Creator',
    description: 'Create your first custom quiz',
    icon: 'pencil',
    condition: (stats) => stats.customQuizzesCreated >= 1
  },
  {
    id: 'prolific_creator',
    name: 'Prolific Creator',
    description: 'Create 3 custom quizzes',
    icon: 'star',
    condition: (stats) => stats.customQuizzesCreated >= 3
  },
  {
    id: 'social_butterfly',
    name: 'Social Butterfly',
    description: 'Share a quiz result',
    icon: 'share',
    condition: (stats) => stats.resultsShared >= 1
  },
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Score 100% on 3 different quizzes',
    icon: 'diamond',
    condition: (stats) => stats.perfectScores >= 3
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Complete a quiz in less than half the allotted time',
    icon: 'bolt',
    condition: (stats) => stats.speedyCompletions >= 1
  }
];

// Get user stats
export const getUserStats = () => {
  return getFromLocalStorage('quizUserStats', {
    quizzesCompleted: 0,
    perfectScores: 0,
    quickCompletions: 0,
    speedyCompletions: 0,
    uniqueCategories: 0,
    customQuizzesCreated: 0,
    resultsShared: 0,
    categoriesCompleted: []
  });
};

// Update user stats
export const updateUserStats = (updates) => {
  const currentStats = getUserStats();
  const newStats = { ...currentStats, ...updates };
  
  // Special handling for categories
  if (updates.categoryCompleted && !currentStats.categoriesCompleted.includes(updates.categoryCompleted)) {
    newStats.categoriesCompleted = [...currentStats.categoriesCompleted, updates.categoryCompleted];
    newStats.uniqueCategories = newStats.categoriesCompleted.length;
  }
  
  saveToLocalStorage('quizUserStats', newStats);
  return checkAchievements(newStats);
};

// Get user achievements
export const getUserAchievements = () => {
  return getFromLocalStorage('quizUserAchievements', []);
};

// Check for new achievements
export const checkAchievements = (stats) => {
  const unlockedAchievements = getUserAchievements();
  const newAchievements = [];
  
  ACHIEVEMENTS.forEach(achievement => {
    // Skip if already unlocked
    if (unlockedAchievements.includes(achievement.id)) {
      return;
    }
    
    // Check if condition is met
    if (achievement.condition(stats)) {
      unlockedAchievements.push(achievement.id);
      newAchievements.push(achievement);
    }
  });
  
  // Save updated achievements
  if (newAchievements.length > 0) {
    saveToLocalStorage('quizUserAchievements', unlockedAchievements);
  }
  
  return newAchievements;
};

// Record quiz completion
export const recordQuizCompletion = (quizResult) => {
  const updates = {
    quizzesCompleted: getUserStats().quizzesCompleted + 1,
    categoryCompleted: quizResult.categoryId
  };
  
  // Check for perfect score
  if (quizResult.score === 100) {
    updates.perfectScores = getUserStats().perfectScores + 1;
  }
  
  // Check for quick completion
  if (quizResult.timeRemaining > quizResult.totalTime / 2) {
    updates.quickCompletions = getUserStats().quickCompletions + 1;
  }
  
  // Check for speedy completion
  if (quizResult.timeTaken < quizResult.totalTime / 2) {
    updates.speedyCompletions = getUserStats().speedyCompletions + 1;
  }
  
  return updateUserStats(updates);
};

// Record custom quiz creation
export const recordCustomQuizCreation = () => {
  return updateUserStats({
    customQuizzesCreated: getUserStats().customQuizzesCreated + 1
  });
};

// Record result sharing
export const recordResultSharing = () => {
  return updateUserStats({
    resultsShared: getUserStats().resultsShared + 1
  });
};