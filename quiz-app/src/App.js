import React, { useState, useEffect, useCallback } from 'react';
import { questionDatabase, getQuestionsByDifficulty, shuffleArray } from './data/questions';
import soundManager from './utils/soundManager';
import { saveScore, getTopScores, saveTheme, getTheme, saveSoundSettings, getSoundSettings, savePlayerStats } from './utils/localStorage';
import { checkAchievements, getAchievementProgress } from './utils/achievements';
import { PowerUpManager, POWER_UPS } from './utils/powerUps';
import voiceRecognition from './utils/voiceRecognition';
import aiQuestionGenerator from './utils/aiQuestionGenerator';

function App() {
  // Original useState hooks
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [totalScore, setTotalScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  // Enhanced useState hooks for new features
  const [timeLeft, setTimeLeft] = useState(30);
  const [difficulty, setDifficulty] = useState('easy');
  const [theme, setTheme] = useState('light');
  const [hintsUsed, setHintsUsed] = useState(0);
  const [playerName, setPlayerName] = useState('');
  const [questionOrder, setQuestionOrder] = useState([]);
  const [detailedResults, setDetailedResults] = useState([]);
  
  // Additional state for enhanced features
  const [gamePhase, setGamePhase] = useState('setup'); // setup, playing, results, leaderboard
  const [availableHints, setAvailableHints] = useState(3);
  const [showHint, setShowHint] = useState(false);
  const [eliminatedOptions, setEliminatedOptions] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [category, setCategory] = useState('all');

  // New advanced features state
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [powerUpManager] = useState(new PowerUpManager());
  const [activePowerUps, setActivePowerUps] = useState(new Map());
  const [playerCoins, setPlayerCoins] = useState(0);
  const [achievements, setAchievements] = useState([]);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState([]);
  const [studyMode, setStudyMode] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [adaptiveDifficulty, setAdaptiveDifficulty] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showPowerUps, setShowPowerUps] = useState(false);
  const [customTheme, setCustomTheme] = useState(null);
  const [offlineMode, setOfflineMode] = useState(false);
  const [socialShare, setSocialShare] = useState(false);
  const [videoExplanations, setVideoExplanations] = useState(false);
  const [learningPath, setLearningPath] = useState([]);
  const [playerLevel, setPlayerLevel] = useState(1);
  const [playerXP, setPlayerXP] = useState(0);

  // --- New Feature: Daily Challenge ---
  const [dailyChallenge, setDailyChallenge] = useState(null);
  const [showDailyChallenge, setShowDailyChallenge] = useState(false);

  useEffect(() => {
    // Generate a daily challenge question (random from all categories)
    const allQuestions = Object.values(questionDatabase).flatMap(cat => Object.values(cat).flat().map(q => q));
    const todaySeed = new Date().toISOString().slice(0, 10);
    const randomIndex = Math.abs(todaySeed.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % allQuestions.length;
    setDailyChallenge(allQuestions[randomIndex]);
  }, []);

  const startDailyChallenge = () => {
    setShowDailyChallenge(true);
  };

  // Initialize app
  useEffect(() => {
    // Load saved settings
    const savedTheme = getTheme();
    const soundSettings = getSoundSettings();
    
    setTheme(savedTheme);
    setIsMuted(soundSettings.muted);
    
    // Initialize sound manager
    soundManager.initSounds();
    soundManager.setVolume(soundSettings.volume);
    if (soundSettings.muted) {
      soundManager.toggleMute();
    }
    
    // Load leaderboard
    setLeaderboard(getTopScores());
    
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  // Timer effect
  useEffect(() => {
    if (gamePhase === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
        if (timeLeft <= 10 && timeLeft > 0) {
          soundManager.play('tick');
        }
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gamePhase === 'playing') {
      handleTimeUp();
    }
  }, [timeLeft, gamePhase]);

  // Get time limit based on difficulty
  const getTimeLimit = () => {
    switch (difficulty) {
      case 'easy': return 45;
      case 'medium': return 30;
      case 'hard': return 20;
      default: return 30;
    }
  };

  // Get score multiplier based on difficulty
  const getScoreMultiplier = () => {
    switch (difficulty) {
      case 'easy': return 1;
      case 'medium': return 1.5;
      case 'hard': return 2;
      default: return 1;
    }
  };

  // Start quiz
  const startQuiz = () => {
    if (!playerName.trim()) {
      alert('Please enter your name!');
      return;
    }

    // Get questions based on difficulty
    const questions = getQuestionsByDifficulty(difficulty);
    const shuffledQuestions = shuffleArray(questions).slice(0, 10); // Take 10 random questions
    
    setQuestionOrder(shuffledQuestions);
    setGamePhase('playing');
    setStartTime(Date.now());
    setQuestionStartTime(Date.now());
    setTimeLeft(getTimeLimit());
    setCurrentQuestionIndex(0);
    setTotalScore(0);
    setSelectedAnswer(null);
    setDetailedResults([]);
    setAvailableHints(3);
    setHintsUsed(0);
    setShowHint(false);
    setEliminatedOptions([]);
  };

  // Handle time up
  const handleTimeUp = () => {
    handleAnswerSubmit(null, true);
  };

  // Handle answer submission
  const handleAnswerSubmit = (selectedOptionIndex, isTimeUp = false) => {
    const currentQuestion = questionOrder[currentQuestionIndex];
    const questionTime = Date.now() - questionStartTime;
    const isCorrect = selectedOptionIndex === currentQuestion.correctAnswer;
    
    // Update streak
    updateStreak(isCorrect);
    
    // Apply power-up effects
    const powerUpEffects = powerUpManager.applyEffects();
    
    // Calculate points with power-ups
    let points = 0;
    if (isCorrect && !isTimeUp) {
      points = Math.round(10 * getScoreMultiplier() * powerUpEffects.pointsMultiplier);
      // Bonus for quick answers
      if (questionTime < 10000) points += 5;
      // Bonus for not using hints
      if (hintsUsed === 0) points += 3;
      // Streak bonus
      if (currentStreak >= 3) points += currentStreak;
    }

    // Calculate XP gain
    const xpGain = calculateXPGain(isCorrect, difficulty, questionTime < 10000 ? 5 : 0, currentStreak);
    updatePlayerLevel(playerXP + xpGain);

    // Calculate coins earned
    const coinsEarned = PowerUpManager.calculateCoinsEarned(
      isCorrect ? 1 : 0, 
      difficulty, 
      currentStreak, 
      questionTime < 10000 ? 5 : 0
    );
    powerUpManager.addCoins(coinsEarned);
    setPlayerCoins(powerUpManager.getState().coins);

    // Play sound
    if (isTimeUp) {
      soundManager.play('wrong');
    } else if (isCorrect) {
      soundManager.play('correct');
    } else {
      soundManager.play('wrong');
    }

    // Save detailed result
    const result = {
      question: currentQuestion.question,
      selectedAnswer: selectedOptionIndex,
      correctAnswer: currentQuestion.correctAnswer,
      options: currentQuestion.options,
      isCorrect,
      timeSpent: questionTime,
      points,
      xpGained: xpGain,
      coinsEarned,
      streakAtTime: currentStreak,
      isTimeUp,
      powerUpsActive: Array.from(activePowerUps.keys())
    };
    
    setDetailedResults(prev => [...prev, result]);
    setSelectedAnswer(selectedOptionIndex);

    if (isCorrect) {
      setTotalScore(prev => prev + points);
    }

    // Update power-up durations
    powerUpManager.updateDurations();
    setActivePowerUps(new Map(powerUpManager.activePowerUps));

    // Show a fun fact after each question
    showRandomFunFact();

    // Check for adaptive difficulty adjustment
    adjustDifficultyBasedOnPerformance();

    // Move to next question or show results
    setTimeout(() => {
      const nextQuestionIndex = currentQuestionIndex + 1;
      
      if (nextQuestionIndex < questionOrder.length) {
        setCurrentQuestionIndex(nextQuestionIndex);
        setSelectedAnswer(null);
        setTimeLeft(studyMode ? 999 : getTimeLimit());
        setQuestionStartTime(Date.now());
        setShowHint(false);
        setEliminatedOptions([]);
      } else {
        finishQuiz();
      }
    }, 1500);

    // --- New Feature: Fun Fact After Each Question ---
    showRandomFunFact();
  };

  // Finish quiz
  const finishQuiz = () => {
    const totalTime = Date.now() - startTime;
    const correctAnswers = detailedResults.filter(r => r.isCorrect).length;
    const percentage = Math.round((correctAnswers / questionOrder.length) * 100);
    
    // Save score and stats
    const scoreData = {
      correct: correctAnswers,
      total: questionOrder.length,
      points: totalScore,
      timeSpent: totalTime
    };
    
    saveScore(playerName, scoreData, difficulty, category, totalTime);
    
    // Enhanced stats for achievements
    const enhancedStats = {
      totalQuestions: questionOrder.length,
      correct: correctAnswers,
      timeSpent: totalTime,
      percentage,
      difficulty,
      longestStreak,
      hintsUsed,
      powerUpsUsed: Array.from(activePowerUps.keys()).length,
      perfectScore: percentage === 100,
      noHintsUsed: hintsUsed === 0
    };
    
    savePlayerStats(enhancedStats);
    
    // Check for new achievements
    const currentStats = {
      totalQuizzes: 1, // This would be loaded from storage in real implementation
      bestPercentage: percentage,
      longestStreak,
      achievements: achievements,
      categoryStats: { [category]: { percentage } }
    };
    checkAndUnlockAchievements(currentStats);
    
    // Update leaderboard
    setLeaderboard(getTopScores());
    
    // Play completion sound
    soundManager.play('complete');
    
    setGamePhase('results');
  };

  // Use hint - 50/50
  const useFiftyFifty = () => {
    if (availableHints <= 0) return;
    
    const currentQuestion = questionOrder[currentQuestionIndex];
    const correctAnswer = currentQuestion.correctAnswer;
    const wrongOptions = [0, 1, 2, 3].filter(i => i !== correctAnswer);
    
    // Randomly select 2 wrong options to eliminate
    const toEliminate = shuffleArray(wrongOptions).slice(0, 2);
    setEliminatedOptions(toEliminate);
    setAvailableHints(prev => prev - 1);
    setHintsUsed(prev => prev + 1);
    
    soundManager.play('hint');
  };

  // Skip question
  const skipQuestion = () => {
    if (availableHints <= 0) return;
    
    setAvailableHints(prev => prev - 1);
    setHintsUsed(prev => prev + 1);
    handleAnswerSubmit(null, false);
  };

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    saveTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Toggle sound
  const toggleSound = () => {
    const newMutedState = soundManager.toggleMute();
    setIsMuted(newMutedState);
    saveSoundSettings({ muted: newMutedState, volume: 0.5 });
  };

  // Restart quiz
  const restartQuiz = () => {
    setGamePhase('setup');
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setTotalScore(0);
    setShowScore(false);
    setTimeLeft(30);
    setDetailedResults([]);
    setAvailableHints(3);
    setHintsUsed(0);
    setShowHint(false);
    setEliminatedOptions([]);
  };

  // Get current question
  const currentQuestion = questionOrder[currentQuestionIndex];

  // Calculate progress percentage
  const progressPercentage = questionOrder.length > 0 ? 
    ((currentQuestionIndex) / questionOrder.length) * 100 : 0;

  // Get score message
  const getScoreMessage = () => {
    const correctAnswers = detailedResults.filter(r => r.isCorrect).length;
    const percentage = Math.round((correctAnswers / questionOrder.length) * 100);
    if (percentage >= 90) return "Outstanding! 🏆";
    if (percentage >= 80) return "Excellent! 🎉";
    if (percentage >= 70) return "Great job! 👍";
    if (percentage >= 60) return "Good work! 👌";
    if (percentage >= 50) return "Not bad! 😊";
    return "Keep practicing! 💪";
  };

  // New feature functions
  
  // Streak management
  const updateStreak = (isCorrect) => {
    if (isCorrect) {
      const newStreak = currentStreak + 1;
      setCurrentStreak(newStreak);
      if (newStreak > longestStreak) {
        setLongestStreak(newStreak);
      }
    } else {
      setCurrentStreak(0);
    }
  };

  // Power-up functions
  const purchasePowerUp = (powerUpId) => {
    const result = powerUpManager.purchasePowerUp(powerUpId);
    if (result.success) {
      setPlayerCoins(powerUpManager.getState().coins);
      if (result.effect) {
        // Apply instant effect
        applyPowerUpEffect(result.effect);
      }
    }
    return result;
  };

  const activatePowerUp = (powerUpId) => {
    const result = powerUpManager.activatePowerUp(powerUpId);
    if (result.success) {
      setActivePowerUps(new Map(powerUpManager.activePowerUps));
    }
    return result;
  };

  const applyPowerUpEffect = (effect) => {
    switch (effect.effect) {
      case 'extra_hints':
        setAvailableHints(prev => prev + effect.value);
        break;
      case 'time_bonus':
        setTimeLeft(prev => prev + effect.value);
        break;
      case 'time_freeze':
        // Implement time freeze logic
        break;
      default:
        break;
    }
  };

  // Achievement system
  const checkAndUnlockAchievements = (stats) => {
    const newAchievements = checkAchievements(stats);
    if (newAchievements.length > 0) {
      setAchievements(prev => [...prev, ...newAchievements.map(a => a.id)]);
      // Show achievement notification
      newAchievements.forEach(achievement => {
        showAchievementNotification(achievement);
      });
    }
  };

  const showAchievementNotification = (achievement) => {
    // Create achievement notification
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
      <div class="achievement-content">
        <span class="achievement-icon">${achievement.icon}</span>
        <div class="achievement-text">
          <div class="achievement-name">${achievement.name}</div>
          <div class="achievement-description">${achievement.description}</div>
        </div>
      </div>
    `;
    document.body.appendChild(notification);
    
    // Remove after animation
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 4000);
  };

  // Voice recognition functions
  const toggleVoiceRecognition = () => {
    if (!voiceRecognition.isVoiceSupported()) {
      alert('Voice recognition is not supported in your browser');
      return;
    }

    if (isListening) {
      voiceRecognition.stopListening();
      setIsListening(false);
    } else {
      startVoiceListening();
    }
  };

  const startVoiceListening = () => {
    if (!currentQuestion) return;

    setIsListening(true);
    voiceRecognition.startListening(
      currentQuestion.options,
      (result) => {
        setIsListening(false);
        if (result.success && result.matchedOption) {
          if (result.matchedOption.action) {
            // Handle voice commands
            handleVoiceCommand(result.matchedOption.action);
          } else if (typeof result.matchedOption.index === 'number') {
            // Handle answer selection
            handleAnswerSubmit(result.matchedOption.index);
          }
        }
      }
    );
  };

  const handleVoiceCommand = (command) => {
    switch (command) {
      case 'skip':
        skipQuestion();
        break;
      case 'hint':
      case 'fiftyFifty':
        useFiftyFifty();
        break;
      case 'help':
        speakInstructions();
        break;
      case 'pause':
        // Implement pause functionality
        break;
      case 'stop':
        voiceRecognition.stopListening();
        setIsListening(false);
        break;
      default:
        break;
    }
  };

  const speakInstructions = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        'You can say A, B, C, or D to select an answer. Say skip to skip the question, or hint for help.'
      );
      speechSynthesis.speak(utterance);
    }
  };

  // Bookmark functions
  const toggleBookmark = (question) => {
    setBookmarkedQuestions(prev => {
      const isBookmarked = prev.some(q => q.question === question.question);
      if (isBookmarked) {
        return prev.filter(q => q.question !== question.question);
      } else {
        return [...prev, { ...question, bookmarkedAt: Date.now() }];
      }
    });
  };

  const isQuestionBookmarked = (question) => {
    return bookmarkedQuestions.some(q => q.question === question.question);
  };

  // Study mode functions
  const toggleStudyMode = () => {
    setStudyMode(!studyMode);
    if (!studyMode) {
      // Entering study mode - no time pressure
      setTimeLeft(999);
    }
  };

  // Adaptive difficulty
  const adjustDifficultyBasedOnPerformance = () => {
    if (!adaptiveDifficulty) return;

    const recentPerformance = detailedResults.slice(-5); // Last 5 questions
    const recentAccuracy = recentPerformance.filter(r => r.isCorrect).length / recentPerformance.length;

    if (recentAccuracy >= 0.8 && difficulty === 'easy') {
      setDifficulty('medium');
    } else if (recentAccuracy >= 0.8 && difficulty === 'medium') {
      setDifficulty('hard');
    } else if (recentAccuracy <= 0.4 && difficulty === 'hard') {
      setDifficulty('medium');
    } else if (recentAccuracy <= 0.4 && difficulty === 'medium') {
      setDifficulty('easy');
    }
  };

  // XP and leveling system
  const calculateXPGain = (isCorrect, difficulty, timeBonus, streak) => {
    let xp = 0;
    if (isCorrect) {
      xp = 10; // Base XP
      const difficultyMultiplier = { easy: 1, medium: 1.5, hard: 2 };
      xp *= difficultyMultiplier[difficulty] || 1;
      
      // Time bonus
      if (timeBonus > 0) xp += Math.floor(timeBonus / 5);
      
      // Streak bonus
      if (streak >= 3) xp += streak * 2;
    }
    return Math.floor(xp);
  };

  const updatePlayerLevel = (newXP) => {
    const xpForNextLevel = playerLevel * 100; // 100 XP per level
    if (newXP >= xpForNextLevel) {
      setPlayerLevel(prev => prev + 1);
      setPlayerXP(newXP - xpForNextLevel);
      // Show level up notification
      showLevelUpNotification(playerLevel + 1);
    } else {
      setPlayerXP(newXP);
    }
  };

  const showLevelUpNotification = (newLevel) => {
    const notification = document.createElement('div');
    notification.className = 'level-up-notification';
    notification.innerHTML = `
      <div class="level-up-content">
        <span class="level-up-icon">🎉</span>
        <div class="level-up-text">
          <div class="level-up-title">Level Up!</div>
          <div class="level-up-level">Level ${newLevel}</div>
        </div>
      </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  };

  // Social sharing
  const shareScore = (platform) => {
    const correctAnswers = detailedResults.filter(r => r.isCorrect).length;
    const percentage = Math.round((correctAnswers / questionOrder.length) * 100);
    const text = `I just scored ${percentage}% on the Enhanced Quiz App! 🎯 Can you beat my score?`;
    const url = window.location.href;

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`);
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`);
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`);
        break;
      default:
        // Copy to clipboard
        navigator.clipboard.writeText(text + ' ' + url);
        alert('Score copied to clipboard!');
        break;
    }
  };

  // Export results as PDF (mock implementation)
  const exportResultsToPDF = () => {
    // This would integrate with a PDF library like jsPDF
    alert('PDF export feature would be implemented with jsPDF library');
  };

  // Generate AI questions
  const generateAIQuestions = async () => {
    try {
      const aiQuestions = await aiQuestionGenerator.generateQuestions(category, difficulty, 5);
      setQuestionOrder(prev => [...prev, ...aiQuestions]);
    } catch (error) {
      console.error('Failed to generate AI questions:', error);
    }
  };

  // --- New Feature: Fun Fact After Each Question ---
  const [funFact, setFunFact] = useState("");
  const funFacts = [
    "Honey never spoils! Archaeologists have found edible honey in ancient tombs.",
    "Bananas are berries, but strawberries are not!",
    "Octopuses have three hearts.",
    "A group of flamingos is called a 'flamboyance'.",
    "The Eiffel Tower can be 15 cm taller during hot days."
  ];

  const showRandomFunFact = () => {
    setFunFact(funFacts[Math.floor(Math.random() * funFacts.length)]);
  };

  return (
    <div className="quiz-app">
      {/* Header with controls */}
      <div className="app-header">
        <div className="header-left">
          <h1 className="app-title">Enhanced Quiz App</h1>
          {gamePhase === 'playing' && (
            <div className="player-stats">
              <div className="stat-item">
                <span className="stat-icon">🔥</span>
                <span className="stat-value">{currentStreak}</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">🪙</span>
                <span className="stat-value">{playerCoins}</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">⭐</span>
                <span className="stat-value">Lv.{playerLevel}</span>
              </div>
            </div>
          )}
        </div>
        <div className="app-controls">
          <button className="control-btn" onClick={toggleTheme} title="Toggle Theme">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button className="control-btn" onClick={toggleSound} title="Toggle Sound">
            {isMuted ? '🔇' : '🔊'}
          </button>
          <button 
            className="control-btn" 
            onClick={toggleVoiceRecognition} 
            title="Voice Commands"
            style={{ backgroundColor: isListening ? '#ff4757' : '' }}
          >
            {isListening ? '🎤' : '🗣️'}
          </button>
          <button className="control-btn" onClick={() => setShowAchievements(!showAchievements)} title="Achievements">
            🏅
          </button>
          <button className="control-btn" onClick={() => setShowPowerUps(!showPowerUps)} title="Power-ups">
            ⚡
          </button>
          <button className="control-btn" onClick={() => setShowLeaderboard(!showLeaderboard)} title="Leaderboard">
            🏆
          </button>
        </div>
      </div>

      <div className="quiz-container">
        {/* Setup Phase */}
        {gamePhase === 'setup' && (
          <div className="setup-section">
            <h2 className="setup-title">Ready to Start?</h2>
            
            <div className="setup-form">
              <div className="form-group">
                <label htmlFor="playerName">Your Name:</label>
                <input
                  id="playerName"
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Enter your name"
                  className="name-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="difficulty">Difficulty Level:</label>
                <select
                  id="difficulty"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="difficulty-select"
                >
                  <option value="easy">Easy (45s per question)</option>
                  <option value="medium">Medium (30s per question)</option>
                  <option value="hard">Hard (20s per question)</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="category">Category:</label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="category-select"
                >
                  <option value="all">All Categories</option>
                  <option value="science">Science</option>
                  <option value="history">History</option>
                  <option value="geography">Geography</option>
                  <option value="technology">Technology</option>
                  <option value="sports">Sports</option>
                </select>
              </div>

              <div className="game-modes">
                <h3>Game Modes</h3>
                <div className="mode-options">
                  <label className="mode-option">
                    <input
                      type="checkbox"
                      checked={studyMode}
                      onChange={(e) => setStudyMode(e.target.checked)}
                    />
                    <span className="mode-label">Study Mode (No Timer)</span>
                  </label>
                  <label className="mode-option">
                    <input
                      type="checkbox"
                      checked={adaptiveDifficulty}
                      onChange={(e) => setAdaptiveDifficulty(e.target.checked)}
                    />
                    <span className="mode-label">Adaptive Difficulty</span>
                  </label>
                  <label className="mode-option">
                    <input
                      type="checkbox"
                      checked={voiceEnabled}
                      onChange={(e) => setVoiceEnabled(e.target.checked)}
                    />
                    <span className="mode-label">Voice Commands</span>
                  </label>
                </div>
              </div>

              <div className="difficulty-info">
                <p>Score Multiplier: {getScoreMultiplier()}x</p>
                <p>You'll get 3 hints to help you!</p>
                <p>Coins: {playerCoins} | Level: {playerLevel}</p>
                {studyMode && <p>⏰ Study Mode: No time pressure!</p>}
                {adaptiveDifficulty && <p>🧠 Adaptive: Difficulty adjusts to your performance</p>}
                {voiceEnabled && <p>🗣️ Voice: Answer using voice commands</p>}
              </div>

              <div className="start-buttons">
                <button className="start-button primary" onClick={startQuiz}>
                  Start Quiz 🚀
                </button>
                <button className="start-button secondary" onClick={generateAIQuestions}>
                  Generate AI Questions 🤖
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Playing Phase */}
        {gamePhase === 'playing' && currentQuestion && (
          <>
            {/* Progress Bar */}
            <div className="progress-container">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <div className="progress-text">
                Question {currentQuestionIndex + 1} of {questionOrder.length}
              </div>
            </div>

            {/* Timer */}
            <div className="timer-container">
              <div className={`timer ${timeLeft <= 10 ? 'timer-warning' : ''}`}>
                ⏰ {timeLeft}s
              </div>
              <div className="timer-bar">
                <div 
                  className="timer-fill" 
                  style={{ 
                    width: `${(timeLeft / getTimeLimit()) * 100}%`,
                    backgroundColor: timeLeft <= 10 ? '#ff4757' : '#2ed573'
                  }}
                ></div>
              </div>
            </div>

            {/* Question Section */}
            <div className="question-section">
              <div className="question-header">
                <div className="question-category">
                  {currentQuestion.category?.toUpperCase()} - {difficulty.toUpperCase()}
                </div>
                <div className="current-score">Score: {totalScore}</div>
              </div>
              
              <div className="question-text">
                {currentQuestion.question}
              </div>
              
              <div className="answer-options">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    className={`answer-button ${eliminatedOptions.includes(index) ? 'eliminated' : ''}`}
                    onClick={() => handleAnswerSubmit(index)}
                    disabled={selectedAnswer !== null || eliminatedOptions.includes(index)}
                    style={{
                      backgroundColor: selectedAnswer === index 
                        ? (index === currentQuestion.correctAnswer ? '#d4edda' : '#f8d7da')
                        : eliminatedOptions.includes(index) ? '#f1f2f6' : '#ffffff'
                    }}
                  >
                    <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                    {option}
                  </button>
                ))}
              </div>

              {/* Enhanced Hints & Power-ups Section */}
              <div className="hints-section">
                <div className="hints-info">
                  <div className="hints-available">Hints: {availableHints}</div>
                  <div className="streak-display">Streak: {currentStreak} 🔥</div>
                  {isQuestionBookmarked(currentQuestion) && (
                    <div className="bookmark-indicator">📖 Bookmarked</div>
                  )}
                </div>
                
                <div className="action-buttons">
                  <button 
                    className="hint-button"
                    onClick={useFiftyFifty}
                    disabled={availableHints <= 0 || eliminatedOptions.length > 0}
                    title="Remove 2 wrong answers"
                  >
                    50/50 💡
                  </button>
                  <button 
                    className="hint-button"
                    onClick={skipQuestion}
                    disabled={availableHints <= 0}
                    title="Skip this question"
                  >
                    Skip ⏭️
                  </button>
                  <button 
                    className="hint-button bookmark-btn"
                    onClick={() => toggleBookmark(currentQuestion)}
                    title="Bookmark this question"
                  >
                    {isQuestionBookmarked(currentQuestion) ? '📖' : '📝'}
                  </button>
                  {voiceEnabled && (
                    <button 
                      className={`hint-button voice-btn ${isListening ? 'listening' : ''}`}
                      onClick={toggleVoiceRecognition}
                      title="Voice answer"
                    >
                      {isListening ? '🎤' : '🗣️'}
                    </button>
                  )}
                </div>

                {/* Active Power-ups Display */}
                {activePowerUps.size > 0 && (
                  <div className="active-powerups">
                    <div className="powerups-title">Active Power-ups:</div>
                    <div className="powerups-list">
                      {Array.from(activePowerUps.entries()).map(([id, powerUp]) => (
                        <div key={id} className="active-powerup">
                          <span className="powerup-icon">{powerUp.icon}</span>
                          <span className="powerup-name">{powerUp.name}</span>
                          <span className="powerup-duration">({powerUp.remainingDuration})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Voice Recognition Status */}
                {isListening && (
                  <div className="voice-status">
                    <div className="voice-indicator">🎤 Listening...</div>
                    <div className="voice-help">Say A, B, C, D or "hint", "skip"</div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Results Phase */}
        {gamePhase === 'results' && (
          <div className="results-section">
            <h2 className="results-title">Quiz Complete! 🎉</h2>
            
            <div className="score-summary">
              <div className="final-score">
                <div className="score-number">{totalScore}</div>
                <div className="score-label">Total Points</div>
              </div>
              
              <div className="score-stats">
                <div className="stat">
                  <span className="stat-value">
                    {detailedResults.filter(r => r.isCorrect).length}/{questionOrder.length}
                  </span>
                  <span className="stat-label">Correct</span>
                </div>
                <div className="stat">
                  <span className="stat-value">
                    {Math.round((detailedResults.filter(r => r.isCorrect).length / questionOrder.length) * 100)}%
                  </span>
                  <span className="stat-label">Accuracy</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{difficulty}</span>
                  <span className="stat-label">Difficulty</span>
                </div>
              </div>
            </div>

            <div className="score-message">
              {getScoreMessage()}
            </div>

            {/* Detailed Results */}
            <div className="detailed-results">
              <h3>Question Review</h3>
              {detailedResults.map((result, index) => (
                <div key={index} className={`result-item ${result.isCorrect ? 'correct' : 'incorrect'}`}>
                  <div className="result-header">
                    <span className="question-number">Q{index + 1}</span>
                    <span className={`result-status ${result.isCorrect ? 'correct' : 'incorrect'}`}>
                      {result.isCorrect ? '✅' : '❌'}
                    </span>
                    <span className="result-points">+{result.points} pts</span>
                  </div>
                  <div className="result-question">{result.question}</div>
                  <div className="result-answers">
                    <div className="your-answer">
                      Your answer: {result.selectedAnswer !== null ? result.options[result.selectedAnswer] : 'No answer'}
                    </div>
                    {!result.isCorrect && (
                      <div className="correct-answer">
                        Correct answer: {result.options[result.correctAnswer]}
                      </div>
                    )}
                  </div>
                  <div className="result-time">
                    Time: {Math.round(result.timeSpent / 1000)}s
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced Results Actions */}
            <div className="results-actions">
              <div className="primary-actions">
                <button className="action-button primary" onClick={restartQuiz}>
                  Play Again 🔄
                </button>
                <button className="action-button secondary" onClick={() => setShowLeaderboard(true)}>
                  View Leaderboard 🏆
                </button>
              </div>
              
              <div className="secondary-actions">
                <button className="action-button tertiary" onClick={() => setShowAchievements(true)}>
                  Achievements 🏅
                </button>
                <button className="action-button tertiary" onClick={exportResultsToPDF}>
                  Export PDF 📄
                </button>
                <button className="action-button tertiary" onClick={() => setSocialShare(true)}>
                  Share Score 📱
                </button>
              </div>

              {/* Social Sharing */}
              {socialShare && (
                <div className="social-share">
                  <h4>Share Your Score</h4>
                  <div className="share-buttons">
                    <button onClick={() => shareScore('twitter')} className="share-btn twitter">
                      🐦 Twitter
                    </button>
                    <button onClick={() => shareScore('facebook')} className="share-btn facebook">
                      📘 Facebook
                    </button>
                    <button onClick={() => shareScore('linkedin')} className="share-btn linkedin">
                      💼 LinkedIn
                    </button>
                    <button onClick={() => shareScore('whatsapp')} className="share-btn whatsapp">
                      💬 WhatsApp
                    </button>
                    <button onClick={() => shareScore('copy')} className="share-btn copy">
                      📋 Copy Link
                    </button>
                  </div>
                  <button onClick={() => setSocialShare(false)} className="close-share">
                    ✕ Close
                  </button>
                </div>
              )}

              {/* XP and Level Progress */}
              <div className="level-progress">
                <div className="level-info">
                  <span>Level {playerLevel}</span>
                  <span>{playerXP} / {playerLevel * 100} XP</span>
                </div>
                <div className="xp-bar">
                  <div 
                    className="xp-fill" 
                    style={{ width: `${(playerXP / (playerLevel * 100)) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard Modal */}
        {showLeaderboard && (
          <div className="modal-overlay" onClick={() => setShowLeaderboard(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>🏆 Leaderboard</h3>
                <button className="close-button" onClick={() => setShowLeaderboard(false)}>×</button>
              </div>
              <div className="leaderboard-list">
                {leaderboard.length === 0 ? (
                  <p>No scores yet. Be the first to play!</p>
                ) : (
                  leaderboard.map((entry, index) => (
                    <div key={entry.id} className="leaderboard-entry">
                      <div className="rank">#{index + 1}</div>
                      <div className="player-info">
                        <div className="player-name">{entry.playerName}</div>
                        <div className="player-details">
                          {entry.score.correct}/{entry.score.total} correct • {entry.difficulty} • {entry.percentage}%
                        </div>
                      </div>
                      <div className="player-score">{entry.score.points} pts</div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        )}

        {/* Achievements Modal */}
        {showAchievements && (
          <div className="modal-overlay" onClick={() => setShowAchievements(false)}>
            <div className="modal-content achievements-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>🏅 Achievements</h3>
                <button className="close-button" onClick={() => setShowAchievements(false)}>×</button>
              </div>
              <div className="achievements-grid">
                {Object.values(getAchievementProgress({})).map((achievement) => (
                  <div 
                    key={achievement.id} 
                    className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
                  >
                    <div className="achievement-icon">{achievement.icon}</div>
                    <div className="achievement-info">
                      <div className="achievement-name">{achievement.name}</div>
                      <div className="achievement-description">{achievement.description}</div>
                      <div className="achievement-progress">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ width: `${achievement.progress}%` }}
                          ></div>
                        </div>
                        <span className="progress-text">{Math.round(achievement.progress)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Power-ups Modal */}
        {showPowerUps && (
          <div className="modal-overlay" onClick={() => setShowPowerUps(false)}>
            <div className="modal-content powerups-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>⚡ Power-ups Shop</h3>
                <div className="coins-display">🪙 {playerCoins} coins</div>
                <button className="close-button" onClick={() => setShowPowerUps(false)}>×</button>
              </div>
              <div className="powerups-grid">
                {Object.values(POWER_UPS).map((powerUp) => (
                  <div key={powerUp.id} className="powerup-card">
                    <div className="powerup-icon">{powerUp.icon}</div>
                    <div className="powerup-info">
                      <div className="powerup-name">{powerUp.name}</div>
                      <div className="powerup-description">{powerUp.description}</div>
                      <div className="powerup-cost">💰 {powerUp.cost} coins</div>
                    </div>
                    <button 
                      className="powerup-buy-btn"
                      onClick={() => purchasePowerUp(powerUp.id)}
                      disabled={playerCoins < powerUp.cost}
                    >
                      {playerCoins >= powerUp.cost ? 'Buy' : 'Not enough coins'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Daily Challenge Modal */}
        {showDailyChallenge && dailyChallenge && (
          <div className="modal-overlay" onClick={() => setShowDailyChallenge(false)}>
            <div className="modal-content daily-challenge-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>🎯 Daily Challenge</h3>
                <button className="close-button" onClick={() => setShowDailyChallenge(false)}>×</button>
              </div>
              <div className="modal-body">
                <div className="challenge-question">
                  {dailyChallenge.question}
                </div>
                <div className="challenge-options">
                  {dailyChallenge.options.map((option, index) => (
                    <button
                      key={index}
                      className="challenge-option"
                      onClick={() => {
                        // Handle daily challenge answer
                        const isCorrect = index === dailyChallenge.correctAnswer;
                        alert(isCorrect ? 'Correct! 🎉' : 'Wrong answer. Try again tomorrow!');
                        setShowDailyChallenge(false);
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Fun Fact Modal */}
        {funFact && (
          <div className="modal-overlay" onClick={() => setFunFact("")}> 
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h3>🧠 Fun Fact</h3>
              <p>{funFact}</p>
              <button className="close-button" onClick={() => setFunFact("")}>×</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;