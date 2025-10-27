import React, { useState, useEffect, useRef } from 'react';
import { Topic, TopicStructure } from '../types.ts';

// --- Reusable Helper Components ---

/**
 * A styled box for displaying formulas and examples.
 */
const FormulaBox = ({ title, children, explanation, ltr = false }: { title: string; children: React.ReactNode; explanation?: string; ltr?: boolean; }) => (
    <div className="bg-indigo-50 dark:bg-indigo-900/50 border-r-4 border-indigo-500 p-6 rounded-lg mb-6">
        <h3 className="text-xl font-semibold text-indigo-800 dark:text-indigo-200">{title}</h3>
        <div dir={ltr ? "ltr" : "rtl"} className="my-4 p-4 bg-white dark:bg-gray-800 rounded-md text-center shadow-inner min-h-[60px] flex items-center justify-center text-xl sm:text-2xl font-mono tracking-wider">
            {children}
        </div>
        {explanation && <p className="text-indigo-700 dark:text-indigo-300">{explanation}</p>}
    </div>
);

/**
 * A card for selecting a topic or category.
 */
const SelectionCard = ({ icon, title, onClick }) => (
    <button onClick={onClick} className="w-full bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex flex-col items-center gap-4 text-center transition-transform transform hover:-translate-y-2 hover:shadow-xl">
        <div className="text-5xl">{icon}</div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
    </button>
);


// --- Content Components for Each Topic ---

const OrderOfOperations = () => (
    <div>
        <h3 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">🔢 סדר פעולות חשבון</h3>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            כדי למנוע בלבול ולקבל תמיד את התשובה הנכונה, פותרים תרגילים לפי סדר קבוע. חשבו על זה כמו מתכון - הסדר חשוב!
        </p>
        <div className="space-y-4 text-lg">
            <div className="flex items-start gap-4 p-4 bg-blue-50 dark:bg-blue-900/50 rounded-lg">
                <div className="text-2xl font-bold text-blue-500">1.</div>
                <div>
                    <h4 className="font-bold text-xl text-blue-600 dark:text-blue-400">סוגריים ( )</h4>
                    <p className="mt-1 text-gray-700 dark:text-gray-300">תמיד מתחילים מהחישוב שבתוך הסוגריים. אם יש כמה זוגות, מתחילים מהפנימיים ביותר.</p>
                </div>
            </div>
             <div className="flex items-start gap-4 p-4 bg-green-50 dark:bg-green-900/50 rounded-lg">
                <div className="text-2xl font-bold text-green-500">2.</div>
                <div>
                    <h4 className="font-bold text-xl text-green-600 dark:text-green-400">כפל וחילוק × ÷</h4>
                    <p className="mt-1 text-gray-700 dark:text-gray-300">לאחר הסוגריים, מבצעים את כל פעולות הכפל והחילוק, לפי סדר הופעתן משמאל לימין.</p>
                </div>
            </div>
             <div className="flex items-start gap-4 p-4 bg-orange-50 dark:bg-orange-900/50 rounded-lg">
                <div className="text-2xl font-bold text-orange-500">3.</div>
                <div>
                    <h4 className="font-bold text-xl text-orange-600 dark:text-orange-400">חיבור וחיסור + -</h4>
                    <p className="mt-1 text-gray-700 dark:text-gray-300">בסוף, מבצעים את כל פעולות החיבור והחיסור, גם כן משמאל לימין.</p>
                </div>
            </div>
        </div>
        <div className="mt-8 p-6 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <h4 className="text-xl font-semibold mb-3">דוגמה ויזואלית:</h4>
            <div dir="ltr" className="font-mono text-xl text-center space-y-3 p-4 bg-white dark:bg-gray-800 rounded-md">
                <p>5 + ( 3 * ( <span className="bg-yellow-200 dark:bg-yellow-800 rounded px-1">6 - 2</span> ) ) / 4</p>
                <p className="text-indigo-500 text-2xl font-sans">↓</p>
                <p>5 + ( <span className="bg-green-200 dark:bg-green-800 rounded px-1">3 * 4</span> ) / 4</p>
                 <p className="text-indigo-500 text-2xl font-sans">↓</p>
                <p>5 + <span className="bg-blue-200 dark:bg-blue-800 rounded px-1">12 / 4</span></p>
                 <p className="text-indigo-500 text-2xl font-sans">↓</p>
                <p><span className="bg-orange-200 dark:bg-orange-800 rounded px-1">5 + 3</span></p>
                 <p className="text-indigo-500 text-2xl font-sans">↓</p>
                <p className="font-bold text-2xl text-indigo-600 dark:text-indigo-400">8</p>
            </div>
        </div>
    </div>
);

