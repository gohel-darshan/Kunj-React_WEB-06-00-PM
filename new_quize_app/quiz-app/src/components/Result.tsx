import React from 'react';
import { useHistory } from 'react-router-dom';
import './Result.css';

function Result({ score, totalQuestions, onRestart }) {
    const history = useHistory();
    
    function handleLeaderboard() {
        history.push('/leaderboard');
    }

    return (
        <div className="result-container">
            <h1 className="result-title">Quiz Completed!</h1>
            <p className="result-score">Your Score: {score} / {totalQuestions}</p>
            <div className="result-buttons">
                <button className="restart-button" onClick={onRestart}>Restart Quiz</button>
                <button className="leaderboard-button" onClick={handleLeaderboard}>View Leaderboard</button>
            </div>
            <div className="result-feedback">
                {score / totalQuestions > 0.7 ? (
                    <p className="feedback-positive">Great job! You really know your stuff!</p>
                ) : (
                    <p className="feedback-negative">Don't worry, try again to improve your score!</p>
                )}
            </div>
        </div>
    );
}

export default Result;