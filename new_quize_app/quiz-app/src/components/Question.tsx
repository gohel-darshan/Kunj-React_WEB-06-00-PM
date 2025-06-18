import React from 'react';

// Converted from TypeScript to JavaScript
// Remove type annotations and interfaces

function Question({ question, options, selectedOption, onOptionSelect }) {
    return (
        <div className="question-container">
            <h2 className="question-text">{question}</h2>
            <div className="options-container">
                {options.map((option, index) => (
                    <button
                        key={index}
                        className={`option-button ${selectedOption === option ? 'selected' : ''}`}
                        onClick={() => onOptionSelect(option)}
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default Question;