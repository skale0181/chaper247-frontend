'use client';

import React from 'react';

const IdleModal = ({ isOpen, countdown, onStay, onLogout }) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '8px',
                maxWidth: '500px',
                width: '90%',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
                <h2 style={{ marginTop: 0, color: '#333' }}>You're about to be logged out</h2>
                <p style={{ color: '#666' }}>
                    No activity detected. You will be logged out in <strong style={{ color: '#dc3545' }}>{countdown}</strong> seconds.
                </p>
                <div style={{ display: 'flex', gap: '10px', marginTop: '1.5rem' }}>
                    <button
                        onClick={onStay}
                        style={{
                            flex: 1,
                            padding: '0.75rem 1rem',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: '500',
                            fontSize: '1rem'
                        }}
                    >
                        Stay Logged In
                    </button>
                    <button
                        onClick={onLogout}
                        style={{
                            flex: 1,
                            padding: '0.75rem 1rem',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: '500',
                            fontSize: '1rem'
                        }}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default IdleModal;
