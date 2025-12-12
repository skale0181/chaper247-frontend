'use client';

import React, { useEffect, useRef, useState } from 'react';
import IdleModal from './IdleModal';
import { setResetIdleCb } from '../lib/api'; // to reset on API calls
import { useAuth } from './AuthProvider';

const IdleTimerProvider = ({ children }) => {
    const { logout, user } = useAuth();
    const inactivityMin = Number(process.env.NEXT_PUBLIC_DEFAULT_IDLE_MINUTES || 10);
    const countdownSec = Number(process.env.NEXT_PUBLIC_COUNTDOWN_SECONDS || 60);

    const inactivityMs = inactivityMin * 60 * 1000;
    const countdownMs = countdownSec * 1000;

    const timerRef = useRef(null);
    const countdownRef = useRef(null);
    const [showModal, setShowModal] = useState(false);
    const [countdown, setCountdown] = useState(countdownSec);
    const activityEvents = ['mousemove', 'mousedown', 'keypress', 'touchstart', 'scroll', 'click'];

    const resetInactivity = () => {
        // clear timers & restart inactivity timer:
        setShowModal(false);
        setCountdown(countdownSec);
        if (timerRef.current) clearTimeout(timerRef.current);
        if (countdownRef.current) { clearInterval(countdownRef.current); countdownRef.current = null; }
        timerRef.current = setTimeout(onInactivityReached, inactivityMs);
    };

    const onInactivityReached = () => {
        // Check if "Stay Signed In" is enabled
        const staySignedIn = typeof window !== 'undefined' && localStorage.getItem('staySignedIn') === 'true';

        if (staySignedIn) {
            // Reset timer and return, do not show modal
            resetInactivity();
            return;
        }

        // show modal and start countdown interval
        setShowModal(true);
        let remaining = countdownSec;
        setCountdown(remaining);
        countdownRef.current = setInterval(() => {
            remaining -= 1;
            setCountdown(remaining);
            if (remaining <= 0) {
                clearInterval(countdownRef.current);
                countdownRef.current = null;
                performLogout();
            }
        }, 1000);
    };

    const performLogout = async () => {
        // call logout function from auth provider which will clear cookies via backend
        await logout();
        // redirect to login page
        window.location.href = '/auth/login';
    };

    // stay logged in from modal
    const stayLoggedIn = () => {
        // hide modal and reset
        if (countdownRef.current) { clearInterval(countdownRef.current); countdownRef.current = null; }
        setShowModal(false);
        resetInactivity();
    };

    // immediate logout from modal
    const immediateLogout = () => {
        if (countdownRef.current) { clearInterval(countdownRef.current); countdownRef.current = null; }
        performLogout();
    };

    // register events - separated to avoid re-registering on showModal change
    useEffect(() => {
        // Only track activity if user is logged in
        if (!user) {
            return;
        }

        // register handlers
        const onActivity = () => {
            // Don't reset if modal is showing - user must explicitly click "Stay Logged In"
            if (!showModal) {
                resetInactivity();
            }
        };

        activityEvents.forEach(e => window.addEventListener(e, onActivity));

        return () => {
            activityEvents.forEach(e => window.removeEventListener(e, onActivity));
        };
    }, [showModal, user]); // Re-register when showModal or user changes

    // Initial setup and API callback
    useEffect(() => {
        // Only start timer if user is logged in
        if (!user) {
            // Clear any existing timers if user logs out
            if (timerRef.current) clearTimeout(timerRef.current);
            if (countdownRef.current) clearInterval(countdownRef.current);
            setShowModal(false);
            return;
        }

        resetInactivity(); // Start timer on mount or when user logs in

        // expose reset hook to API wrapper
        setResetIdleCb(() => resetInactivity);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            if (countdownRef.current) clearInterval(countdownRef.current);
            setResetIdleCb(null);
        };
    }, [user]); // Run when user changes (login/logout)

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
