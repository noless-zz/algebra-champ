
import React, { useMemo } from 'react';
import type { User } from '../types';
import { TrophyIcon } from './icons';

// Mock data, in a real app this would come from Firestore
const MOCK_LEADERBOARD_USERS: Omit<User, 'email'>[] = [
    { uid: 'user-1', username: 'גאון_האלגברה', score: 2540, completedExercises: 254 },
    { uid: 'user-2', username: 'פותר_הכל', score: 2310, completedExercises: 231 },
    { uid: 'user-3', username: 'מלכת_המשוואות', score: 2180, completedExercises: 218 },
    { uid: 'user-4', username: 'x=42', score: 1950, completedExercises: 195 },
    { uid: 'user-5', username: 'פרופסור_פילוג', score: 1760, completedExercises: 176 },
    { uid: 'user-6', username: 'סופר_סטודנט', score: 1520, completedExercises: 152 },
    { uid: 'user-7', username: 'מתמטיקאי_מתחיל', score: 1230, completedExercises: 123 },
    { uid: 'user-8', username: 'מחשבון_אנושי', score: 980, completedExercises: 98 },
    { uid: 'user-9', username: 'שחקן_רציני', score: 750, completedExercises: 75 },
    { uid: 'user-10', username: 'לומד_בכיף', score: 510, completedExercises: 51 },
];

interface LeaderboardProps {
    currentUser: User;
    setView: (view: any) => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ currentUser, setView }) => {

    const rankedUsers = useMemo(() => {
        const users = [...MOCK_LEADERBOARD_USERS];
        // Ensure current user is on the list if not already
        if (!users.some(u => u.uid === currentUser.uid)) {
            users.push(currentUser);
        } else {
            // Update current user's score on the list
            const userIndex = users.findIndex(u => u.uid === currentUser.uid);
            if(userIndex !== -1) {
                users[userIndex] = currentUser;
            }
        }
        
        users.sort((a, b) => b.score - a.score);

        const currentUserRank = users.findIndex(u => u.uid === currentUser.uid) + 1;
        const top10 = users.slice(0, 10);
        
        // If current user is not in top 10, add them to the list for context
        const isCurrentUserInTop10 = top10.some(u => u.uid === currentUser.uid);
        
        return { top10, currentUserRank, isCurrentUserInTop10 };
    }, [currentUser]);


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

                {!rankedUsers.isCurrentUserInTop10 && (
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
