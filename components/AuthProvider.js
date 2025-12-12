'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { request } from '@/lib/api';
import { API_ROUTES } from '@/configue/routes';

const AuthCtx = createContext();


let privateRoutes = ["/tasks", "/profile"];
let authRoutes = ["/auth/login", "/auth/signup"];
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (privateRoutes.includes(pathname) && !user) {
            router.push("/auth/login");
        } else if (authRoutes.includes(pathname) && user) {
            router.push("/tasks");
        }
    }, [pathname]);

    const fetchUser = async () => {
        try {
            const res = await request.get(API_ROUTES.AUTH.ME);
            // Check for success status (200-299)
            if (res && res.status >= 200 && res.status < 300) {
                setUser(res.data);
                localStorage.setItem("user", JSON.stringify(res.data));
            } else {
                setUser(null);
                localStorage.removeItem("user");
            }
        } catch (err) {
            console.error("Error fetching user:", err);
            setUser(null);
            localStorage.removeItem("user");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);


    // logout function
    const logout = async () => {
        await request.post(API_ROUTES.AUTH.LOGOUT, {});
        setUser(null);
        localStorage.removeItem("user");
        router.push("/auth/login");
    };

    return (
        <AuthCtx.Provider value={{ user, logout, setUser, loading }}>
            {!loading && children}
        </AuthCtx.Provider>
    );
};

export const useAuth = () => useContext(AuthCtx);
