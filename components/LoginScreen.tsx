import React, { useState, useMemo } from 'react';
import { LogoIcon } from './icons.tsx';
import { userList } from '../users.ts';

export default function LoginScreen({ onLogin, onGuestLogin }) {
  const [selectedInitial, setSelectedInitial] = useState<string | null>(null);

  const initials = useMemo(() => {
    const initialSet = new Set<string>();
    userList.forEach(user => {
      // Assuming format "Lastname Firstname"
      const lastNameInitial = user.split(' ')[0][0];
      initialSet.add(lastNameInitial);
    });
    return Array.from(initialSet).sort((a, b) => a.localeCompare(b, 'he'));
  }, []);

  const filteredUsers = useMemo(() => {
    if (!selectedInitial) return [];
    return userList
        .filter(user => user.split(' ')[0][0] === selectedInitial)
        .sort((a, b) => a.localeCompare(b, 'he'));
  }, [selectedInitial]);
  
  const handleInitialSelect = (initial: string) => {
    setSelectedInitial(initial);
  };
  
  const handleUserSelect = (username: string) => {
    onLogin(username);
  };

  const resetSelection = () => {
    setSelectedInitial(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 text-center">
        <div className="flex justify-center mb-6">
            <LogoIcon className="h-20 w-20 text-indigo-500" />
        </div>
        {!selectedInitial ? (
          <>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                ברוכים הבאים למרכז תירגול כיתה ט' 4 יח"ל - אלוני יצחק
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
                בחרו את האות הראשונה של שם המשפחה שלכם
            </p>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
              {initials.map(initial => (
                <button
                  key={initial}
                  onClick={() => handleInitialSelect(initial)}
                  className="aspect-square flex items-center justify-center bg-gray-200 dark:bg-gray-700 hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-600 rounded-lg font-bold text-2xl transition-all duration-200"
                >
                  {initial}
                </button>
              ))}
            </div>
            <div className="relative flex py-5 items-center">
              <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
              <span className="flex-shrink mx-4 text-gray-500 dark:text-gray-400">או</span>
              <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <button
              onClick={onGuestLogin}
              className="font-semibold text-indigo-500 hover:text-indigo-400"
            >
              כניסה כאורח
            </button>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              בחרו את שמכם
            </h1>
            <button onClick={resetSelection} className="text-indigo-500 hover:underline mb-6">
              &rarr; חזרה לבחירת אות
            </button>
            <div className="space-y-3">
              {filteredUsers.map(user => (
                <button
                  key={user}
                  onClick={() => handleUserSelect(user)}
                  className="w-full text-center px-4 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-600 rounded-lg font-semibold text-xl transition-all duration-200"
                >
                  {user}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}