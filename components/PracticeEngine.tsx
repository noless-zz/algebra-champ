import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Topic, Difficulty, AnswerFormat, TopicStructure } from '../types.ts';
import { generateExercise } from '../services/exerciseGenerator.ts';

// --- Helper Components ---

const PracticeTriangleDrawing = ({
    showAltitude = false, // from A to BC
    showMedian = false, // from A to BC
    showAngleBisector = false, // from A
    showSideTicks = false, // AB=AC
    showAngleTicks = false, // angle B = angle C
    showMedianFromB = false,
}) => {
    return (
        <div className="flex justify-center">
            <svg viewBox="0 0 100 102" className="w-64 h-64">
                <polygon points="50,10 10,90 90,90" className="fill-blue-100 dark:fill-blue-900/50 stroke-blue-500 dark:stroke-blue-400" strokeWidth="1" />
    
                {(showAltitude || showMedian || showAngleBisector) &&
                    <line x1="50" y1="10" x2="50" y2="90" className="stroke-red-500 dark:stroke-red-400" strokeWidth="1" strokeDasharray="2,2" />}
                
                {showAltitude &&
                    <polygon points="50,90 50,85 55,85 55,90" className="fill-none stroke-orange-500 dark:stroke-orange-400" strokeWidth="1" />}
                
                {showMedian && <>
                    <line x1="30" y1="88" x2="30" y2="92" className="stroke-green-500 dark:stroke-green-400" strokeWidth="1.5" />
                    <line x1="70" y1="88" x2="70" y2="92" className="stroke-green-500 dark:stroke-green-400" strokeWidth="1.5" />
                </>}
    
                {showAngleBisector && <>
                    <path d="M50,25 A 25 25 0 0 0 42,28" fill="none" className="stroke-purple-500 dark:stroke-purple-400" strokeWidth="1.2" />
                    <path d="M50,25 A 25 25 0 0 1 58,28" fill="none" className="stroke-purple-500 dark:stroke-purple-400" strokeWidth="1.2" />
                </>}
                
                {showSideTicks && <>
                    <line x1="26" y1="48" x2="34" y2="52" className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="1.5" />
                    <line x1="66" y1="52" x2="74" y2="48" className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="1.5" />
                </>}
    
                {showAngleTicks && <>
                     <path d="M 18,90 A 8 8 0 0 1 13.58,82.85" fill="none" className="stroke-green-500" strokeWidth="1.5" />
                     <path d="M 82,90 A 8 8 0 0 0 86.42,82.85" fill="none" className="stroke-green-500" strokeWidth="1.5" />
                </>}

                {showMedianFromB && <>
                    <line x1="10" y1="90" x2="70" y2="50" className="stroke-cyan-500 dark:stroke-cyan-400" strokeWidth="1" strokeDasharray="2,2" />
                    <line x1="59" y1="31" x2="61" y2="29" className="stroke-cyan-500 dark:stroke-cyan-400" strokeWidth="1.5" />
                    <line x1="79" y1="71" x2="81" y2="69" className="stroke-cyan-500 dark:stroke-cyan-400" strokeWidth="1.5" />
                    <text x="72" y="50" textAnchor="start" className="text-sm fill-current">E</text>
                </>}
                
                <text x="50" y="8" textAnchor="middle" className="text-sm fill-current">A</text>
                <text x="5" y="100" textAnchor="start" className="text-sm fill-current">B</text>
                <text x="95" y="100" textAnchor="end" className="text-sm fill-current">C</text>
                {(showAltitude || showMedian || showAngleBisector) &&
                    <text x="53" y="100" textAnchor="start" className="text-sm fill-current">D</text>}
            </svg>
        </div>
    );
};

