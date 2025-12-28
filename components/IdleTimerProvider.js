'use client';

import React, { useEffect, useRef, useState } from 'react';
import IdleModal from './IdleModal';
import { setResetIdleCb } from '../lib/api'; // to reset on API calls
import { useAuth } from './AuthProvider';

const IdleTimerProvider = ({ children }) => {
    const { logout, user } = useAuth();
    // -- CONFIGURATION --
    // Get inactivity and countdown durations from environment variables (or defaults)
    const inactivityMin = Number(process.env.NEXT_PUBLIC_DEFAULT_IDLE_MINUTES || 10);
    const countdownSec = Number(process.env.NEXT_PUBLIC_COUNTDOWN_SECONDS || 60);

    // Convert to milliseconds for setTimeout/setInterval
    const inactivityMs = inactivityMin * 60 * 1000;
    const countdownMs = countdownSec * 1000;

    // -- STATE & REFS --
    // Refs to hold timer IDs so we can clear them effectively
    const timerRef = useRef(null);
    const countdownRef = useRef(null);

    // State to control the warning modal and the countdown display
    const [showModal, setShowModal] = useState(false);
    const [countdown, setCountdown] = useState(countdownSec);

    // List of user events that are considered "activity"
    const activityEvents = ['mousemove', 'mousedown', 'keypress', 'touchstart', 'scroll', 'click'];

    // -- HANDLERS --

    /**
     * Resets the inactivity timer.
     * Called on user activity or when the user chooses to stay logged in.
     */
    const resetInactivity = () => {
        // Hide modal if it was open
        setShowModal(false);
        setCountdown(countdownSec);

        // Clear existing timers
        if (timerRef.current) clearTimeout(timerRef.current);
        if (countdownRef.current) { clearInterval(countdownRef.current); countdownRef.current = null; }

        // Start a new inactivity timeout
        timerRef.current = setTimeout(onInactivityReached, inactivityMs);
    };

    /**
     * Called when the inactivity timer expires.
     * Checks if we should force logout, show the warning modal, or respect "Stay Signed In".
     */
    const onInactivityReached = () => {
        // Check if "Stay Signed In" is enabled in localStorage
        const staySignedIn = typeof window !== 'undefined' && localStorage.getItem('staySignedIn') === 'true';

        if (staySignedIn) {
            // If "Stay Signed In" is true, silently reset the timer and don't show the modal
            resetInactivity();
            return;
        }

        // Otherwise, show the idle warning modal and start the countdown
        setShowModal(true);
        let remaining = countdownSec;
        setCountdown(remaining);

        // Start the second-by-second countdown
        countdownRef.current = setInterval(() => {
            remaining -= 1;
            setCountdown(remaining);

            // Time is up!
            if (remaining <= 0) {
                clearInterval(countdownRef.current);
                countdownRef.current = null;
                performLogout();
            }
        }, 1000);
    };

    /**
     * Logs the user out and redirects to the login page.
     */
    const performLogout = async () => {
        // Call logout from Auth context (clears cookies/server session)
        await logout();
        // Force redirect to login
        window.location.href = '/auth/login';
    };

    // Handler for "Stay Logged In" button in the modal
    const stayLoggedIn = () => {
        // Stop the countdown
        if (countdownRef.current) { clearInterval(countdownRef.current); countdownRef.current = null; }
        // Close modal and restart the main inactivity timer
        setShowModal(false);
        resetInactivity();
    };

    // Handler for "Logout" button in the modal
    const immediateLogout = () => {
        if (countdownRef.current) { clearInterval(countdownRef.current); countdownRef.current = null; }
        performLogout();
    };

    // -- EFFECTS --

    // Effect: Attach event listeners to detect user activity
    // Separated to specific Dependencies to avoid unnecessary re-registrations
    useEffect(() => {
        // Only track activity if user is logged in
        if (!user) {
            return;
        }

        // Event handler for any user activity
        const onActivity = () => {
            // Only reset if the modal IS NOT showing.
            // If the modal is showing, the user must explicitly click "Stay Logged In" to reset.
            if (!showModal) {
                resetInactivity();
            }
        };

        // Add listeners
        activityEvents.forEach(e => window.addEventListener(e, onActivity));

        // Cleanup listeners
        return () => {
            activityEvents.forEach(e => window.removeEventListener(e, onActivity));
        };
    }, [showModal, user]); // Re-run if modal state or user status changes

    // Effect: Initialize timer on mount/login and cleanup on unmount/logout
    useEffect(() => {
        // Only start timer if user is logged in
        if (!user) {
            // If user logs out, clear any running timers
            if (timerRef.current) clearTimeout(timerRef.current);
            if (countdownRef.current) clearInterval(countdownRef.current);
            setShowModal(false);
            return;
        }

        // Start the initial timer
        resetInactivity();

        // Expose the reset function to the API module, so API calls can also reset the idle timer
        setResetIdleCb(() => resetInactivity);

        // Cleanup on unmount or user change
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            if (countdownRef.current) clearInterval(countdownRef.current);
            setResetIdleCb(null);
        };
    }, [user]); // Re-run only when the user object changes (login/logout)

    return (
        <>
            {children}
            <IdleModal
                isOpen={showModal}
                countdown={countdown}
                onStay={stayLoggedIn}
                onLogout={immediateLogout}
            />
        </>
    );
};

export default IdleTimerProvider;
