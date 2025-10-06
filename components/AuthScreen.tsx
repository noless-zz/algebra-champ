
import React, { useState } from 'react';

interface AuthScreenProps {
  login: (email?: string, password?: string) => Promise<void>;
  signUp: (username?: string, email?: string, password?: string) => Promise<void>;
  loading: boolean;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ login, signUp, loading }) => {
  const [isLogin, setIsLogin] = useState(true);
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In this mock, we don't need the form data, just the action
    if (isLogin) {
      login();
    } else {
      signUp();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
        <h1 className="text-4xl font-bold text-center text-primary-600 dark:text-primary-400 mb-2">אלוף האלגברה</h1>
        <p className="text-center text-slate-500 dark:text-slate-400 mb-8">{isLogin ? 'התחברו כדי להתחיל' : 'צרו חשבון חדש'}</p>
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-4">
              <label className="block text-slate-700 dark:text-slate-300 mb-2" htmlFor="username">שם משתמש</label>
              <input type="text" id="username" placeholder="הקלידו שם משתמש" className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"/>
            </div>
          )}
          <div className="mb-4">
            <label className="block text-slate-700 dark:text-slate-300 mb-2" htmlFor="email">אימייל</label>
            <input type="email" id="email" placeholder="you@example.com" className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"/>
          </div>
          <div className="mb-6">
            <label className="block text-slate-700 dark:text-slate-300 mb-2" htmlFor="password">סיסמה</label>
            <input type="password" id="password" placeholder="••••••••" className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"/>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 disabled:bg-primary-300 disabled:cursor-not-allowed">
            {loading ? 'טוען...' : (isLogin ? 'התחברות' : 'הרשמה')}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
          {isLogin ? 'אין לכם חשבון? ' : 'כבר יש לכם חשבון? '}
          <button onClick={() => setIsLogin(!isLogin)} className="font-semibold text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
            {isLogin ? 'הרשמו כאן' : 'התחברו כאן'}
          </button>
        </p>
      </div>
    </div>
  );
};
