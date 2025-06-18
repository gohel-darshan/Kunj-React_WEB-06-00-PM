import { useState, useEffect } from 'react';
import questionsData from '../data/questions.json';

function useQuiz() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [isQuizFinished, setIsQuizFinished] = useState(false);
    const [timer, setTimer] = useState(30); // 30 seconds timer
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    
    // Fix: get questions array from questionsData.questions
    const questions = questionsData.questions;

    useEffect(() => {
        if (timer > 0 && !isQuizFinished) {
            const timerId = setInterval(() => {
                setTimer(prevTimer => prevTimer - 1);
            }, 1000);
            return () => clearInterval(timerId);
        } else if (timer === 0) {
            finishQuiz();
        }
    }, [timer, isQuizFinished]);

    const handleAnswerSelection = (answer) => {
        setSelectedAnswers(prev => [...prev, answer]);
        if (answer === questions[currentQuestionIndex].answer) {
            setScore(prevScore => prevScore + 1);
        }
        nextQuestion();
    };

    const nextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        } else {
            finishQuiz();
        }
    };

    const finishQuiz = () => {
        setIsQuizFinished(true);
        clearInterval(timer);
    };

    const resetQuiz = () => {
        setCurrentQuestionIndex(0);
        setScore(0);
        setIsQuizFinished(false);
        setTimer(30);
        setSelectedAnswers([]);
    };

    return {
        questions,
        currentQuestionIndex,
        score,
        totalQuestions: questions.length,
        isQuizFinished,
        handleAnswerOptionClick: handleAnswerSelection,
        resetQuiz,
        selectedAnswers,
        timer,
    };
};

export default useQuiz;