
import { useState, useEffect, useCallback } from 'react';
import type { User } from '../types';

// Mock user data for demonstration
const MOCK_USER: User = {
    uid: 'mock-user-123',
    email: 'test@example.com',
    username: 'תלמיד_מוביל',
    score: 150,
    completedExercises: 15,
};

export function useUser() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate checking auth state on initial load
        const storedUser = localStorage.getItem('aluf-haalgebra-user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = useCallback(async (email?: string, password?: string): Promise<void> => {
        setLoading(true);
        // Simulate API call
        await new Promise(res => setTimeout(res, 500));
        const userData = { ...MOCK_USER, email: email || MOCK_USER.email };
        localStorage.setItem('aluf-haalgebra-user', JSON.stringify(userData));
        setUser(userData);
        setLoading(false);
    }, []);

    const signUp = useCallback(async (username?: string, email?: string, password?: string): Promise<void> => {
        setLoading(true);
        // Simulate API call
        await new Promise(res => setTimeout(res, 500));
        const newUserData = {
            ...MOCK_USER,
            username: username || 'שחקן_חדש',
            email: email || 'new@example.com',
            score: 0,
            completedExercises: 0,
        };
        localStorage.setItem('aluf-haalgebra-user', JSON.stringify(newUserData));
        setUser(newUserData);
        setLoading(false);
    }, []);

    const logout = useCallback(async (): Promise<void> => {
        // Simulate API call
        await new Promise(res => setTimeout(res, 200));
        localStorage.removeItem('aluf-haalgebra-user');
        setUser(null);
    }, []);

    const updateUserScore = useCallback((points: number) => {
        setUser(currentUser => {
            if (!currentUser) return null;
            const updatedUser = {
                ...currentUser,
                score: currentUser.score + points,
                completedExercises: currentUser.completedExercises + 1,
            };
            localStorage.setItem('aluf-haalgebra-user', JSON.stringify(updatedUser));
            return updatedUser;
        });
    }, []);


    return { user, loading, login, signUp, logout, updateUserScore };
}