const DistributiveProperty = () => (
    <div>
        <h3 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">↔️ חוק הפילוג</h3>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            חוק הפילוג עוזר לנו "לפתוח סוגריים" בצורה מסודרת. דמיינו שאתם מחלקים משהו לכל אחד בקבוצה - צריך לוודא שאף אחד לא נשכח!
        </p>
        
        <h4 className="text-2xl font-semibold mt-8 mb-4">פילוג פשוט: כופלים את הגורם שבחוץ בכל גורם שבפנים</h4>
        <FormulaBox title="הכלל" ltr={true} explanation="הגורם a 'מחולק' גם ל-b וגם ל-c.">
             <span>
                <span className="text-red-500">a</span>
                (<span className="text-blue-500">b</span>+<span className="text-green-500">c</span>) = 
                <span className="text-red-500">a</span><span className="text-blue-500">b</span> + <span className="text-red-500">a</span><span className="text-green-500">c</span>
             </span>
        </FormulaBox>
        <FormulaBox title="דוגמה" ltr={true}>
             <span>
                <span className="text-red-500">5</span>
                (<span className="text-blue-500">x</span>+<span className="text-green-500">2</span>) = 
                <span className="text-red-500">5</span><span className="text-blue-500">x</span> + <span className="text-red-500">5</span>*<span className="text-green-500">2</span> = 5x+10
            </span>
        </FormulaBox>
        
        <h4 className="text-2xl font-semibold mt-10 mb-4">פילוג מורחב: כל אחד מהראשון כפול כל אחד מהשני</h4>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
            כאן, כל איבר בסוגריים הראשונים צריך "ללחוץ יד" (להיכפל) עם כל איבר בסוגריים השניים.
        </p>
         <FormulaBox title="הכלל" ltr={true} explanation="ארבע פעולות כפל בסך הכל!">
            <span>
                (<span className="text-red-500">a</span>+<span className="text-orange-500">b</span>)
                (<span className="text-blue-500">c</span>+<span className="text-green-500">d</span>) = 
                <span className="text-red-500">a</span><span className="text-blue-500">c</span> + 
                <span className="text-red-500">a</span><span className="text-green-500">d</span> + 
                <span className="text-orange-500">b</span><span className="text-blue-500">c</span> + 
                <span className="text-orange-500">b</span><span className="text-green-500">d</span>
            </span>
        </FormulaBox>
        <FormulaBox title="דוגמה" ltr={true}>
            <span>
                (<span className="text-red-500">x</span>+<span className="text-orange-500">3</span>)
                (<span className="text-blue-500">y</span>+<span className="text-green-500">4</span>) = 
                <span className="text-red-500">x</span><span className="text-blue-500">y</span>+
                <span className="text-green-500">4</span><span className="text-red-500">x</span>+
                <span className="text-orange-500">3</span><span className="text-blue-500">y</span>+
                <span className="text-purple-500">12</span>
            </span>
        </FormulaBox>
    </div>
);

