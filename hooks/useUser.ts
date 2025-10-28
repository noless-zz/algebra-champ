import { useState, useEffect, useCallback } from 'react';
import { 
    doc, 
    getDoc, 
    setDoc, 
    updateDoc,
    increment,
    deleteDoc
} from 'firebase/firestore';
import { db } from '../firebase/config.ts';

const CURRENT_USER_KEY = 'aloniYitzhakCurrentUser_9_4';
const USERS_COLLECTION = 'scores_aloni_yitzhak_9_4';

// Helper to get today's date as YYYY-MM-DD
const getTodayId = () => {
    return new Date().toISOString().split('T')[0];
};

// Helper to get the date of the most recent Monday as YYYY-MM-DD
const getWeekId = () => {
    const today = new Date();
    const day = today.getDay(); // Sunday - 0, Monday - 1, ...
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    const monday = new Date(today.setDate(diff));
    return monday.toISOString().split('T')[0];
};

export function useUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async (username: string) => {
    if (!username) {
        setUser(null);
        setLoading(false);
        return;
    }
    setLoading(true);

    // --- START: User data migration for name change ---
    const OLD_USERNAME = 'הורוביץ מעין';
    const NEW_USERNAME = 'הורוביץ מעיין';

    if (username === NEW_USERNAME) {
        const newUserDocRef = doc(db, USERS_COLLECTION, NEW_USERNAME);
        const newUserDocSnap = await getDoc(newUserDocRef);

        // If the new username document doesn't exist, check if we need to migrate from the old one.
        if (!newUserDocSnap.exists()) {
            const oldUserDocRef = doc(db, USERS_COLLECTION, OLD_USERNAME);
            const oldUserDocSnap = await getDoc(oldUserDocRef);

            if (oldUserDocSnap.exists()) {
                console.log(`Migrating user data from "${OLD_USERNAME}" to "${NEW_USERNAME}".`);
                const oldUserData = oldUserDocSnap.data();
                try {
                    // 1. Create the new document with the old data.
                    await setDoc(newUserDocRef, oldUserData);
                    console.log(`Successfully created new document for "${NEW_USERNAME}".`);
                    
                    // 2. Delete the old document.
                    await deleteDoc(oldUserDocRef);
                    console.log(`Successfully deleted old document for "${OLD_USERNAME}".`);
                } catch (migrationError) {
                    console.error("Error during user data migration:", migrationError);
                    // In case of error, we halt the login process to avoid inconsistencies.
                    setLoading(false);
                    return;
                }
            }
        }
    }
    // --- END: User data migration ---


    const userDocRef = doc(db, USERS_COLLECTION, username);
    const userDocSnap = await getDoc(userDocRef);

    const defaultUserStructure = {
        username,
        score: 0,
        completedExercises: 0,
        dailyStats: { score: 0, periodId: 'none' },
        weeklyStats: { score: 0, periodId: 'none', scoresBySubject: {} },
        scoresBySubject: {},
        lastActivity: new Date().toISOString()
    };

    if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        // Merge with defaults to ensure new fields exist for old users
        setUser({ ...defaultUserStructure, ...data, username });
         // Update last activity on load for existing users
        updateDoc(userDocRef, { lastActivity: new Date().toISOString() }).catch(e => {
            console.warn("Could not update last activity time:", e);
        });
    } else {
        // User does not exist, create a new record
        try {
            await setDoc(userDocRef, defaultUserStructure);
            setUser(defaultUserStructure);
        } catch (error) {
            console.error("Error creating user document in Firestore:", error);
            localStorage.removeItem(CURRENT_USER_KEY);
            setUser(null);
        }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    try {
        const storedUsername = localStorage.getItem(CURRENT_USER_KEY);
        if (storedUsername) {
            loadUser(storedUsername);
        } else {
            setLoading(false);
        }
    } catch (error) {
        console.error("Failed to read from localStorage:", error);
        setLoading(false);
    }
  }, [loadUser]);

  const login = useCallback(async (username: string) => {
    localStorage.setItem(CURRENT_USER_KEY, username);
    await loadUser(username);
  }, [loadUser]);

  const logout = useCallback(() => {
    localStorage.removeItem(CURRENT_USER_KEY);
    setUser(null);
  }, []);

  const updateUser = useCallback(async (scoreToAdd: number, exercisesToAdd: number, topic: string) => {
    if (!user || !user.username) return;

    const todayId = getTodayId();
    const weekId = getWeekId();
    
    const userDocRef = doc(db, USERS_COLLECTION, user.username);
    
    // Fetch latest server data to avoid race conditions with period resets
    const docSnap = await getDoc(userDocRef);
    const serverData = docSnap.exists() ? docSnap.data() : {};

    // Calculate new stats based on server data
    const newDailyScore = (serverData.dailyStats?.periodId === todayId ? (serverData.dailyStats.score || 0) : 0) + scoreToAdd;
    
    const oldWeeklyStats = serverData.weeklyStats;
    const newWeeklyScore = (oldWeeklyStats?.periodId === weekId ? (oldWeeklyStats.score || 0) : 0) + scoreToAdd;
    const newWeeklySubjects = oldWeeklyStats?.periodId === weekId ? (oldWeeklyStats.scoresBySubject || {}) : {};
    newWeeklySubjects[topic] = (newWeeklySubjects[topic] || 0) + scoreToAdd;

    const firestoreUpdatePayload = {
        score: increment(scoreToAdd),
        completedExercises: increment(exercisesToAdd),
        [`scoresBySubject.${topic}`]: increment(scoreToAdd),
        dailyStats: { score: newDailyScore, periodId: todayId },
        weeklyStats: { score: newWeeklyScore, periodId: weekId, scoresBySubject: newWeeklySubjects },
        lastActivity: new Date().toISOString()
    };

    // Optimistically update local state with the same calculated logic
    setUser(currentUser => {
        if (!currentUser) return null;
        return {
            ...currentUser,
            score: currentUser.score + scoreToAdd,
            completedExercises: currentUser.completedExercises + exercisesToAdd,
            scoresBySubject: {
                ...currentUser.scoresBySubject,
                [topic]: (currentUser.scoresBySubject?.[topic] || 0) + scoreToAdd,
            },
            dailyStats: firestoreUpdatePayload.dailyStats,
            weeklyStats: firestoreUpdatePayload.weeklyStats,
        };
    });

    try {
        await updateDoc(userDocRef, firestoreUpdatePayload);
    } catch (error) {
        console.error("Failed to update user score:", error);
        // Revert optimistic update by reloading user from server
        await loadUser(user.username);
    }
  }, [user, loadUser]);

  return { user, loading, login, logout, updateUser };
}