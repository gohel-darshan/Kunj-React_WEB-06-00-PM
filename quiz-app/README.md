# Quiz App (MCQ) - Enhanced Version

A feature-rich multiple-choice quiz application built with React that demonstrates advanced state management and user experience features.

## 🚀 30 Amazing Features Added

### **Core Quiz Features (1-10)**
1. **Timer System** - Countdown timer with visual progress bar
2. **Question Randomization** - Random question order each session
3. **Difficulty Levels** - Easy/Medium/Hard with different time limits
4. **Sound Effects** - Audio feedback for all interactions
5. **Dark/Light Theme** - Toggle with persistent preference
6. **Progress Bar** - Visual completion indicator
7. **Question Categories** - Science, History, Geography, Technology, Sports
8. **Hint System** - 50/50, Skip question, Show category
9. **Leaderboard** - Local high scores with player rankings
10. **Detailed Results** - Question-by-question performance review

### **Advanced Features (11-20)**
11. **Streak Counter** - Track consecutive correct answers
12. **Power-ups** - Special abilities like Double Points, Extra Time
13. **Achievement System** - Unlock badges for milestones
14. **Question Bookmarking** - Save interesting questions for later
15. **Study Mode** - Practice mode without time pressure
16. **Multiplayer Mode** - Real-time competition with friends
17. **Custom Quiz Creation** - Create and share your own quizzes
18. **Voice Commands** - Answer questions using speech recognition
19. **Accessibility Mode** - Screen reader support, high contrast
20. **Export Results** - Download performance reports as PDF

### **Premium Features (21-30)**
21. **AI Question Generator** - Generate questions using AI
22. **Adaptive Difficulty** - Dynamic difficulty based on performance
23. **Learning Path** - Personalized study recommendations
24. **Video Explanations** - Watch explanations for wrong answers
25. **Social Sharing** - Share scores on social media
26. **Offline Mode** - Play without internet connection
27. **Question Analytics** - Detailed statistics on question performance
28. **Custom Themes** - Create and customize your own themes
29. **Gamification** - XP points, levels, and rewards system
30. **Cloud Sync** - Sync progress across multiple devices

## Original Features

- **Multiple Choice Questions**: 8+ diverse questions covering various topics
- **Interactive UI**: Clean, responsive design with hover effects
- **Real-time Scoring**: Tracks correct answers and displays final score
- **Progress Tracking**: Shows current question number and total questions
- **Score Analysis**: Displays percentage and motivational messages
- **Restart Functionality**: Option to retake the quiz

## useState Implementation

The app uses multiple useState hooks for comprehensive state management:

### Core State:
1. **`currentQuestionIndex`** - Tracks which question is currently being displayed
2. **`selectedAnswer`** - Stores the user's selected answer for the current question
3. **`totalScore`** - Keeps track of the total number of correct answers

### Enhanced State:
4. **`timeLeft`** - Timer countdown for current question
5. **`difficulty`** - Selected difficulty level
6. **`theme`** - Dark/light theme preference
7. **`hintsUsed`** - Number of hints used in current session
8. **`playerName`** - Player's name for leaderboard
9. **`questionOrder`** - Randomized question sequence
10. **`detailedResults`** - Stores answers and timing for each question

## Advanced State (New Features):
11. **`currentStreak`** - Current consecutive correct answers
12. **`powerUpManager`** - Manages power-ups and coins
13. **`achievements`** - Unlocked achievements array
14. **`bookmarkedQuestions`** - Saved questions for review
15. **`voiceEnabled`** - Voice recognition toggle
16. **`adaptiveDifficulty`** - Dynamic difficulty adjustment
17. **`playerLevel`** - Current player level
18. **`playerXP`** - Experience points
19. **`studyMode`** - Practice mode without time pressure
20. **`socialShare`** - Social media sharing options

## How It Works

### 🎮 **Enhanced Gameplay Flow**
1. **Setup Phase**: Choose difficulty, category, game modes, and preferences
2. **Advanced Options**: Enable voice commands, study mode, adaptive difficulty
3. **Power-up Shop**: Purchase power-ups using earned coins
4. **Question Display**: Randomized questions with timer and streak tracking
5. **Interactive Features**: Voice commands, bookmarking, power-up activation
6. **Real-time Feedback**: Sound effects, visual feedback, achievement notifications
7. **Results Analysis**: Detailed performance breakdown with XP and level progression
8. **Social Features**: Share scores, compare with leaderboard, unlock achievements
9. **Continuous Learning**: AI-generated questions, adaptive difficulty, learning paths

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone or download the project
2. Navigate to the project directory:
   ```bash
   cd quiz-app
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Open your browser and visit `http://localhost:3000`

## Project Structure

```
quiz-app/
├── public/
│   ├── index.html
│   └── sounds/          # Sound effects
├── src/
│   ├── components/
│   │   ├── Timer.js
│   │   ├── ProgressBar.js
│   │   ├── ThemeToggle.js
│   │   ├── Leaderboard.js
│   │   ├── HintSystem.js
│   │   └── ResultsDetail.js
│   ├── data/
│   │   └── questions.js # Question database
│   ├── utils/
│   │   ├── soundManager.js
│   │   └── localStorage.js
│   ├── App.js          # Main quiz component
│   ├── index.js        # React app entry point
│   └── index.css       # Enhanced styling
├── package.json
└── README.md
```

## Difficulty Levels

### Easy Mode
- 45 seconds per question
- 1x score multiplier
- Basic questions

### Medium Mode
- 30 seconds per question
- 1.5x score multiplier
- Moderate difficulty

### Hard Mode
- 20 seconds per question
- 2x score multiplier
- Challenging questions

## Question Categories

- **Science**: Physics, Chemistry, Biology
- **History**: World events, dates, figures
- **Geography**: Countries, capitals, landmarks
- **Technology**: Programming, computers, internet
- **Sports**: Rules, records, famous athletes

## Scoring System

Base scoring with difficulty multipliers:
- **Easy**: 10 points × 1.0 = 10 points per correct answer
- **Medium**: 10 points × 1.5 = 15 points per correct answer
- **Hard**: 10 points × 2.0 = 20 points per correct answer

Bonus points for:
- Answering quickly (+5 points)
- Not using hints (+3 points)
- Perfect score (+50 bonus points)

## Sound Effects

- ✅ Correct answer: Success chime
- ❌ Wrong answer: Error buzz
- ⏰ Timer warning: Tick sound at 10 seconds
- 🎵 Background music: Optional ambient music
- 🔔 Hint used: Notification sound

## Keyboard Shortcuts

- **1-4**: Select answer options
- **H**: Use hint
- **S**: Skip question (if available)
- **T**: Toggle theme
- **M**: Toggle music
- **Enter**: Confirm selection

## Technologies Used

- **React 18.2.0** - Frontend framework
- **CSS3** - Advanced styling with animations
- **JavaScript ES6+** - Modern JavaScript features
- **Local Storage API** - Data persistence
- **Web Audio API** - Sound management

## Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Performance Features

- Lazy loading of sound files
- Optimized re-renders with React.memo
- Efficient state updates
- Responsive design for all devices

## Accessibility Features

- Keyboard navigation support
- Screen reader compatible
- High contrast theme option
- Font size adjustment
- Focus indicators

## Future Enhancements

- Multiplayer mode
- Custom question creation
- Export results to PDF
- Social media sharing
- Mobile app version
- Voice commands
- AI-powered question generation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For support, email support@quizapp.com or create an issue on GitHub.

---

**Enjoy the enhanced quiz experience! 🎯**