'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { request } from '@/lib/api';

const AuthCtx = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    // optionally, fetch /auth/me on mount
    useEffect(() => {
        const fetchMe = async () => {
            try {
                const res = await request.get('/auth/me');
                setUser(res.data);
            } catch (e) {
                setUser(null);
            }
        };
        fetchMe();
    }, []);

    const login = async (username, password) => {
        const resp = await request.post('/auth/login', { username, password });
        // resp.data.user contains user info (from dummyjson)
        setUser(resp.data.user);
        return resp.data;
    };

    const logout = async () => {
        await request.post('/auth/logout', {});
        setUser(null);
    };

    return (
        <AuthCtx.Provider value={{ user, login, logout, setUser }}>
            {children}
        </AuthCtx.Provider>
    );
};

export const useAuth = () => useContext(AuthCtx);
