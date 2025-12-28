"use client"; // Required for hooks and window listeners

import { useState, useEffect } from "react";
import OfflineGame from "./OfflineGame"; // Your game component

export default function NetworkWrapper({ children }) {
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        // Initial check (handles cases where user opens app while offline)
        setIsOnline(navigator.onLine);

        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    // If offline, swap the entire UI for the game
    if (!isOnline) {
        return <OfflineGame />;
    }

    return <>{children}</>;
}
