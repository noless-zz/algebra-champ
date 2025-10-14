import { useState, useEffect, useCallback } from 'react';
import { 
    onAuthStateChanged, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut,
    sendEmailVerification,
    type User as FirebaseUser
} from 'firebase/auth';
import { 
    doc, 
    getDoc, 
    setDoc, 
    collection, 
    query, 
    where, 
    getDocs,
    updateDoc,
    increment
} from 'firebase/firestore';
import { auth, db } from '../firebase/config.ts';

const offensiveWords = [
  // English
  'fuck', 'shit', 'bitch', 'cunt', 'asshole', 'dick', 'pussy', 'nigger', 'faggot',
  // Hebrew
  'זונה', 'שרמוטה', 'בן זונה', 'כוס', 'זין', 'מניאק', 'קקה', 'לזיין'
];

function containsOffensiveWords(username: string): boolean {
  if (!username) return false;
  const lowerCaseUsername = username.toLowerCase();
  return offensiveWords.some(word => lowerCaseUsername.includes(word));
}

export function useUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser && firebaseUser.emailVerified) {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          setUser({ uid: firebaseUser.uid, ...userDocSnap.data() });
        } else {
          console.log(`User document for ${firebaseUser.uid} not found. Creating new document.`);
          try {
            const username = firebaseUser.email ? firebaseUser.email.split('@')[0] : `user_${firebaseUser.uid.substring(0, 5)}`;
            
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("username", "==", username));
            const querySnapshot = await getDocs(q);

            const finalUsername = querySnapshot.empty ? username : `${username}_${Math.random().toString(36).substring(2, 7)}`;

            const newUser = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                username: finalUsername,
                score: 0,
                completedExercises: 0,
            };
            
            await setDoc(userDocRef, newUser);
            setUser(newUser);
          } catch (error) {
            console.error("Failed to create user document:", error);
            await signOut(auth);
            setUser(null);
          }
        }
      } else {
        if (firebaseUser) {
            console.log(`User ${firebaseUser.uid} is logged in but email is not verified.`);
        }
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  const signUp = async (email, password, username) => {
    if (containsOffensiveWords(username)) {
      throw { code: 'auth/offensive-username' };
    }

    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        throw { code: 'auth/username-already-in-use' };
    }
    
    const credentials = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = credentials.user;
    
    if (firebaseUser) {
      await sendEmailVerification(firebaseUser);
      const newUser = {
          email: firebaseUser.email,
          username,
          score: 0,
          completedExercises: 0,
      };
      
      await setDoc(doc(db, "users", firebaseUser.uid), newUser);
      await signOut(auth);
    }
  };

  const login = async (email, password) => {
    const credentials = await signInWithEmailAndPassword(auth, email, password);
    if (!credentials.user.emailVerified) {
        await signOut(auth);
        throw { code: 'auth/email-not-verified' };
    }
  };

  const loginAsGuest = () => {
    const guestUser = {
      uid: `guest_${Date.now()}`,
      username: 'אורח',
      score: 0,
      completedExercises: 0,
      isGuest: true,
    };
    setUser(guestUser);
    setLoading(false);
  };

  const logout = useCallback(async () => {
    if (user && user.isGuest) {
      setUser(null);
    } else {
      await signOut(auth);
    }
  }, [user]);

  const updateUser = useCallback(async (scoreToAdd, exercisesToAdd) => {
    if (!user) return;
    
    // For guests, only update local state
    if (user.isGuest) {
      setUser(currentUser => {
        if (!currentUser) return null;
        return {
          ...currentUser,
          score: currentUser.score + scoreToAdd,
          completedExercises: currentUser.completedExercises + exercisesToAdd,
        };
      });
      return;
    }
    
    // For registered users, update Firestore
    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, {
        score: increment(scoreToAdd),
        completedExercises: increment(exercisesToAdd),
    });
    
    setUser(currentUser => {
      if (!currentUser) return null;
      return {
        ...currentUser,
        score: currentUser.score + scoreToAdd,
        completedExercises: currentUser.completedExercises + exercisesToAdd,
      };
    });
  }, [user]);

  return { user, loading, signUp, login, logout, updateUser, loginAsGuest };
}