const ShortMultiplication = () => (
    <div>
        <h3 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">⚡️ נוסחאות הכפל המקוצר</h3>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            אלו הם "קיצורי דרך" למקרים מיוחדים של חוק הפילוג. הכרת הנוסחאות האלה חוסכת זמן ומונעת טעויות חישוב.
        </p>
        
        <h4 className="text-2xl font-semibold mt-8 mb-4">1. ריבוע של סכום</h4>
        <FormulaBox title="הנוסחה" ltr={true} explanation="האיבר הראשון בריבוע, ועוד פעמיים מכפלת האיברים, ועוד האיבר השני בריבוע.">
            <span>
                (<span className="text-blue-500">a</span> + <span className="text-green-500">b</span>)<sup>2</sup> = <span className="text-blue-500">a</span><sup>2</sup> + 2<span className="text-blue-500">a</span><span className="text-green-500">b</span> + <span className="text-green-500">b</span><sup>2</sup>
            </span>
        </FormulaBox>
        <FormulaBox title="דוגמה" ltr={true}>
            <span>
                (<span className="text-blue-500">x</span> + <span className="text-green-500">3</span>)<sup>2</sup> = <span className="text-blue-500">x</span><sup>2</sup> + 2*<span className="text-blue-500">x</span>*<span className="text-green-500">3</span> + <span className="text-green-500">3</span><sup>2</sup> = x<sup>2</sup> + 6x + 9
            </span>
        </FormulaBox>

        <h4 className="text-2xl font-semibold mt-10 mb-4">2. ריבוע של הפרש</h4>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
           שימו לב שההבדל היחיד מהנוסחה הקודמת הוא סימן המינוס באיבר האמצעי.
        </p>
        <FormulaBox title="הנוסחה" ltr={true}>
            <span>
                (<span className="text-blue-500">a</span> - <span className="text-green-500">b</span>)<sup>2</sup> = <span className="text-blue-500">a</span><sup>2</sup> - 2<span className="text-blue-500">a</span><span className="text-green-500">b</span> + <span className="text-green-500">b</span><sup>2</sup>
            </span>
        </FormulaBox>
        <FormulaBox title="דוגמה" ltr={true}>
             <span>
                (<span className="text-blue-500">y</span> - <span className="text-green-500">5</span>)<sup>2</sup> = <span className="text-blue-500">y</span><sup>2</sup> - 2*<span className="text-blue-500">y</span>*<span className="text-green-500">5</span> + <span className="text-green-500">5</span><sup>2</sup> = y<sup>2</sup> - 10y + 25
            </span>
        </FormulaBox>

        <h4 className="text-2xl font-semibold mt-10 mb-4">3. הפרש ריבועים</h4>
         <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
            זו נוסחה סופר-שימושית! כשכופלים סכום בהפרש של אותם שני איברים, האיבר האמצעי מתבטל.
        </p>
        <FormulaBox title="הנוסחה" ltr={true} explanation="התוצאה היא פשוט ריבוע האיבר הראשון פחות ריבוע האיבר השני.">
            <span>
                (<span className="text-blue-500">a</span> + <span className="text-green-500">b</span>)(<span className="text-blue-500">a</span> - <span className="text-green-500">b</span>) = <span className="text-blue-500">a</span><sup>2</sup> - <span className="text-green-500">b</span><sup>2</sup>
            </span>
        </FormulaBox>
         <FormulaBox title="דוגמה" ltr={true}>
            <span>
                (<span className="text-blue-500">x</span> + <span className="text-green-500">7</span>)(<span className="text-blue-500">x</span> - <span className="text-green-500">7</span>) = <span className="text-blue-500">x</span><sup>2</sup> - <span className="text-green-500">7</span><sup>2</sup> = x<sup>2</sup> - 49
            </span>
        </FormulaBox>
    </div>
);


const TriangleDiagram = ({ children, width=200, height=170 }) => (
    <svg viewBox="0 0 200 170" className="mx-auto my-4 text-gray-800 dark:text-gray-200" width={width} height={height}>
        {/* Triangle base */}
        <polygon points="100,20 180,150 20,150" className="fill-indigo-100 dark:fill-indigo-900/50 stroke-indigo-500 stroke-2" />
        {/* Labels */}
        <text x="96" y="15" className="font-bold text-lg fill-current">A</text>
        <text x="10" y="165" className="font-bold text-lg fill-current">B</text>
        <text x="183" y="165" className="font-bold text-lg fill-current">C</text>
        {children}
    </svg>
);

