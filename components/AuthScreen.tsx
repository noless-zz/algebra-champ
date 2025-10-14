
import React, { useState } from 'react';
import type { User } from '../types';
// FIX: Remove FirebaseError import which was causing an error. Error handling is now done via duck-typing.

interface AuthScreenProps {
  login: (options?: { email?: string; password?: string; isGuest?: boolean }) => Promise<void>;
  signUp: (username: string, email: string, password?: string) => Promise<void>;
  loading: boolean;
}

const BAD_WORDS = ['טמבל', 'אידיוט', 'מטומטם', 'זונה', 'שרמוטה', 'מניאק', 'קקה'];

export const AuthScreen: React.FC<AuthScreenProps> = ({ login, signUp, loading }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    
    try {
        if (isLogin) {
            await login({ email, password });
        } else {
            if (username.length < 3) {
                setError('שם המשתמש חייב להכיל לפחות 3 תווים.');
                return;
            }
            if (BAD_WORDS.some(word => username.toLowerCase().includes(word))) {
                setError('שם המשתמש מכיל מילים לא ראויות.');
                return;
            }
            await signUp(username, email, password);
            // After signup, the App component will automatically show the verification screen.
        }
    } catch (err) {
        if (err instanceof Error) {
            if (err.message === "Email not verified") {
                setError("האימייל עדיין לא אומת. בדקו את תיבת הדואר שלכם.");
            // FIX: Use duck-typing to check for Firebase errors instead of `instanceof FirebaseError`. This resolves the import error and property access error.
            } else if (err && typeof err === 'object' && 'code' in err) {
                const firebaseError = err as { code: string };
                switch(firebaseError.code) {
                    case 'auth/user-not-found':
                    case 'auth/wrong-password':
                    case 'auth/invalid-credential':
                        setError('פרטי ההתחברות שגויים. נסו שוב.');
                        break;
                    case 'auth/email-already-in-use':
                        setError('משתמש עם אימייל זה כבר קיים.');
                        break;
                    case 'auth/weak-password':
                        setError('הסיסמה חלשה מדי. היא חייבת להכיל לפחות 6 תווים.');
                        break;
                    case 'auth/invalid-email':
                        setError('האימייל שהוזן אינו תקין.');
                        break;
                    default:
                        setError('אירעה שגיאה. נסו שוב.');
                }
            } else {
                 setError('אירעה שגיאה. נסו שוב.');
            }
        } else {
            setError('אירעה שגיאה לא ידועה. נסו שוב.');
        }
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
              <input type="text" id="username" placeholder="הקלידו שם משתמש" value={username} onChange={e => setUsername(e.target.value)} required className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"/>
            </div>
          )}
          <div className="mb-4">
            <label className="block text-slate-700 dark:text-slate-300 mb-2" htmlFor="email">אימייל</label>
            <input type="email" id="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"/>
          </div>
          <div className="mb-6">
            <label className="block text-slate-700 dark:text-slate-300 mb-2" htmlFor="password">סיסמה</label>
            <input type="password" id="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"/>
          </div>
          
          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
          
          <button type="submit" disabled={loading} className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 disabled:bg-primary-300 disabled:cursor-not-allowed">
            {loading ? 'טוען...' : (isLogin ? 'התחברות' : 'הרשמה')}
          </button>
        </form>

        <div className="my-4 flex items-center before:flex-1 before:border-t before:border-slate-300 dark:before:border-slate-600 after:flex-1 after:border-t after:border-slate-300 dark:after:border-slate-600">
          <p className="mx-4 text-center text-sm text-slate-500 dark:text-slate-400">או</p>
        </div>

        <button onClick={() => login({ isGuest: true })} disabled={loading} className="w-full border-2 border-primary-600 text-primary-600 dark:text-primary-300 dark:border-primary-400 font-bold py-2.5 px-4 rounded-lg transition duration-300 hover:bg-primary-50 dark:hover:bg-primary-900/50 disabled:opacity-50">
          המשך כאורח
        </button>

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
