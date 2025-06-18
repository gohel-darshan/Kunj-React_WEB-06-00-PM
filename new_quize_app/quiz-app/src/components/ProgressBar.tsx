import React from 'react';

// Converted from TypeScript to JavaScript
// Remove type annotations and interfaces

function ProgressBar({ progress }) {
    return (
        <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${progress}%` }}>
                <span className="progress-text">{progress}%</span>
            </div>
        </div>
    );
}

export default ProgressBar;