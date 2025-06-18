export const shuffleArray = (array: any[]): any[] => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

export const calculateScore = (correctAnswers: number, totalQuestions: number): number => {
    return Math.round((correctAnswers / totalQuestions) * 100);
};

export const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export const getRandomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func(...args);
        }, delay);
    };
};

export const isAnswerCorrect = (selectedAnswer: string, correctAnswer: string): boolean => {
    return selectedAnswer === correctAnswer;
};

export const getQuestionDifficulty = (difficulty: string): string => {
    const difficulties = {
        easy: 'Easy',
        medium: 'Medium',
        hard: 'Hard',
    };
    return difficulties[difficulty] || 'Medium';
};

export const getUniqueArray = (array: any[]): any[] => {
    return [...new Set(array)];
};