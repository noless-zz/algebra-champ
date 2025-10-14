
import { useState, useEffect, useCallback } from 'react';
// FIX: Switched to Firebase v8 compat imports and APIs to resolve module export errors.
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { auth, db } from '../firebase/config';
import type { User } from '../types';

// FIX: Use Firebase v8 compat type for User.
type FirebaseUser = firebase.User;

export function useUser() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUserFromFirestore = async (firebaseUser: FirebaseUser): Promise<User | null> => {
        // FIX: Use v8 compat firestore API.
        const userDocRef = db.collection('algebra-users').doc(firebaseUser.uid);
        const userDoc = await userDocRef.get();
        // FIX: .exists is a property in v8
        if (userDoc.exists) {
            const firestoreData = userDoc.data();
            if (firestoreData) {
                return {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email || '',
                    emailVerified: firebaseUser.emailVerified,
                    username: firestoreData.username,
                    score: firestoreData.score,
                    completedExercises: firestoreData.completedExercises,
                };
            }
        }
        return null;
    };

    useEffect(() => {
        // FIX: Use v8 compat auth API.
        const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
            if (firebaseUser) {
                const fullUser = await fetchUserFromFirestore(firebaseUser);
                setUser(fullUser);
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = useCallback(async (options?: { email?: string; password?: string; isGuest?: boolean }): Promise<void> => {
        setLoading(true);
        
        if (options?.isGuest) {
             const guestData: User = { 
                uid: `guest-${Date.now()}`, 
                username: 'אורח', 
                email: 'guest@example.com', 
                score: 0, 
                completedExercises: 0, 
                emailVerified: true 
            };
            setUser(guestData);
            setLoading(false);
            return;
        }

        const { email, password } = options || {};
        if (!email || !password) {
            setLoading(false);
            throw new Error("Email and password are required.");
        }
        
        try {
            // FIX: Use v8 compat auth API.
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            if (userCredential.user && !userCredential.user.emailVerified) {
                // FIX: Use v8 compat auth API.
                await auth.signOut(); // Sign out user if email is not verified
                throw new Error("Email not verified");
            }
            // onAuthStateChanged will handle setting the user state
        } catch (error) {
            throw error; // Rethrow to be caught in the UI
        } finally {
            setLoading(false);
        }
    }, []);

    const signUp = useCallback(async (username: string, email: string, password?: string): Promise<void> => {
        setLoading(true);
        if (!password) {
            setLoading(false);
            throw new Error("Password is required for signup.");
        }

        try {
            // FIX: Use v8 compat auth API.
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const firebaseUser = userCredential.user;
            
            if (!firebaseUser) {
                throw new Error("User creation failed.");
            }

            // Create user document in Firestore
            // FIX: Use v8 compat firestore API.
            const userDocRef = db.collection('algebra-users').doc(firebaseUser.uid);
            // FIX: Use v8 compat firestore API.
            await userDocRef.set({
                uid: firebaseUser.uid,
                username,
                email,
                score: 0,
                completedExercises: 0,
            });

            // Send verification email
            // FIX: Use v8 compat auth API.
            await firebaseUser.sendEmailVerification();

            // onAuthStateChanged will handle setting the new user state,
            // which will then show the verification screen in App.tsx
        } catch (error) {
            throw error; // Rethrow to be handled in UI
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(async (): Promise<void> => {
        // FIX: Use v8 compat auth API.
        await auth.signOut();
        setUser(null);
    }, []);

    const sendVerificationEmail = useCallback(async (): Promise<void> => {
        if (auth.currentUser) {
            // FIX: Use v8 compat auth API.
            await auth.currentUser.sendEmailVerification();
        } else {
            throw new Error("No user is signed in to send a verification email.");
        }
    }, []);

    const reloadUser = useCallback(async (): Promise<void> => {
        if (!auth.currentUser) return;

        await auth.currentUser.reload();
        // After reload, onAuthStateChanged might not fire if only metadata changed.
        // So we manually fetch and update state to ensure UI reacts.
        if (auth.currentUser) {
            const freshUser = await fetchUserFromFirestore(auth.currentUser);
            setUser(freshUser);
        }

    }, []);

    const updateUserScore = useCallback((points: number) => {
        if (!user || user.email === 'guest@example.com') return; // Don't update score for guests
        
        // FIX: Use v8 compat firestore API.
        const userDocRef = db.collection('algebra-users').doc(user.uid);
        // FIX: Use v8 compat firestore API for updating and incrementing values.
        userDocRef.update({
            score: firebase.firestore.FieldValue.increment(points),
            completedExercises: firebase.firestore.FieldValue.increment(1),
        });

        // Optimistically update local state for immediate feedback
        setUser(currentUser => {
            if (!currentUser) return null;
            const updatedUser = {
                ...currentUser,
                score: currentUser.score + points,
                completedExercises: currentUser.completedExercises + 1,
            };
            return updatedUser;
        });
    }, [user]);


    return { user, loading, login, signUp, logout, updateUserScore, sendVerificationEmail, reloadUser };
}
