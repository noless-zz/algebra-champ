import React, { useState } from 'react';
import { LogoIcon } from './icons.tsx';

export default function AuthScreen({ onLogin, onSignUp, onGuestLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await onLogin(email, password);
      } else {
        await onSignUp(email, password, username);
        setShowVerificationMessage(true);
      }
    } catch (err) {
      let message = "אירעה שגיאה. נסה שוב.";
      if (err.code === 'auth/email-already-in-use') message = 'כתובת הדוא"ל כבר בשימוש.';
      if (err.code === 'auth/invalid-email') message = 'כתובת הדוא"ל אינה תקינה.';
      if (err.code === 'auth/weak-password') message = 'הסיסמה חלשה מדי. נדרשים לפחות 6 תווים.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') message = 'דוא"ל או סיסמה שגויים.';
      if (err.code === 'auth/username-already-in-use') message = 'שם המשתמש כבר תפוס. בחר שם אחר.';
      if (err.code === 'auth/offensive-username') message = 'שם המשתמש מכיל מילים לא ראויות. אנא בחר שם אחר.';
      if (err.code === 'auth/email-not-verified') message = 'יש לאמת את כתובת הדוא"ל שלך. בדוק את תיבת הדואר הנכנס.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  if (showVerificationMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 text-center">
            <div className="flex justify-center mb-6">
                <LogoIcon className="h-20 w-20 text-indigo-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">הרשמה הושלמה!</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
                שלחנו דוא"ל אימות לכתובת <strong>{email}</strong>.
                <br/>
                יש ללחוץ על הקישור בהודעה כדי להפעיל את חשבונך.
            </p>
            <button 
                onClick={() => {
                    setShowVerificationMessage(false);
                    setIsLogin(true);
                }} 
                className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg py-3 px-4 rounded-lg transition"
            >
                חזרה למסך ההתחברות
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8">
        <div className="flex justify-center mb-6">
            <LogoIcon className="h-20 w-20 text-indigo-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
            {isLogin ? "התחברות למרכז תירגול כיתה ט' 4 יח\"ל - אלוני יצחק" : "הרשמה למרכז תירגול כיתה ט' 4 יח\"ל - אלוני יצחק"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4 mt-8">
          {!isLogin && (
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="שם משתמש"
              required
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-indigo-500 focus:ring-0 rounded-lg text-lg"
            />
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='דוא"ל'
            required
            className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-indigo-500 focus:ring-0 rounded-lg text-lg"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="סיסמה"
            required
            className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-indigo-500 focus:ring-0 rounded-lg text-lg"
          />

          {error && <p className="text-red-500 text-center">{error}</p>}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white font-bold text-lg py-3 px-4 rounded-lg transition"
          >
            {loading ? 'טוען...' : (isLogin ? 'התחבר' : 'הירשם')}
          </button>
        </form>

        <p className="text-center mt-6">
          {isLogin ? 'אין לך חשבון?' : 'יש לך כבר חשבון?'}
          <button onClick={toggleMode} className="font-semibold text-indigo-500 hover:text-indigo-400 ml-2">
            {isLogin ? 'הירשם כאן' : 'התחבר כאן'}
          </button>
        </p>

        <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
            <span className="flex-shrink mx-4 text-gray-500 dark:text-gray-400">או</span>
            <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
        </div>

        <button
          onClick={onGuestLogin}
          className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold text-lg py-3 px-4 rounded-lg transition"
        >
          המשך כאורח
        </button>
      </div>
    </div>
  );
}