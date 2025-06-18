import React from 'react';
import useQuiz from '../hooks/useQuiz';
import './ReviewAnswers.css';

function ReviewAnswers() {
    const { questions, selectedAnswers } = useQuiz();

    return (
        <div className="review-answers-container">
            <h2>Review Answers</h2>
            {questions.map((question, index) => (
                <div key={index} className="review-question">
                    <h3>{question.question}</h3>
                    <p>Your answer: {selectedAnswers[index]}</p>
                    <p>Correct answer: {question.answer}</p>
                </div>
            ))}
        </div>
    );
}

export default ReviewAnswers;