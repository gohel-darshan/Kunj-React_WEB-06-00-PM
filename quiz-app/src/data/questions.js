// Enhanced question database with categories and difficulty levels
export const questionDatabase = {
  science: {
    easy: [
      {
        question: "What planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correctAnswer: 1,
        category: "science",
        difficulty: "easy"
      },
      {
        question: "What gas do plants absorb from the atmosphere?",
        options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
        correctAnswer: 2,
        category: "science",
        difficulty: "easy"
      }
    ],
    medium: [
      {
        question: "What is the chemical symbol for gold?",
        options: ["Go", "Gd", "Au", "Ag"],
        correctAnswer: 2,
        category: "science",
        difficulty: "medium"
      },
      {
        question: "Which element has the atomic number 1?",
        options: ["Helium", "Hydrogen", "Lithium", "Carbon"],
        correctAnswer: 1,
        category: "science",
        difficulty: "medium"
      }
    ],
    hard: [
      {
        question: "What is the speed of light in vacuum?",
        options: ["299,792,458 m/s", "300,000,000 m/s", "299,000,000 m/s", "298,792,458 m/s"],
        correctAnswer: 0,
        category: "science",
        difficulty: "hard"
      }
    ]
  },
  history: {
    easy: [
      {
        question: "In which year did World War II end?",
        options: ["1944", "1945", "1946", "1947"],
        correctAnswer: 1,
        category: "history",
        difficulty: "easy"
      },
      {
        question: "Who was the first President of the United States?",
        options: ["Thomas Jefferson", "John Adams", "George Washington", "Benjamin Franklin"],
        correctAnswer: 2,
        category: "history",
        difficulty: "easy"
      }
    ],
    medium: [
      {
        question: "The Berlin Wall fell in which year?",
        options: ["1987", "1988", "1989", "1990"],
        correctAnswer: 2,
        category: "history",
        difficulty: "medium"
      }
    ],
    hard: [
      {
        question: "The Treaty of Westphalia was signed in which year?",
        options: ["1648", "1649", "1650", "1651"],
        correctAnswer: 0,
        category: "history",
        difficulty: "hard"
      }
    ]
  },
  geography: {
    easy: [
      {
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correctAnswer: 2,
        category: "geography",
        difficulty: "easy"
      },
      {
        question: "Which is the largest ocean on Earth?",
        options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
        correctAnswer: 3,
        category: "geography",
        difficulty: "easy"
      }
    ],
    medium: [
      {
        question: "Which country has the most time zones?",
        options: ["Russia", "United States", "China", "France"],
        correctAnswer: 3,
        category: "geography",
        difficulty: "medium"
      }
    ],
    hard: [
      {
        question: "What is the smallest country in the world?",
        options: ["Monaco", "Nauru", "Vatican City", "San Marino"],
        correctAnswer: 2,
        category: "geography",
        difficulty: "hard"
      }
    ]
  },
  technology: {
    easy: [
      {
        question: "Which programming language is React built with?",
        options: ["Python", "JavaScript", "Java", "C++"],
        correctAnswer: 1,
        category: "technology",
        difficulty: "easy"
      }
    ],
    medium: [
      {
        question: "What does HTML stand for?",
        options: ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlink and Text Markup Language"],
        correctAnswer: 0,
        category: "technology",
        difficulty: "medium"
      }
    ],
    hard: [
      {
        question: "Which algorithm is commonly used for shortest path finding?",
        options: ["Bubble Sort", "Dijkstra's Algorithm", "Quick Sort", "Binary Search"],
        correctAnswer: 1,
        category: "technology",
        difficulty: "hard"
      }
    ]
  },
  sports: {
    easy: [
      {
        question: "How many players are on a basketball team on the court at one time?",
        options: ["4", "5", "6", "7"],
        correctAnswer: 1,
        category: "sports",
        difficulty: "easy"
      }
    ],
    medium: [
      {
        question: "In which sport would you perform a slam dunk?",
        options: ["Tennis", "Basketball", "Volleyball", "Baseball"],
        correctAnswer: 1,
        category: "sports",
        difficulty: "medium"
      }
    ],
    hard: [
      {
        question: "Who holds the record for most Olympic gold medals?",
        options: ["Usain Bolt", "Michael Phelps", "Carl Lewis", "Mark Spitz"],
        correctAnswer: 1,
        category: "sports",
        difficulty: "hard"
      }
    ]
  },
  general: {
    easy: [
      {
        question: "What is 2 + 2?",
        options: ["3", "4", "5", "6"],
        correctAnswer: 1,
        category: "general",
        difficulty: "easy"
      },
      {
        question: "Who painted the Mona Lisa?",
        options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
        correctAnswer: 2,
        category: "general",
        difficulty: "easy"
      }
    ]
  }
};

// Utility functions for question management
export const getQuestionsByDifficulty = (difficulty) => {
  const questions = [];
  Object.keys(questionDatabase).forEach(category => {
    if (questionDatabase[category][difficulty]) {
      questions.push(...questionDatabase[category][difficulty]);
    }
  });
  return questions;
};

export const getQuestionsByCategory = (category) => {
  const questions = [];
  if (questionDatabase[category]) {
    Object.keys(questionDatabase[category]).forEach(difficulty => {
      questions.push(...questionDatabase[category][difficulty]);
    });
  }
  return questions;
};

export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};