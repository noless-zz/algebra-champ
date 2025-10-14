
import React, { useMemo, useState, useEffect } from 'react';
// FIX: Remove v9 firestore imports. The query is now built using the v8 compat API.
// import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import type { User } from '../types';
import { TrophyIcon } from './icons';

interface LeaderboardProps {
    currentUser: User;
    setView: (view: any) => void;
}

type LeaderboardUser = Omit<User, 'email' | 'emailVerified'>;

export const Leaderboard: React.FC<LeaderboardProps> = ({ currentUser, setView }) => {
    const [leaderboardUsers, setLeaderboardUsers] = useState<LeaderboardUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                // FIX: Use v8 compat firestore API to query the collection.
                const usersCollectionRef = collection(db, 'algebra-users');
                const q = query(usersCollectionRef, orderBy('score', 'desc'), limit(10));
                const querySnapshot = await getDocs(q);
                const users: LeaderboardUser[] = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    users.push({
                        uid: data.uid,
                        username: data.username,
                        score: data.score,
                        completedExercises: data.completedExercises,
                    });
                });
                setLeaderboardUsers(users);
            } catch (error) {
                console.error("Error fetching leaderboard: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    const rankedUsers = useMemo(() => {
        const users = [...leaderboardUsers];
        
        let currentUserOnBoard = users.find(u => u.uid === currentUser.uid);

        if (currentUserOnBoard) {
             // Update score from current user state in case it's more recent than the fetch
            currentUserOnBoard.score = currentUser.score;
            currentUserOnBoard.completedExercises = currentUser.completedExercises;
        } else {
             users.push({
                uid: currentUser.uid,
                username: currentUser.username,
                score: currentUser.score,
                completedExercises: currentUser.completedExercises
            });
        }
        
        users.sort((a, b) => b.score - a.score);

        const top10 = users.slice(0, 10);
        const currentUserRank = users.findIndex(u => u.uid === currentUser.uid) + 1;
        const isCurrentUserInTop10 = top10.some(u => u.uid === currentUser.uid);
        
        return { top10, currentUserRank, isCurrentUserInTop10 };
    }, [currentUser, leaderboardUsers]);

    if (loading) {
        return (
            <div className="container mx-auto p-6 text-center">
                <p>טוען את טבלת המובילים...</p>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-6">
            <button onClick={() => setView('DASHBOARD')} className="mb-6 text-primary-600 dark:text-primary-400 hover:underline">
                &larr; חזרה ללוח הבקרה
            </button>
            <div className="text-center mb-8">
                <TrophyIcon className="w-16 h-16 mx-auto text-amber-400" />
                <h2 className="text-4xl font-extrabold mt-4">טבלת המובילים</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2">כאן נמצאים אלופי האלגברה!</p>
            </div>

            <div className="max-w-2xl mx-auto">
                <div className="space-y-3">
                    {rankedUsers.top10.map((user, index) => (
                        <div key={user.uid} className={`flex items-center p-4 rounded-lg transition-all ${user.uid === currentUser.uid ? 'bg-primary-100 dark:bg-primary-900/50 border-2 border-primary-500 scale-105' : 'bg-white dark:bg-slate-800 shadow-sm'}`}>
                            <div className="flex-shrink-0 w-10 text-center font-bold text-xl text-slate-500 dark:text-slate-400">{index + 1}</div>
                            <div className="flex-grow font-semibold text-slate-800 dark:text-slate-100">{user.username}</div>
                            <div className="font-bold text-primary-600 dark:text-primary-300">{user.score.toLocaleString()} נק'</div>
                        </div>
                    ))}
                </div>

                {!rankedUsers.isCurrentUserInTop10 && rankedUsers.currentUserRank > 0 && (
                    <>
                        <div className="text-center my-4 font-bold text-slate-500">...</div>
                        <div className="flex items-center p-4 rounded-lg bg-primary-100 dark:bg-primary-900/50 border-2 border-primary-500 scale-105">
                            <div className="flex-shrink-0 w-10 text-center font-bold text-xl">{rankedUsers.currentUserRank}</div>
                            <div className="flex-grow font-semibold">{currentUser.username} (את/ה)</div>
                            <div className="font-bold text-primary-600 dark:text-primary-300">{currentUser.score.toLocaleString()} נק'</div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
