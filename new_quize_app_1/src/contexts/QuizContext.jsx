import { createContext, useContext, useState, useEffect } from 'react';

const QuizContext = createContext();

export const useQuiz = () => useContext(QuizContext);

export const QuizProvider = ({ children }) => {
  // User state
  const [username, setUsername] = useState(() => {
    const savedUsername = localStorage.getItem('quizUsername');
    return savedUsername || '';
  });

  // Quiz state
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizSettings, setQuizSettings] = useState({
    shuffleQuestions: true,
    timeLimit: 30, // seconds per question
    numberOfQuestions: 10,
  });
  const [markedQuestions, setMarkedQuestions] = useState([]);
  const [timer, setTimer] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await import('../data/categories.json');
        setCategories(response.default);
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };

    loadCategories();
  }, []);

  // Save username to localStorage
  useEffect(() => {
    if (username) {
      localStorage.setItem('quizUsername', username);
    }
  }, [username]);

  // Timer functionality
  useEffect(() => {
    let interval = null;
    
    if (isTimerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isTimerActive && timeRemaining === 0) {
      // Time's up for current question
      handleNextQuestion();
    }
    
    return () => clearInterval(interval);
  }, [isTimerActive, timeRemaining]);

  // Load quiz questions
  const loadQuizQuestions = async (categoryId) => {
    try {
      const response = await import(`../data/${categoryId}.json`);
      let quizQuestions = [...response.default.questions];
      
      // Apply quiz settings
      if (quizSettings.shuffleQuestions) {
        quizQuestions = shuffleArray(quizQuestions);
      }
      
      if (quizSettings.numberOfQuestions < quizQuestions.length) {
        quizQuestions = quizQuestions.slice(0, quizSettings.numberOfQuestions);
      }
      
      setQuestions(quizQuestions);
      setUserAnswers(new Array(quizQuestions.length).fill(null));
      setMarkedQuestions([]);
      setCurrentQuestionIndex(0);
      setQuizStarted(true);
      setQuizCompleted(false);
      
      // Initialize timer
      setTimeRemaining(quizSettings.timeLimit);
      setIsTimerActive(true);
      
      return quizQuestions;
    } catch (error) {
      console.error(`Failed to load ${categoryId} questions:`, error);
      return [];
    }
  };

  // Start quiz
  const startQuiz = async (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    setSelectedCategory(category);
    await loadQuizQuestions(categoryId);
  };
  
  // Start custom quiz
  const startCustomQuiz = (customQuiz) => {
    setSelectedCategory({
      id: customQuiz.id,
      name: customQuiz.name,
      description: customQuiz.description,
      difficulty: customQuiz.difficulty,
      icon: 'custom',
      questionsCount: customQuiz.questions.length,
      timePerQuestion: quizSettings.timeLimit,
    });
    
    let quizQuestions = [...customQuiz.questions];
    
    // Apply quiz settings
    if (quizSettings.shuffleQuestions) {
      quizQuestions = shuffleArray(quizQuestions);
    }
    
    setQuestions(quizQuestions);
    setUserAnswers(new Array(quizQuestions.length).fill(null));
    setMarkedQuestions([]);
    setCurrentQuestionIndex(0);
    setQuizStarted(true);
    setQuizCompleted(false);
    
    // Initialize timer
    setTimeRemaining(quizSettings.timeLimit);
    setIsTimerActive(true);
  };

  // Answer question
  const answerQuestion = (answer) => {
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestionIndex] = answer;
    setUserAnswers(newUserAnswers);
    
    // Save progress to localStorage
    saveProgress(newUserAnswers);
  };

  // Navigate to next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      // Reset timer for next question
      setTimeRemaining(quizSettings.timeLimit);
    } else {
      // Quiz completed
      completeQuiz();
    }
  };

  // Navigate to previous question
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      // Reset timer for previous question
      setTimeRemaining(quizSettings.timeLimit);
    }
  };

  // Mark question for review
  const toggleMarkQuestion = (index) => {
    const questionIndex = index !== undefined ? index : currentQuestionIndex;
    
    if (markedQuestions.includes(questionIndex)) {
      setMarkedQuestions(markedQuestions.filter(i => i !== questionIndex));
    } else {
      setMarkedQuestions([...markedQuestions, questionIndex]);
    }
  };

  // Complete quiz
  const completeQuiz = () => {
    setQuizCompleted(true);
    setIsTimerActive(false);
    
    // Calculate and save score
    const score = calculateScore();
    saveScore(score);
  };

  // Calculate score
  const calculateScore = () => {
    let correctAnswers = 0;
    
    questions.forEach((question, index) => {
      const userAnswer = userAnswers[index];
      
      if (question.type === 'checkbox') {
        // For checkbox questions, compare arrays
        if (userAnswer && 
            Array.isArray(userAnswer) && 
            Array.isArray(question.correctAnswer) && 
            userAnswer.length === question.correctAnswer.length && 
            userAnswer.every(ans => question.correctAnswer.includes(ans))) {
          correctAnswers++;
        }
      } else if (userAnswer === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    return {
      totalQuestions: questions.length,
      correctAnswers,
      percentage: Math.round((correctAnswers / questions.length) * 100),
    };
  };

  // Save progress to localStorage
  const saveProgress = (answers) => {
    if (!selectedCategory) return;
    
    const progress = {
      categoryId: selectedCategory.id,
      questions,
      userAnswers: answers || userAnswers,
      currentQuestionIndex,
      markedQuestions,
    };
    
    localStorage.setItem('quizProgress', JSON.stringify(progress));
  };

  // Load saved progress
  const loadProgress = () => {
    const savedProgress = localStorage.getItem('quizProgress');
    
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      
      // Find the category
      const category = categories.find(cat => cat.id === progress.categoryId);
      if (category) {
        setSelectedCategory(category);
        setQuestions(progress.questions);
        setUserAnswers(progress.userAnswers);
        setCurrentQuestionIndex(progress.currentQuestionIndex);
        setMarkedQuestions(progress.markedQuestions || []);
        setQuizStarted(true);
        setQuizCompleted(false);
        
        // Initialize timer
        setTimeRemaining(quizSettings.timeLimit);
        setIsTimerActive(true);
        
        return true;
      }
    }
    
    return false;
  };

  // Save score to leaderboard
  const saveScore = (score) => {
    if (!selectedCategory || !username) return;
    
    const leaderboard = JSON.parse(localStorage.getItem('quizLeaderboard') || '[]');
    
    const newScore = {
      username,
      categoryId: selectedCategory.id,
      categoryName: selectedCategory.name,
      score: score.percentage,
      correctAnswers: score.correctAnswers,
      totalQuestions: score.totalQuestions,
      date: new Date().toISOString(),
    };
    
    leaderboard.push(newScore);
    
    // Sort by score (highest first)
    leaderboard.sort((a, b) => b.score - a.score);
    
    localStorage.setItem('quizLeaderboard', JSON.stringify(leaderboard));
  };

  // Get leaderboard
  const getLeaderboard = (categoryId = null) => {
    const leaderboard = JSON.parse(localStorage.getItem('quizLeaderboard') || '[]');
    
    if (categoryId) {
      return leaderboard.filter(entry => entry.categoryId === categoryId);
    }
    
    return leaderboard;
  };

  // Reset quiz
  const resetQuiz = () => {
    setQuizStarted(false);
    setQuizCompleted(false);
    setSelectedCategory(null);
    setQuestions([]);
    setUserAnswers([]);
    setCurrentQuestionIndex(0);
    setMarkedQuestions([]);
    setIsTimerActive(false);
    
    // Remove saved progress
    localStorage.removeItem('quizProgress');
  };

  // Utility function to shuffle array
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Update quiz settings
  const updateQuizSettings = (newSettings) => {
    setQuizSettings({ ...quizSettings, ...newSettings });
  };

  const value = {
    username,
    setUsername,
    categories,
    selectedCategory,
    questions,
    currentQuestionIndex,
    userAnswers,
    quizStarted,
    quizCompleted,
    quizSettings,
    markedQuestions,
    timeRemaining,
    isTimerActive,
    startQuiz,
    startCustomQuiz,
    answerQuestion,
    handleNextQuestion,
    handlePrevQuestion,
    toggleMarkQuestion,
    completeQuiz,
    calculateScore,
    saveProgress,
    loadProgress,
    getLeaderboard,
    resetQuiz,
    updateQuizSettings,
    setIsTimerActive,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};