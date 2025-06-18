import React, { useState, useEffect } from 'react';
import Question from './Question';
import Result from './Result';
import Timer from './Timer';
import ProgressBar from './ProgressBar';
import useQuiz from '../hooks/useQuiz';
import './Quiz.css';

function Quiz() {
    const {
        questions,
        currentQuestionIndex,
        score,
        totalQuestions,
        isQuizFinished,
        handleAnswerOptionClick,
        resetQuiz,
        selectedAnswers,
        timer,
    } = useQuiz();

    const [showResult, setShowResult] = useState(false);

    useEffect(() => {
        if (isQuizFinished) {
            setShowResult(true);
        }
    }, [isQuizFinished]);

    const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

    return (
        <div className="quiz-container">
            {showResult ? (
                <Result score={score} totalQuestions={totalQuestions} onRestart={resetQuiz} />
            ) : (
                <>
                    <ProgressBar progress={progress} />
                    <Timer duration={timer} onTimeUp={resetQuiz} />
                    <Question
                        question={questions[currentQuestionIndex].question}
                        options={questions[currentQuestionIndex].options}
                        selectedOption={selectedAnswers[currentQuestionIndex] || null}
                        onOptionSelect={handleAnswerOptionClick}
                    />
                </>
            )}
        </div>
    );
}

export default Quiz;