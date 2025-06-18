import React from 'react';

function Settings({ onSettingsChange }) {
    function handleDifficultyChange(event) {
        onSettingsChange({ difficulty: event.target.value });
    }
    function handleCategoryChange(event) {
        onSettingsChange({ category: event.target.value });
    }
    return (
        <div className="settings-container">
            <label>Difficulty:
                <select onChange={handleDifficultyChange}>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>
            </label>
            <label>Category:
                <select onChange={handleCategoryChange}>
                    <option value="general">General</option>
                    <option value="science">Science</option>
                    <option value="history">History</option>
                </select>
            </label>
        </div>
    );
}

export default Settings;