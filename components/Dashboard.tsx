
import React from 'react';
import { View } from '../types';
import type { User } from '../types';
import { BookOpenIcon, SwordIcon, TrophyIcon } from './icons';

interface DashboardProps {
  user: User;
  setView: (view: View) => void;
}

const StatCard: React.FC<{ label: string; value: string | number; icon: React.ReactNode }> = ({ label, value, icon }) => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg flex items-center gap-4">
    <div className="bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-300 p-3 rounded-full">
      {icon}
    </div>
    <div>
      <div className="text-sm text-slate-500 dark:text-slate-400">{label}</div>
      <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</div>
    </div>
  </div>
);

const NavCard: React.FC<{ title: string; description: string; icon: React.ReactNode; onClick: () => void; }> = ({ title, description, icon, onClick }) => (
  <button
    onClick={onClick}
    className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transform transition-all duration-300 text-right group"
  >
    <div className="flex items-center gap-4 mb-2">
      <div className="text-primary-500 group-hover:text-primary-400 transition-colors">{icon}</div>
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{title}</h3>
    </div>
    <p className="text-slate-500 dark:text-slate-400">{description}</p>
  </button>
);

export const Dashboard: React.FC<DashboardProps> = ({ user, setView }) => {
  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-2">ברוך שובך, {user.username}!</h2>
      <p className="text-slate-500 dark:text-slate-400 mb-8">מוכנים לאתגר את המוח?</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <StatCard label="ניקוד כולל" value={user.score.toLocaleString()} icon={<TrophyIcon className="w-8 h-8"/>} />
        <StatCard label="תרגילים שהושלמו" value={user.completedExercises} icon={<SwordIcon className="w-8 h-8"/>} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <NavCard 
          title="מרכז למידה"
          description="רעננו את הידע שלכם עם הסברים ודוגמאות אינטראקטיביות."
          icon={<BookOpenIcon className="w-10 h-10"/>}
          onClick={() => setView(View.LEARN)}
        />
        <NavCard 
          title="זירת אימונים"
          description="תרגלו את מה שלמדתם עם שאלות מאתגרות וצברו נקודות."
          icon={<SwordIcon className="w-10 h-10"/>}
          onClick={() => setView(View.PRACTICE)}
        />
        <NavCard 
          title="טבלת המובילים"
          description="ראו איך אתם מדורגים מול אלופי האלגברה האחרים."
          icon={<TrophyIcon className="w-10 h-10"/>}
          onClick={() => setView(View.LEADERBOARD)}
        />
      </div>
    </div>
  );
};
