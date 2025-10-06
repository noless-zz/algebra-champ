
import React from 'react';
import type { User } from '../types';
import { SunIcon, MoonIcon, LogoutIcon } from './icons';

interface HeaderProps {
  user: User;
  logout: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, logout, isDarkMode, toggleDarkMode }) => {
  return (
    <header className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-lg shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
          אלוף האלגברה
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded-full text-sm">
            <span className="font-medium">{user.username}</span>
            <span className="font-bold text-amber-500">{user.score.toLocaleString()} נק'</span>
          </div>
          <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            {isDarkMode ? <SunIcon className="w-5 h-5 text-yellow-400" /> : <MoonIcon className="w-5 h-5 text-slate-600" />}
          </button>
          <button onClick={logout} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400 transition-colors">
            <LogoutIcon className="w-5 h-5" />
            <span>התנתקות</span>
          </button>
        </div>
      </div>
    </header>
  );
};
