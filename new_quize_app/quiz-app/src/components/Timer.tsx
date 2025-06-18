import React from 'react';

function Timer({ duration, onTimeUp }) {
    const [timeLeft, setTimeLeft] = React.useState(duration);

    React.useEffect(() => {
        if (timeLeft > 0) {
            const timerId = setInterval(() => {
                setTimeLeft(prevTime => prevTime - 1);
            }, 1000);
            return () => clearInterval(timerId);
        } else {
            onTimeUp();
        }
    }, [timeLeft, onTimeUp]);

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    return (
        <div className="timer">
            <h2>Time Left: {formatTime(timeLeft)}</h2>
        </div>
    );
}

export default Timer;