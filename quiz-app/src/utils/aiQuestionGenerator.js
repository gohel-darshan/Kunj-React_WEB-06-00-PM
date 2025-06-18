// AI Question Generator (Mock implementation - would integrate with real AI service)
export class AIQuestionGenerator {
  constructor() {
    this.apiKey = null; // Would be set from environment variables
    this.baseURL = 'https://api.openai.com/v1/chat/completions'; // Example API
    this.isEnabled = false; // Set to true when API key is available
  }

  // Initialize with API key
  initialize(apiKey) {
    this.apiKey = apiKey;
    this.isEnabled = !!apiKey;
  }

  // Generate questions based on topic and difficulty
  async generateQuestions(topic, difficulty, count = 5) {
    if (!this.isEnabled) {
      // Return mock questions when AI is not available
      return this.generateMockQuestions(topic, difficulty, count);
    }

    try {
      const prompt = this.createPrompt(topic, difficulty, count);
      const response = await this.callAI(prompt);
      return this.parseAIResponse(response);
    } catch (error) {
      console.error('AI question generation failed:', error);
      // Fallback to mock questions
      return this.generateMockQuestions(topic, difficulty, count);
    }
  }

  // Create prompt for AI
  createPrompt(topic, difficulty, count) {
    const difficultyDescriptions = {
      easy: 'basic knowledge level, suitable for beginners',
      medium: 'intermediate knowledge level, requiring some expertise',
      hard: 'advanced knowledge level, challenging for experts'
    };

    return `Generate ${count} multiple-choice questions about ${topic} at ${difficulty} difficulty level (${difficultyDescriptions[difficulty]}).

Requirements:
- Each question should have exactly 4 options (A, B, C, D)
- Only one correct answer per question
- Questions should be factual and educational
- Avoid ambiguous or trick questions
- Include diverse subtopics within ${topic}

Format the response as a JSON array with this structure:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Brief explanation of the correct answer",
    "category": "${topic}",
    "difficulty": "${difficulty}",
    "subtopic": "Specific subtopic"
  }
]`;
  }

  // Call AI API (mock implementation)
  async callAI(prompt) {
    // This would be a real API call in production
    // For now, return mock response
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    
    // Mock AI response
    return {
      choices: [{
        message: {
          content: JSON.stringify(this.generateMockQuestions('science', 'medium', 3))
        }
      }]
    };
  }

  // Parse AI response
  parseAIResponse(response) {
    try {
      const content = response.choices[0].message.content;
      const questions = JSON.parse(content);
      
      // Validate questions format
      return questions.filter(q => 
        q.question && 
        Array.isArray(q.options) && 
        q.options.length === 4 &&
        typeof q.correctAnswer === 'number' &&
        q.correctAnswer >= 0 && 
        q.correctAnswer < 4
      );
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      return [];
    }
  }

  // Generate mock questions when AI is not available
  generateMockQuestions(topic, difficulty, count) {
    const mockQuestions = {
      science: {
        easy: [
          {
            question: "What is the chemical symbol for water?",
            options: ["H2O", "CO2", "NaCl", "O2"],
            correctAnswer: 0,
            explanation: "Water is composed of two hydrogen atoms and one oxygen atom, hence H2O.",
            category: "science",
            difficulty: "easy",
            subtopic: "chemistry"
          },
          {
            question: "Which planet is closest to the Sun?",
            options: ["Venus", "Mercury", "Earth", "Mars"],
            correctAnswer: 1,
            explanation: "Mercury is the innermost planet in our solar system.",
            category: "science",
            difficulty: "easy",
            subtopic: "astronomy"
          }
        ],
        medium: [
          {
            question: "What is the powerhouse of the cell?",
            options: ["Nucleus", "Ribosome", "Mitochondria", "Endoplasmic Reticulum"],
            correctAnswer: 2,
            explanation: "Mitochondria produce ATP, the energy currency of cells.",
            category: "science",
            difficulty: "medium",
            subtopic: "biology"
          }
        ],
        hard: [
          {
            question: "What is the Heisenberg Uncertainty Principle?",
            options: [
              "Energy cannot be created or destroyed",
              "Position and momentum cannot be precisely determined simultaneously",
              "Matter and energy are equivalent",
              "Entropy always increases"
            ],
            correctAnswer: 1,
            explanation: "The uncertainty principle states that the more precisely we know position, the less precisely we can know momentum, and vice versa.",
            category: "science",
            difficulty: "hard",
            subtopic: "physics"
          }
        ]
      },
      history: {
        easy: [
          {
            question: "Who was the first President of the United States?",
            options: ["Thomas Jefferson", "George Washington", "John Adams", "Benjamin Franklin"],
            correctAnswer: 1,
            explanation: "George Washington served as the first President from 1789 to 1797.",
            category: "history",
            difficulty: "easy",
            subtopic: "american_history"
          }
        ]
      }
    };

    const topicQuestions = mockQuestions[topic] || mockQuestions.science;
    const difficultyQuestions = topicQuestions[difficulty] || topicQuestions.easy;
    
    // Repeat questions if we need more than available
    const result = [];
    for (let i = 0; i < count; i++) {
      const questionIndex = i % difficultyQuestions.length;
      result.push({
        ...difficultyQuestions[questionIndex],
        id: `ai_generated_${Date.now()}_${i}`
      });
    }
    
    return result;
  }

  // Generate questions based on user's weak areas
  async generateAdaptiveQuestions(userStats, count = 5) {
    // Analyze user's performance to identify weak areas
    const weakAreas = this.analyzeWeakAreas(userStats);
    
    if (weakAreas.length === 0) {
      // If no weak areas, generate mixed difficulty questions
      return this.generateQuestions('general', 'medium', count);
    }

    // Generate questions focusing on weak areas
    const questions = [];
    for (const area of weakAreas.slice(0, 3)) { // Focus on top 3 weak areas
      const areaQuestions = await this.generateQuestions(
        area.category, 
        area.suggestedDifficulty, 
        Math.ceil(count / weakAreas.length)
      );
      questions.push(...areaQuestions);
    }

    return questions.slice(0, count);
  }

  // Analyze user statistics to find weak areas
  analyzeWeakAreas(userStats) {
    const weakAreas = [];
    
    if (userStats.categoryStats) {
      Object.entries(userStats.categoryStats).forEach(([category, stats]) => {
        if (stats.percentage < 70) { // Below 70% is considered weak
          weakAreas.push({
            category,
            percentage: stats.percentage,
            suggestedDifficulty: stats.percentage < 50 ? 'easy' : 'medium'
          });
        }
      });
    }

    // Sort by weakest areas first
    return weakAreas.sort((a, b) => a.percentage - b.percentage);
  }

  // Check if AI generation is available
  isAIAvailable() {
    return this.isEnabled;
  }

  // Get available topics for AI generation
  getAvailableTopics() {
    return [
      'science', 'history', 'geography', 'technology', 'sports',
      'literature', 'art', 'music', 'mathematics', 'philosophy',
      'psychology', 'economics', 'politics', 'medicine', 'environment'
    ];
  }
}

// Create singleton instance
const aiQuestionGenerator = new AIQuestionGenerator();
export default aiQuestionGenerator;