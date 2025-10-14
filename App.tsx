import React, { useState, useEffect } from 'react';
import { useUser } from './hooks/useUser';
import { View } from './types';
import { AuthScreen } from './components/AuthScreen';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { LearnSection } from './components/LearnSection';
import { PracticeEngine } from './components/PracticeEngine';
import { Leaderboard } from './components/Leaderboard';
import { VerificationScreen } from './components/VerificationScreen';

const App: React.FC = () => {
    const { user, loading, login, signUp, logout, updateUserScore, sendVerificationEmail, reloadUser } = useUser();
    const [view, setView] = useState<View>(View.DASHBOARD);
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('aluf-haalgebra-theme');
        if (savedTheme) {
            setIsDarkMode(savedTheme === 'dark');
        } else {
            setIsDarkMode(prefersDark);
        }
    }, []);
    
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('aluf-haalgebra-theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('aluf-haalgebra-theme', 'light');
        }
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        setIsDarkMode(prev => !prev);
    };
    
    const setViewAndScroll = (newView: View) => {
        setView(newView);
        window.scrollTo(0, 0);
    }

    const renderContent = () => {
        switch (view) {
            case View.LEARN:
                return <LearnSection setView={setViewAndScroll} />;
            case View.PRACTICE:
                return <PracticeEngine setView={setViewAndScroll} updateUserScore={updateUserScore} />;
            case View.LEADERBOARD:
                if(user) return <Leaderboard currentUser={user} setView={setViewAndScroll} />;
                return null;
            case View.DASHBOARD:
            default:
                if (user) return <Dashboard user={user} setView={setViewAndScroll} />;
                return null;
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">טוען...</div>;
    }

    if (user && !user.emailVerified) {
        return <VerificationScreen 
                    user={user} 
                    sendVerificationEmail={sendVerificationEmail}
                    reloadUser={reloadUser}
                    logout={logout}
                />;
    }

    if (!user) {
        return <AuthScreen login={login} signUp={signUp} loading={loading} />;
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header user={user} logout={logout} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
            <main className="flex-grow">
                {renderContent()}
            </main>
            <footer className="text-center py-4 text-xs text-slate-400 dark:text-slate-500">
                נוצר עבור אתגר הפיתוח של Gemini
            </footer>
        </div>
    );
};

export default App;