const IsoscelesTriangleContent = () => (
    <div>
        <h3 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">📐 משולש שווה-שוקיים</h3>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
            <strong>הגדרה:</strong> משולש שבו שתי צלעות שוות זו לזו נקרא משולש שווה-שוקיים.
        </p>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            הצלעות השוות נקראות <strong className="font-bold text-indigo-600 dark:text-indigo-400">שוקיים</strong>, והצלע השלישית נקראת <strong className="font-bold text-indigo-600 dark:text-indigo-400">בסיס</strong>. הזווית שמול הבסיס נקראת <strong className="font-bold text-indigo-600 dark:text-indigo-400">זווית הראש</strong>.
        </p>
        <TriangleDiagram>
            <line x1="55" y1="75" x2="65" y2="95" className="stroke-current stroke-2" transform="rotate(-35 60 85)" />
            <line x1="135" y1="95" x2="145" y2="75" className="stroke-current stroke-2" transform="rotate(35 140 85)" />
            <text x="25" y="90" className="fill-current text-sm">שוק</text>
            <text x="175" y="90" className="fill-current text-sm">שוק</text>
            <text x="90" y="165" className="fill-current text-sm">בסיס</text>
        </TriangleDiagram>
        
        <h4 className="text-2xl font-semibold mt-8 mb-4">תכונה 1: זוויות הבסיס שוות</h4>
        <FormulaBox title="משפט">
            <>
                במשולש שווה-שוקיים, <strong className="text-indigo-700 dark:text-indigo-300">זוויות הבסיס</strong> (הזוויות שמול השוקיים השוות) <strong className="text-indigo-700 dark:text-indigo-300">שוות זו לזו</strong>.
                <TriangleDiagram>
                    <line x1="55" y1="75" x2="65" y2="95" className="stroke-current stroke-2" transform="rotate(-35 60 85)" />
                    <line x1="135" y1="95" x2="145" y2="75" className="stroke-current stroke-2" transform="rotate(35 140 85)" />
                    <path d="M 45 150 A 25 25 0 0 1 33 129" className="stroke-blue-500 fill-none stroke-2" />
                    <path d="M 155 150 A 25 25 0 0 0 167 129" className="stroke-blue-500 fill-none stroke-2" />
                    <text x="40" y="135" className="fill-blue-500 font-bold">∠B</text>
                    <text x="145" y="135" className="fill-blue-500 font-bold">∠C</text>
                </TriangleDiagram>
                <div className="text-center font-mono text-lg space-y-1 mt-4" dir="ltr">
                    <p><span className="font-sans text-gray-600 dark:text-gray-400">אם:</span> AB = AC</p>
                    <p className="font-sans text-2xl transform rotate-90 text-gray-500 dark:text-gray-400">⇓</p>
                    <p><span className="font-sans text-gray-600 dark:text-gray-400">אז:</span> ∠B = ∠C</p>
                </div>
            </>
        </FormulaBox>
        
        <h4 className="text-2xl font-semibold mt-10 mb-4">תכונה 2: הקו המיוחד מקודקוד הראש</h4>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            במשולש שווה-שוקיים, הקו היורד מקודקוד הראש אל הבסיס הוא "קו פלא": הוא גם גובה, גם תיכון וגם חוצה-זווית. אנו אומרים ששלושת הקווים האלה <strong>מתלכדים</strong> לקו אחד.
        </p>
        <FormulaBox title="משפט">
            <>
                במשולש שווה-שוקיים, חוצה זווית הראש מתלכד עם התיכון לבסיס ועם הגובה לבסיס.
                <TriangleDiagram>
                    <line x1="100" y1="20" x2="100" y2="150" className="stroke-red-500 stroke-2" />
                    <text x="105" y="165" className="font-bold text-lg fill-current">D</text>
                    {/* Angle bisector marks - BLUE */}
                    <path d="M 100 20 A 20 20 0 0 1 115 35" className="stroke-blue-500 fill-none" />
                    <path d="M 100 20 A 20 20 0 0 0 85 35" className="stroke-blue-500 fill-none" />
                    {/* Median marks - GREEN */}
                    <line x1="58" y1="155" x2="62" y2="145" className="stroke-green-500 stroke-2" />
                    <line x1="138" y1="145" x2="142" y2="155" className="stroke-green-500 stroke-2" />
                    {/* Altitude mark - ORANGE */}
                    <rect x="90" y="140" width="10" height="10" className="stroke-orange-500 fill-none stroke-2" />
                </TriangleDiagram>
                <ul className="list-none pr-0 mt-4 space-y-3 text-right">
                    <li><strong className="text-blue-600 dark:text-blue-400">חוצה זווית:</strong> AD חוצה את ∠BAC</li>
                    <li><strong className="text-green-600 dark:text-green-400">תיכון:</strong> AD חוצה את הבסיס BC (כלומר BD = DC)</li>
                    <li><strong className="text-orange-600 dark:text-orange-400">גובה:</strong> AD מאונך לבסיס BC (כלומר ∠ADB = 90°)</li>
                </ul>
            </>
        </FormulaBox>

        <h4 className="text-2xl font-semibold mt-10 mb-4">מסקנה חשובה (המשפטים ההפוכים)</h4>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
           המשפטים עובדים גם בכיוון ההפוך! הם מאפשרים לנו להוכיח שמשולש הוא שווה-שוקיים.
        </p>
        <div className="p-6 bg-green-50 dark:bg-green-900/50 rounded-lg border-r-4 border-green-500">
            <h5 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-3">תנאים להוכחת משולש שווה-שוקיים</h5>
            <p className="text-green-700 dark:text-green-300">
                אם במשולש, אחד מהתנאים הבאים מתקיים, אז המשולש הוא שווה-שוקיים:
            </p>
            <ul className="list-disc pr-6 mt-3 space-y-2 text-green-700 dark:text-green-300">
                <li>התיכון לצלע הוא גם הגובה לאותה צלע.</li>
                <li>התיכון לצלע הוא גם חוצה זווית הראש.</li>
                <li>הגובה לצלע הוא גם חוצה זווית הראש.</li>
                <li>שתי זוויות במשולש שוות זו לזו (המשפט ההפוך למשפט זוויות הבסיס).</li>
            </ul>
            <p className="mt-4 font-semibold text-green-800 dark:text-green-200">
                בקיצור: אם שניים מהקווים המיוחדים (תיכון, גובה, חוצה זווית) מתלכדים, המשולש שווה-שוקיים.
            </p>
        </div>
    </div>
);


