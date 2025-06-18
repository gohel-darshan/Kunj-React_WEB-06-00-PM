// Achievement system for the quiz app
export const ACHIEVEMENTS = {
  FIRST_QUIZ: {
    id: 'first_quiz',
    name: 'Getting Started',
    description: 'Complete your first quiz',
    icon: '🎯',
    condition: (stats) => stats.totalQuizzes >= 1
  },
  PERFECT_SCORE: {
    id: 'perfect_score',
    name: 'Perfectionist',
    description: 'Get 100% on any quiz',
    icon: '🏆',
    condition: (stats) => stats.bestPercentage === 100
  },
  SPEED_DEMON: {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Answer 5 questions in under 30 seconds total',
    icon: '⚡',
    condition: (stats) => stats.fastestFiveQuestions < 30000
  },
  STREAK_MASTER: {
    id: 'streak_master',
    name: 'Streak Master',
    description: 'Get 10 correct answers in a row',
    icon: '🔥',
    condition: (stats) => stats.longestStreak >= 10
  },
  CATEGORY_EXPERT: {
    id: 'category_expert',
    name: 'Category Expert',
    description: 'Get 90%+ in all categories',
    icon: '🧠',
    condition: (stats) => {
      const categories = ['science', 'history', 'geography', 'technology', 'sports'];
      return categories.every(cat => stats.categoryStats[cat]?.percentage >= 90);
    }
  },
  QUIZ_ADDICT: {
    id: 'quiz_addict',
    name: 'Quiz Addict',
    description: 'Complete 50 quizzes',
    icon: '🎮',
    condition: (stats) => stats.totalQuizzes >= 50
  },
  HARD_MODE_HERO: {
    id: 'hard_mode_hero',
    name: 'Hard Mode Hero',
    description: 'Complete 10 hard difficulty quizzes',
    icon: '💪',
    condition: (stats) => stats.hardQuizzes >= 10
  },
  NO_HINTS_NEEDED: {
    id: 'no_hints_needed',
    name: 'No Hints Needed',
    description: 'Complete a quiz without using any hints',
    icon: '🧩',
    condition: (stats) => stats.quizzesWithoutHints >= 1
  },
  COMEBACK_KID: {
    id: 'comeback_kid',
    name: 'Comeback Kid',
    description: 'Score 80%+ after scoring below 50%',
    icon: '📈',
    condition: (stats) => stats.hasComeback === true
  },
  KNOWLEDGE_SEEKER: {
    id: 'knowledge_seeker',
    name: 'Knowledge Seeker',
    description: 'Answer 1000 questions total',
    icon: '📚',
    condition: (stats) => stats.totalQuestions >= 1000
  }
};

export const checkAchievements = (stats) => {
  const unlockedAchievements = [];
  const existingAchievements = stats.achievements || [];
  
  Object.values(ACHIEVEMENTS).forEach(achievement => {
    if (!existingAchievements.includes(achievement.id) && achievement.condition(stats)) {
      unlockedAchievements.push(achievement);
    }
  });
  
  return unlockedAchievements;
};

export const getAchievementProgress = (stats) => {
  const progress = {};
  
  Object.values(ACHIEVEMENTS).forEach(achievement => {
    const unlocked = stats.achievements?.includes(achievement.id) || false;
    progress[achievement.id] = {
      ...achievement,
      unlocked,
      progress: unlocked ? 100 : calculateProgress(achievement, stats)
    };
  });
  
  return progress;
};

const calculateProgress = (achievement, stats) => {
  switch (achievement.id) {
    case 'first_quiz':
      return Math.min(100, (stats.totalQuizzes / 1) * 100);
    case 'perfect_score':
      return Math.min(100, stats.bestPercentage || 0);
    case 'speed_demon':
      return stats.fastestFiveQuestions ? Math.max(0, 100 - ((stats.fastestFiveQuestions - 30000) / 1000)) : 0;
    case 'streak_master':
      return Math.min(100, ((stats.longestStreak || 0) / 10) * 100);
    case 'quiz_addict':
      return Math.min(100, ((stats.totalQuizzes || 0) / 50) * 100);
    case 'hard_mode_hero':
      return Math.min(100, ((stats.hardQuizzes || 0) / 10) * 100);
    case 'knowledge_seeker':
      return Math.min(100, ((stats.totalQuestions || 0) / 1000) * 100);
    default:
      return 0;
  }
};