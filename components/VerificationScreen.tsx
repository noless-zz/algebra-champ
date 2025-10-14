import React, { useState, useEffect, useCallback } from 'react';
import type { User } from '../types';

interface VerificationScreenProps {
  user: User;
  sendVerificationEmail: () => Promise<void>;
  reloadUser: () => Promise<void>;
  logout: () => void;
}

export const VerificationScreen: React.FC<VerificationScreenProps> = ({ user, sendVerificationEmail, reloadUser, logout }) => {
  const [isSending, setIsSending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [status, setStatus] = useState('ממתין לאימות...');

  const handleSendVerification = useCallback(async (isResend: boolean = false) => {
      if (isSending || resendCooldown > 0) return;

      setIsSending(true);
      setStatus('שולח אימייל אימות...');
      try {
        await sendVerificationEmail();
        setStatus(`שלחנו קישור אימות לכתובת ${user.email}.`);
        if (isResend) {
            setResendCooldown(30);
        }
      } catch (error) {
        console.error("Failed to send verification email:", error);
        setStatus('אירעה שגיאה בשליחת האימייל. נסו שוב.');
      } finally {
        setIsSending(false);
      }
  }, [sendVerificationEmail, user.email, isSending, resendCooldown]);

  useEffect(() => {
    // Send email automatically on first load
    handleSendVerification(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount
  
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  useEffect(() => {
    // When the user verifies their email, the user object from the useUser hook will update.
    // The parent App component will then re-render and this screen will be unmounted.
    // This polling ensures we get the latest user status from Firebase.
    const interval = setInterval(async () => {
        try {
            await reloadUser();
        } catch (error) {
            console.error("Failed to reload user status:", error);
        }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(interval);
  }, [reloadUser, user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        </div>
        <h1 className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-4">אמתו את חשבונכם</h1>
        <p className="text-slate-600 dark:text-slate-300 mb-6 min-h-[40px]">
          {status}
        </p>
        
        <button 
          onClick={() => handleSendVerification(true)}
          disabled={isSending || resendCooldown > 0}
          className="relative w-full border-2 border-primary-600 text-primary-600 dark:text-primary-300 dark:border-primary-400 font-bold py-2.5 px-4 rounded-lg transition duration-300 hover:bg-primary-50 dark:hover:bg-primary-900/50 disabled:opacity-75 disabled:cursor-not-allowed overflow-hidden"
        >
          {resendCooldown > 0 && (
            <div
              className="absolute top-0 right-0 h-full bg-primary-500/20"
              style={{
                width: `${(resendCooldown / 30) * 100}%`,
                transition: resendCooldown === 30 ? 'none' : 'width 1s linear',
              }}
            />
          )}
          <span className="relative z-10">
             {isSending ? 'שולח...' : (resendCooldown > 0 ? `שלח שוב בעוד (${resendCooldown})` : 'שלח אימייל חדש')}
          </span>
        </button>
        <button 
          onClick={logout}
          className="mt-4 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        >
          &larr; חזרה להתחברות
        </button>
      </div>
    </div>
  );
};