export default function LearnSection() {
    const [selectedTopic, setSelectedTopic] = useState(null);

    const renderTopicContent = () => {
        switch (selectedTopic) {
            case Topic.ORDER_OF_OPERATIONS:
                return <OrderOfOperations />;
            case Topic.DISTRIBUTIVE_PROPERTY:
                return <DistributiveProperty />;
            case Topic.SHORT_MULTIPLICATION:
                return <ShortMultiplication />;
            case Topic.ISOSCELES_TRIANGLE:
                return <IsoscelesTriangleContent />;
            default:
                return null;
        }
    };
    
    if (selectedTopic) {
        return (
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg max-w-4xl mx-auto">
                <button onClick={() => setSelectedTopic(null)} className="mb-6 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 font-bold py-2 px-4 rounded-lg">
                    &rarr; חזרה לרשימת הנושאים
                </button>
                {renderTopicContent()}
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center">
                <h2 className="text-4xl font-bold text-center mb-4 text-gray-900 dark:text-white">מרכז הלמידה</h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                    בחר נושא כדי להתחיל ללמוד.
                </p>
            </div>
            
            {TopicStructure.map(categoryInfo => (
                 <div key={categoryInfo.category}>
                    <h3 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-4">
                        <span className="text-4xl">{categoryInfo.icon}</span>
                        {categoryInfo.category}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                         {categoryInfo.topics.map(topic => (
                             <SelectionCard 
                                key={topic}
                                title={topic} 
                                onClick={() => setSelectedTopic(topic)}
                                icon={
                                    topic === Topic.ORDER_OF_OPERATIONS ? '🔢' :
                                    topic === Topic.DISTRIBUTIVE_PROPERTY ? '↔️' :
                                    topic === Topic.SHORT_MULTIPLICATION ? '⚡️' :
                                    '🔺'
                                }
                            />
                         ))}
                    </div>
                </div>
             ))}
        </div>
    );
}