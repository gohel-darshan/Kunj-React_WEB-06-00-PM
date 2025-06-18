export interface Question {
    id: number;
    question: string;
    options: string[];
    correctAnswer: string;
}

export interface QuizSettings {
    difficulty: 'easy' | 'medium' | 'hard';
    category: string;
    timeLimit: number; // in seconds
}

export interface QuizResult {
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    incorrectAnswers: number;
}

export interface LeaderboardEntry {
    username: string;
    score: number;
    date: string; // ISO date string
}

export interface User {
    id: string;
    name: string;
    score: number;
}