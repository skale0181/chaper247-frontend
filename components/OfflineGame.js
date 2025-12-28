import React, { useState } from 'react';

const OfflineGame = () => {
    const [score, setScore] = useState(0);

    return (
        <div
            style={{
                textAlign: 'center',
                padding: '50px',
                backgroundColor: '#f0f0f0',
            }}
        >
            <h1>You're Offline! 🦖</h1>
            <p>Keep clicking the button to pass the time.</p>
            <h2>Score: {score}</h2>
            <button
                onClick={() => setScore(score + 1)}
                style={{ padding: '15px 30px', fontSize: '20px', cursor: 'pointer' }}
            >
                Click Me!
            </button>
            <p>Your connection will be restored automatically.</p>
        </div>
    );
};

export default OfflineGame;
