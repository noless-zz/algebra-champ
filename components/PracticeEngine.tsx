
import React, { useState, useEffect, useMemo } from 'react';
import { Topic, AnswerFormat, QuestionType } from '../types';
import type { Question } from '../types';
import { generateExercise } from '../services/exerciseGenerator';

interface PracticeEngineProps {
    setView: (view: any) => void;
    updateUserScore: (points: number) => void;
}

const TopicSelector: React.FC<{ onSelect: (topic: Topic) => void }> = ({ onSelect }) => (
    <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">בחר נושא לתרגול</h2>
        <div className="flex flex-wrap justify-center gap-4">
            {Object.values(Topic).map(topic => (
                <button
                    key={topic}
                    onClick={() => onSelect(topic)}
                    className="px-8 py-4 bg-primary-600 text-white font-semibold rounded-lg shadow-md hover:bg-primary-700 transition-transform transform hover:scale-105"
                >
                    {topic}
                </button>
            ))}
        </div>
    </div>
);

const MultiPartInput: React.FC<{ userAnswer: Record<string, string>, setUserAnswer: (val: Record<string, string>) => void }> = ({ userAnswer, setUserAnswer }) => {
    const handleChange = (part: string, value: string) => {
        setUserAnswer({ ...userAnswer, [part]: value });
    };

    return (
        <div dir="ltr" className="flex items-center justify-center gap-1 font-mono text-2xl">
            <input type="text" value={userAnswer.x2 || ''} onChange={(e) => handleChange('x2', e.target.value)} className="w-16 text-center bg-slate-100 dark:bg-slate-700 rounded-md p-2" />
            <span>x² + </span>
            <input type="text" value={userAnswer.x || ''} onChange={(e) => handleChange('x', e.target.value)} className="w-16 text-center bg-slate-100 dark:bg-slate-700 rounded-md p-2" />
            <span>x + </span>
            <input type="text" value={userAnswer.c || ''} onChange={(e) => handleChange('c', e.target.value)} className="w-16 text-center bg-slate-100 dark:bg-slate-700 rounded-md p-2" />
        </div>
    );
};

export const PracticeEngine: React.FC<PracticeEngineProps> = ({ setView, updateUserScore }) => {
    const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [userAnswer, setUserAnswer] = useState<string | Record<string, string>>('');
    const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null);
    const [showSolution, setShowSolution] = useState(false);

    const loadNextQuestion = () => {
        if (selectedTopic) {
            setCurrentQuestion(generateExercise(selectedTopic));
            setUserAnswer('');
            setFeedback(null);
            setShowSolution(false);
        }
    };

    useEffect(() => {
        if (selectedTopic) {
            loadNextQuestion();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedTopic]);

    const isAnswerCorrect = useMemo(() => {
        if (!currentQuestion) return false;
        if (currentQuestion.isMultiPartInput && typeof userAnswer === 'object') {
            return Object.keys(currentQuestion.correctAnswerParts || {}).every(key =>
                (currentQuestion.correctAnswerParts || {})[key] === userAnswer[key]
            );
        }
        return currentQuestion.correctAnswer === userAnswer;
    }, [currentQuestion, userAnswer]);

    const handleSubmit = () => {
        if (showSolution) return;

        const correct = isAnswerCorrect;
        
        if (correct) {
            setFeedback({ correct: true, message: 'כל הכבוד! תשובה נכונה!' });
            updateUserScore(10);
        } else {
            setFeedback({ correct: false, message: 'אופס, נסו שוב.' });
        }
        setShowSolution(true);
    };

    if (!selectedTopic) {
        return (
             <div className="container mx-auto p-6">
                <button onClick={() => setView('DASHBOARD')} className="mb-6 text-primary-600 dark:text-primary-400 hover:underline">
                    &larr; חזרה ללוח הבקרה
                </button>
                <TopicSelector onSelect={setSelectedTopic} />
            </div>
        );
    }

    if (!currentQuestion) {
        return <div>טוען שאלה...</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <div className="w-full max-w-2xl mx-auto">
                 <div className="flex justify-between items-center mb-4">
                    <button onClick={() => setSelectedTopic(null)} className="text-primary-600 dark:text-primary-400 hover:underline">
                        &larr; החלפת נושא
                    </button>
                    <div className="text-sm font-medium bg-secondary-100 dark:bg-secondary-800 text-secondary-800 dark:text-secondary-200 px-3 py-1 rounded-full">{currentQuestion.topic}</div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-2xl">
                    <div className="text-center mb-6">
                        <div className="text-2xl md:text-3xl font-bold min-h-[80px] flex items-center justify-center">
                            {currentQuestion.questionText}
                        </div>
                    </div>

                    <div className="my-8">
                        {currentQuestion.answerFormat === AnswerFormat.MULTIPLE_CHOICE && (
                            <div className="grid grid-cols-2 gap-4">
                                {currentQuestion.options?.map((option, i) => (
                                    <button
                                        key={i}
                                        disabled={showSolution}
                                        onClick={() => setUserAnswer(option)}
                                        className={`p-4 rounded-lg font-mono text-lg transition-all ${userAnswer === option ? 'ring-4 ring-primary-500 scale-105' : 'ring-2 ring-slate-300 dark:ring-slate-600'} ${showSolution && option === currentQuestion.correctAnswer ? 'bg-green-200 dark:bg-green-800 ring-green-500' : ''} ${showSolution && userAnswer === option && !isAnswerCorrect ? 'bg-red-200 dark:bg-red-800 ring-red-500' : ''} disabled:opacity-70 disabled:cursor-not-allowed`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        )}
                         {currentQuestion.answerFormat === AnswerFormat.TEXT_INPUT && (
                            currentQuestion.isMultiPartInput ? 
                                <MultiPartInput userAnswer={userAnswer as Record<string, string>} setUserAnswer={setUserAnswer as (val: Record<string, string>) => void} /> :
                                <input
                                    type="text"
                                    value={userAnswer as string}
                                    onChange={(e) => setUserAnswer(e.target.value)}
                                    disabled={showSolution}
                                    className="w-full text-center p-4 rounded-lg font-mono text-xl bg-slate-100 dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                        )}
                    </div>

                    {feedback && (
                        <div className={`p-4 rounded-lg text-center font-bold ${feedback.correct ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                            {feedback.message}
                        </div>
                    )}
                    
                    {showSolution && (
                         <div className="mt-4 p-4 bg-slate-100 dark:bg-slate-700 rounded-lg text-center">
                            <p className="font-bold">התשובה הנכונה:</p>
                            <p className="font-mono text-xl text-primary-500 my-2">{currentQuestion.solution.finalAnswer}</p>
                            <p className="text-sm text-slate-600 dark:text-slate-300">{currentQuestion.solution.explanation}</p>
                         </div>
                    )}

                    <div className="mt-8 text-center">
                        {showSolution ? (
                            <button onClick={loadNextQuestion} className="w-full md:w-auto px-10 py-3 bg-secondary-600 hover:bg-secondary-700 text-white font-bold rounded-lg transition-transform transform hover:scale-105">
                                השאלה הבאה &rarr;
                            </button>
                        ) : (
                            <button onClick={handleSubmit} disabled={!userAnswer} className="w-full md:w-auto px-10 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg transition disabled:bg-slate-400 disabled:cursor-not-allowed">
                                בדיקה
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