const SelectionButton = ({ label, onClick, isSelected }: {label: string, onClick: () => void, isSelected: boolean}) => {
    const baseClasses = "w-full px-4 py-3 rounded-lg font-semibold text-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900";
    const selectedClasses = "bg-indigo-600 text-white shadow-lg scale-105";
    const unselectedClasses = "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600";
    return (
        <button onClick={onClick} className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`}>
            {label}
        </button>
    );
};

// Component to render Gemini's explanation with highlights and exponents
const ExplanationRenderer = ({ text }: { text: string }): React.ReactElement => {
    if (!text) return <></>;
    const parts = text.split(/(<em>.*?<\/em>|\S+\^\d+)/g).filter(part => part);

    const renderedContent = parts.map((part, index) => {
        if (part.startsWith('<em>') && part.endsWith('</em>')) {
            const content = part.substring(4, part.length - 5);
            return <strong key={index} className="bg-yellow-200 dark:bg-yellow-700 font-bold rounded px-1">{content}</strong>;
        }
        if (part.includes('^')) {
            return part.split(/(\^)/g).map((subPart, subIndex) => {
                if (subPart === '^') return null;
                if (parts[index].split(/(\^)/g)[subIndex - 1] === '^') {
                    return <sup key={`${index}-${subIndex}`}>{subPart}</sup>;
                }
                return subPart;
            });
        }
        return part;
    });

    return <div className="whitespace-pre-wrap leading-relaxed" dir="rtl">{renderedContent}</div>;
};


// --- Main Practice Engine Component ---

export default function PracticeEngine({ updateUser }: {updateUser: (scoreToAdd: number, exercisesToAdd: number, topic: string) => void}) {
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
    const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
    const [question, setQuestion] = useState(null);
    const [userAnswer, setUserAnswer] = useState('');
    
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
    const [attemptCount, setAttemptCount] = useState(0);
    const [hint, setHint] = useState<string | null>(null);
    const [showFinalAnswer, setShowFinalAnswer] = useState(false);

    const [explanation, setExplanation] = useState<string | null>(null);
    const [isFetchingExplanation, setIsFetchingExplanation] = useState(false);
    
    const [sessionScore, setSessionScore] = useState(0);
    const [sessionExercises, setSessionExercises] = useState(0);

    const handleTopicToggle = (topic: string) => {
        setSelectedTopics(prev => 
            prev.includes(topic) 
                ? prev.filter(t => t !== topic) 
                : [...prev, topic]
        );
    };

    const startPractice = () => {
        if (selectedTopics.length === 0 || !selectedDifficulty) return;
        
        const randomTopic = selectedTopics[Math.floor(Math.random() * selectedTopics.length)];
        setQuestion(generateExercise(randomTopic, selectedDifficulty));
        
        // Reset per-question state
        setUserAnswer('');
        setIsCorrect(null);
        setFeedbackMessage(null);
        setAttemptCount(0);
        setHint(null);
        setShowFinalAnswer(false);
        setExplanation(null);
        setIsFetchingExplanation(false);
    };
    
    const getHintForQuestion = (q: any) => {
        switch(q.topic) {
            case Topic.ORDER_OF_OPERATIONS: return "זכור את סדר הפעולות: סוגריים, כפל וחילוק, ואז חיבור וחיסור.";
            case Topic.DISTRIBUTIVE_PROPERTY: return "זכור את חוק הפילוג: כפול את הגורם שמחוץ לסוגריים בכל אחד מהגורמים שבפנים.";
            case Topic.SHORT_MULTIPLICATION:
                switch(q.formulaType) {
                    case '(a+b)^2': return "רמז: (a+b)² = a² + 2ab + b²";
                    case '(a-b)^2': return "רמז: (a-b)² = a² - 2ab + b²";
                    case '(a+b)(a-b)': return "רמז: (a+b)(a-b) = a² - b²";
                    default: return "זכור את נוסחאות הכפל המקוצר.";
                }
            case Topic.ISOSCELES_TRIANGLE:
                return "בדוק את התכונות של משולש שווה-שוקיים: שתי צלעות שוות, שתי זוויות בסיס שוות, או התלכדות של גובה, תיכון וחוצה זווית.";
            default: return null;
        }
    };

    const handleAnswerSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!userAnswer.trim()) return;

        const normalizedUserAnswer = userAnswer.replace(/\s/g, '');
        const normalizedCorrectAnswer = question.answer.replace(/\s/g, '');

        const correct = normalizedUserAnswer === normalizedCorrectAnswer;
        
        if (correct) {
            setIsCorrect(true);
            setFeedbackMessage(`נכון מאוד! זכית ב-${question.points} נקודות.`);
            setShowFinalAnswer(true);
            setSessionScore(prev => prev + question.points);
            setSessionExercises(prev => prev + 1);
            updateUser(question.points, 1, question.topic);
            return;
        }
        
        // Incorrect answer
        setIsCorrect(false);
        
        if (question.topic === Topic.ISOSCELES_TRIANGLE) {
            setFeedbackMessage('טעות. זו הייתה ההזדמנות היחידה שלך.');
            setShowFinalAnswer(true);
            setSessionExercises(prev => prev + 1);
            updateUser(0, 1, question.topic);
            fetchExplanation();
        } else {
            const newAttemptCount = attemptCount + 1;
            setAttemptCount(newAttemptCount);

            if (newAttemptCount >= 3) {
                setFeedbackMessage('זו הייתה ההזדמנות האחרונה שלך.');
                setShowFinalAnswer(true);
                setSessionExercises(prev => prev + 1);
                updateUser(0, 1, question.topic);
            } else {
                setHint(getHintForQuestion(question));
                setFeedbackMessage(`טעות... נסה שוב. נותרו לך ${3 - newAttemptCount} ניסיונות.`);
                setUserAnswer('');
            }
        }
    };

    const fetchExplanation = async () => {
        if (!question) return;
        setIsFetchingExplanation(true);
        setExplanation(null);
        try {
            const ai = new GoogleGenAI({ apiKey: "AIzaSyA3UIywHgeGTrJAcuVKqZqpfBO_N5Vf4ws" });
            const prompt = `
            הסבר בעברית, בצורה פשוטה, ויזואלית וידידותית, איך לפתור את התרגיל הבא:
            שאלה: ${question.expression}
            ${question.description ? `נתונים בשרטוט: ${question.description}` : ''}
            התשובה הנכונה: ${question.answer}

            הנחיות להסבר:
            1.  חלק את ההסבר לשלבים ברורים וממוספרים (שלב 1, שלב 2...).
            2.  בכל שלב, הסבר במילים מה הפעולה שאתה מבצע.
            3.  השתמש באימוג'ים רלוונטיים (למשל, 💡, 📐, ✅) כדי להפוך את ההסבר למושך.
            4.  כדי להדגיש את החלק הרלוונטי בתרגיל בכל שלב, עטוף אותו בתג <em>. לדוגמה: "נפשט את מה שבתוך ה <em>(5-2)</em> ונקבל 3".
            5.  השתמש בכתיב מתמטי תקין. לחזקות, השתמש בסימן '^' (למשל, x^2). אל תשתמש בכוכבית (*) לכפל אלא אם זה הכרחי.
            6.  שמור על שפה חיובית ומעודדת.
            `;
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            setExplanation(response.text);
        } catch (error) {
            console.error("Error fetching explanation from Gemini:", error);
            setExplanation("שגיאה בקבלת ההסבר. נסה שוב מאוחר יותר.");
        } finally {
            setIsFetchingExplanation(false);
        }
    };
    
    const handleNextQuestion = () => {
        startPractice();
    };

    const resetSession = () => {
        setSelectedTopics([]);
        setSelectedDifficulty(null);
        setQuestion(null);
        setSessionScore(0);
        setSessionExercises(0);
    }
    
    // UI for selection screen
    if (!question) {
        return (
            <div className="max-w-3xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg text-center">
                <h2 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">תרגול</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">בחר נושא אחד או יותר ורמת קושי כדי להתחיל.</p>
                
                <div className="space-y-8">
                    <div>
                        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">בחר נושאים:</h3>
                        <div className="space-y-6">
                            {TopicStructure.map(categoryInfo => (
                                <div key={categoryInfo.category}>
                                    <h4 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mb-3">{categoryInfo.icon} {categoryInfo.category}</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {categoryInfo.topics.map(topic => (
                                             <SelectionButton 
                                                key={topic} 
                                                label={topic} 
                                                onClick={() => handleTopicToggle(topic)} 
                                                isSelected={selectedTopics.includes(topic)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">בחר רמת קושי:</h3>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {Object.values(Difficulty).map(difficulty => (
                                <SelectionButton 
                                    key={difficulty} 
                                    label={difficulty} 
                                    onClick={() => setSelectedDifficulty(difficulty)} 
                                    isSelected={selectedDifficulty === difficulty}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <button
                    onClick={startPractice}
                    disabled={selectedTopics.length === 0 || !selectedDifficulty}
                    className="w-full mt-10 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white font-bold text-xl py-4 px-4 rounded-lg transition transform hover:scale-105"
                >
                    התחל לתרגל
                </button>
            </div>
        );
    }

    const feedbackClasses = isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-900/50' : 'border-red-500 bg-red-50 dark:bg-red-900/50';

    // UI for practice screen
    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <span className="text-sm font-semibold bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 py-1 px-3 rounded-full">{question.topic}</span>
                        <span className="text-sm font-semibold bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 py-1 px-3 rounded-full ml-2">{question.difficulty}</span>
                    </div>
                    <div className="text-right">
                        <div className="text-lg font-bold text-indigo-500">{sessionScore} נקודות</div>
                        <div className="text-sm text-gray-500">תרגיל {sessionExercises + 1}</div>
                    </div>
                </div>

                <div className="my-8 p-6 bg-gray-100 dark:bg-gray-700 rounded-lg text-center">
                    {question.drawingProps ? (
                        <>
                            <p className="text-xl text-gray-800 dark:text-gray-200 mb-4">{question.expression}</p>
                            <PracticeTriangleDrawing {...question.drawingProps} />
                        </>
                    ) : (
                        <>
                            <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">פתור את התרגיל הבא:</p>
                            <p dir="ltr" className="text-4xl font-mono tracking-wider text-gray-900 dark:text-white">{question.expression}</p>
                        </>
                    )}
                </div>
                
                <form onSubmit={handleAnswerSubmit}>
                    {question.answerFormat === AnswerFormat.TextInput ? (
                        <input
                            type="text"
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            disabled={showFinalAnswer}
                            placeholder="הקלד את תשובתך..."
                            dir="ltr"
                            className="w-full text-center px-4 py-3 bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-indigo-500 focus:ring-0 rounded-lg text-2xl font-mono text-gray-900 dark:text-gray-100 disabled:opacity-70"
                            autoComplete="off"
                        />
                    ) : (
                         <div className="grid grid-cols-2 gap-4">
                            {question.options.map((option: string, index: number) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => setUserAnswer(option)}
                                    disabled={showFinalAnswer}
                                    className={`p-4 rounded-lg text-2xl font-semibold transition-all
                                        ${userAnswer === option ? 'bg-indigo-500 text-white ring-2 ring-indigo-300' : 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500'}
                                        disabled:opacity-70 disabled:cursor-not-allowed
                                    `}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    )}

                    {!showFinalAnswer && (
                        <button
                            type="submit"
                            disabled={!userAnswer.trim()}
                            className="w-full mt-6 bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white font-bold text-lg py-3 px-4 rounded-lg transition"
                        >
                            {question.topic === Topic.ISOSCELES_TRIANGLE ? 'בדוק תשובה' : `בדוק תשובה (${3 - attemptCount} נסיונות)`}
                        </button>
                    )}
                </form>

                {feedbackMessage && (
                     <div className={`mt-6 p-4 rounded-lg border-r-4 ${feedbackClasses}`}>
                        <h4 className="text-xl font-bold">{feedbackMessage}</h4>
                        {showFinalAnswer && !isCorrect && <p className="mt-1">התשובה הנכונה היא: <strong dir="ltr" className="font-mono">{question.answer}</strong></p>}
                        {hint && <p className="mt-2 text-indigo-700 dark:text-indigo-300 font-semibold">{hint}</p>}
                    </div>
                )}
                 
                {showFinalAnswer && !isCorrect && (
                    <div className="mt-4">
                        {question.topic !== Topic.ISOSCELES_TRIANGLE && (
                            <button onClick={fetchExplanation} disabled={isFetchingExplanation} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition">
                                {isFetchingExplanation ? 'טוען הסבר...' : '🤔 בקש הסבר לפתרון'}
                            </button>
                        )}
                        
                        {isFetchingExplanation && (
                            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                <p>טוען הסבר...</p>
                            </div>
                        )}
                        {!isFetchingExplanation && explanation && (
                            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                <ExplanationRenderer text={explanation} />
                            </div>
                        )}
                    </div>
                )}
            </div>
            
            <div className="mt-6 flex gap-4">
                {showFinalAnswer && (
                    <button onClick={handleNextQuestion} className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg transition text-lg">
                        התרגיל הבא &larr;
                    </button>
                )}
                 <button onClick={resetSession} className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition text-lg">
                    סיים וחזור
                </button>
            </div>
        </div>
    );
}