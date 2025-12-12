'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * PopupMessage Context
 * Provides global access to show popup messages from anywhere in the app
 */
const PopupContext = createContext();

/**
 * Hook to access popup message functions
 */
export const usePopup = () => {
    const context = useContext(PopupContext);
    if (!context) {
        throw new Error('usePopup must be used within PopupProvider');
    }
    return context;
};

/**
 * PopupProvider Component
 * Wrap your app with this to enable popup messages
 */
export const PopupProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);

    const showPopup = (message, type = 'info', duration = 3000) => {
        const id = Date.now();
        const newMessage = { id, message, type, duration };

        setMessages(prev => [...prev, newMessage]);

        // Auto-remove after duration
        if (duration > 0) {
            setTimeout(() => {
                removePopup(id);
            }, duration);
        }

        return id;
    };

    const removePopup = (id) => {
        setMessages(prev => prev.filter(msg => msg.id !== id));
    };

    const showSuccess = (message, duration) => showPopup(message, 'success', duration);
    const showError = (message, duration) => showPopup(message, 'error', duration);
    const showWarning = (message, duration) => showPopup(message, 'warning', duration);
    const showInfo = (message, duration) => showPopup(message, 'info', duration);

    return (
        <PopupContext.Provider value={{ showPopup, showSuccess, showError, showWarning, showInfo, removePopup }}>
            {children}
            <PopupContainer messages={messages} onRemove={removePopup} />
        </PopupContext.Provider>
    );
};

/**
 * PopupContainer Component
 * Displays all active popup messages
 */
const PopupContainer = ({ messages, onRemove }) => {
    if (messages.length === 0) return null;

    return (
        <div style={styles.container}>
            {messages.map(msg => (
                <PopupMessage
                    key={msg.id}
                    message={msg.message}
                    type={msg.type}
                    onClose={() => onRemove(msg.id)}
                />
            ))}
        </div>
    );
};

/**
 * PopupMessage Component (Individual notification)
 */
const PopupMessage = ({ message, type = 'info', onClose }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger animation on mount
        setTimeout(() => setIsVisible(true), 10);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for fade-out animation
    };

    const getTypeStyles = () => {
        switch (type) {
            case 'success':
                return {
                    backgroundColor: '#d4edda',
                    borderColor: '#28a745',
                    color: '#155724',
                    icon: '✓'
                };
            case 'error':
                return {
                    backgroundColor: '#f8d7da',
                    borderColor: '#dc3545',
                    color: '#721c24',
                    icon: '✕'
                };
            case 'warning':
                return {
                    backgroundColor: '#fff3cd',
                    borderColor: '#ffc107',
                    color: '#856404',
                    icon: '⚠'
                };
            case 'info':
            default:
                return {
                    backgroundColor: '#d1ecf1',
                    borderColor: '#17a2b8',
                    color: '#0c5460',
                    icon: 'ℹ'
                };
        }
    };

    const typeStyles = getTypeStyles();

    return (
        <div
            style={{
                ...styles.message,
                backgroundColor: typeStyles.backgroundColor,
                borderLeftColor: typeStyles.borderColor,
                color: typeStyles.color,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
            }}
        >
            <div style={styles.iconContainer}>
                <span style={{
                    ...styles.icon,
                    backgroundColor: typeStyles.borderColor
                }}>
                    {typeStyles.icon}
                </span>
            </div>
            <div style={styles.messageText}>{message}</div>
            <button
                onClick={handleClose}
                style={styles.closeButton}
                aria-label="Close notification"
            >
                ✕
            </button>
        </div>
    );
};

// Styles
const styles = {
    container: {
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxWidth: '400px',
        width: '100%',
        pointerEvents: 'none',
    },
    message: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '16px',
        borderRadius: '8px',
        borderLeft: '4px solid',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        transition: 'all 0.3s ease',
        pointerEvents: 'auto',
        position: 'relative',
    },
    iconContainer: {
        flexShrink: 0,
    },
    icon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        color: '#ffffff',
        fontSize: '14px',
        fontWeight: 'bold',
    },
    messageText: {
        flex: 1,
        fontSize: '14px',
        fontWeight: '500',
        lineHeight: '1.5',
    },
    closeButton: {
        background: 'none',
        border: 'none',
        fontSize: '18px',
        cursor: 'pointer',
        padding: '4px',
        color: 'inherit',
        opacity: 0.6,
        transition: 'opacity 0.2s ease',
        flexShrink: 0,
    },
};

export default PopupMessage;
