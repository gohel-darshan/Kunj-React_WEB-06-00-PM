// Power-ups system for enhanced gameplay
export const POWER_UPS = {
  DOUBLE_POINTS: {
    id: 'double_points',
    name: 'Double Points',
    description: 'Double points for the next 3 questions',
    icon: '💎',
    cost: 100,
    duration: 3,
    effect: 'multiplier',
    value: 2
  },
  EXTRA_TIME: {
    id: 'extra_time',
    name: 'Extra Time',
    description: 'Add 15 seconds to current question',
    icon: '⏰',
    cost: 50,
    duration: 1,
    effect: 'time_bonus',
    value: 15
  },
  FREEZE_TIME: {
    id: 'freeze_time',
    name: 'Freeze Time',
    description: 'Stop the timer for 10 seconds',
    icon: '❄️',
    cost: 75,
    duration: 1,
    effect: 'time_freeze',
    value: 10
  },
  LUCKY_GUESS: {
    id: 'lucky_guess',
    name: 'Lucky Guess',
    description: 'Automatically get the next question right',
    icon: '🍀',
    cost: 150,
    duration: 1,
    effect: 'auto_correct',
    value: 1
  },
  HINT_MASTER: {
    id: 'hint_master',
    name: 'Hint Master',
    description: 'Get 3 extra hints',
    icon: '💡',
    cost: 80,
    duration: 0,
    effect: 'extra_hints',
    value: 3
  },
  SHIELD: {
    id: 'shield',
    name: 'Shield',
    description: 'Next wrong answer won\'t count against you',
    icon: '🛡️',
    cost: 120,
    duration: 1,
    effect: 'mistake_protection',
    value: 1
  },
  CATEGORY_REVEAL: {
    id: 'category_reveal',
    name: 'Category Reveal',
    description: 'Show the category for next 5 questions',
    icon: '🔍',
    cost: 60,
    duration: 5,
    effect: 'category_hint',
    value: 1
  },
  STREAK_SAVER: {
    id: 'streak_saver',
    name: 'Streak Saver',
    description: 'Maintain streak even if you get one wrong',
    icon: '🔗',
    cost: 90,
    duration: 1,
    effect: 'streak_protection',
    value: 1
  }
};

export class PowerUpManager {
  constructor() {
    this.activePowerUps = new Map();
    this.playerCoins = 0;
  }

  // Initialize with saved data
  initialize(savedData) {
    this.playerCoins = savedData.coins || 0;
    this.activePowerUps = new Map(savedData.activePowerUps || []);
  }

  // Purchase a power-up
  purchasePowerUp(powerUpId) {
    const powerUp = POWER_UPS[powerUpId];
    if (!powerUp || this.playerCoins < powerUp.cost) {
      return { success: false, message: 'Insufficient coins' };
    }

    this.playerCoins -= powerUp.cost;
    
    // Add to inventory or activate immediately
    if (powerUp.duration === 0) {
      // Instant effect power-ups
      return { success: true, message: 'Power-up activated!', effect: powerUp };
    } else {
      // Duration-based power-ups
      this.activePowerUps.set(powerUpId, {
        ...powerUp,
        remainingDuration: powerUp.duration,
        activated: false
      });
      return { success: true, message: 'Power-up ready to use!' };
    }
  }

  // Activate a power-up
  activatePowerUp(powerUpId) {
    const powerUp = this.activePowerUps.get(powerUpId);
    if (!powerUp) {
      return { success: false, message: 'Power-up not available' };
    }

    powerUp.activated = true;
    return { success: true, effect: powerUp };
  }

  // Apply power-up effects
  applyEffects(context) {
    const effects = {
      pointsMultiplier: 1,
      timeBonus: 0,
      autoCorrect: false,
      mistakeProtection: false,
      streakProtection: false,
      categoryHint: false
    };

    this.activePowerUps.forEach((powerUp, id) => {
      if (!powerUp.activated) return;

      switch (powerUp.effect) {
        case 'multiplier':
          effects.pointsMultiplier *= powerUp.value;
          break;
        case 'time_bonus':
          effects.timeBonus += powerUp.value;
          break;
        case 'auto_correct':
          effects.autoCorrect = true;
          break;
        case 'mistake_protection':
          effects.mistakeProtection = true;
          break;
        case 'streak_protection':
          effects.streakProtection = true;
          break;
        case 'category_hint':
          effects.categoryHint = true;
          break;
      }
    });

    return effects;
  }

  // Reduce duration after each question
  updateDurations() {
    const toRemove = [];
    
    this.activePowerUps.forEach((powerUp, id) => {
      if (powerUp.activated) {
        powerUp.remainingDuration--;
        if (powerUp.remainingDuration <= 0) {
          toRemove.push(id);
        }
      }
    });

    toRemove.forEach(id => this.activePowerUps.delete(id));
  }

  // Add coins (earned from quiz performance)
  addCoins(amount) {
    this.playerCoins += amount;
  }

  // Get current state
  getState() {
    return {
      coins: this.playerCoins,
      activePowerUps: Array.from(this.activePowerUps.entries()),
      availablePowerUps: Object.values(POWER_UPS)
    };
  }

  // Calculate coins earned from quiz performance
  static calculateCoinsEarned(score, difficulty, streak, timeBonus) {
    let coins = score * 2; // Base: 2 coins per correct answer
    
    // Difficulty bonus
    const difficultyMultiplier = { easy: 1, medium: 1.5, hard: 2 };
    coins *= difficultyMultiplier[difficulty] || 1;
    
    // Streak bonus
    if (streak >= 5) coins += streak * 2;
    
    // Time bonus
    if (timeBonus > 0) coins += Math.floor(timeBonus / 5);
    
    return Math.floor(coins);
  }
}