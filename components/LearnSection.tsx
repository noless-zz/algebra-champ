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

const TriangleDrawing = ({
    showAltitude = false,
    showMedian = false,
    showAngleBisector = false,
    showSideTicks = false,
    showAngleTicks = false,
    labelA = 'A',
    labelB = 'B',
    labelC = 'C',
    labelD = 'D',
}) => {
    return (
        <svg viewBox="0 0 100 100" className="w-48 h-48 mx-auto">
            {/* Triangle */}
            <polygon points="50,10 10,90 90,90" className="fill-blue-100 dark:fill-blue-900/50 stroke-blue-500 dark:stroke-blue-400" strokeWidth="1" />

            {/* Special Line AD */}
            {(showAltitude || showMedian || showAngleBisector) &&
                <line x1="50" y1="10" x2="50" y2="90" className="stroke-red-500 dark:stroke-red-400" strokeWidth="1" strokeDasharray="2,2" />
            }
            
            {/* Altitude symbol */}
            {showAltitude &&
                <polygon points="50,90 50,85 55,85 55,90" className="fill-none stroke-orange-500 dark:stroke-orange-400" strokeWidth="1" />
            }

            {/* Median symbol */}
            {showMedian &&
                <>
                    <line x1="30" y1="88" x2="30" y2="92" className="stroke-green-500 dark:stroke-green-400" strokeWidth="1.5" />
                    <line x1="70" y1="88" x2="70" y2="92" className="stroke-green-500 dark:stroke-green-400" strokeWidth="1.5" />
                </>
            }

            {/* Angle Bisector symbol */}
            {showAngleBisector &&
                <>
                    <path d="M47,19 A 10 10 0 0 1 50,16" fill="none" className="stroke-purple-500 dark:stroke-purple-400" strokeWidth="1" />
                    <path d="M50,16 A 10 10 0 0 1 53,19" fill="none" className="stroke-purple-500 dark:stroke-purple-400" strokeWidth="1" />
                </>
            }
            
             {/* Side ticks for Isosceles */}
            {showSideTicks &&
                <>
                    <line x1="28" y1="49" x2="32" y2="51" className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="1.5" />
                    <line x1="68" y1="51" x2="72" y2="49" className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="1.5" />
                </>
            }

            {/* Angle ticks for Isosceles */}
            {showAngleTicks &&
                <>
                     <path d="M 18,90 A 8 8 0 0 1 13.58,82.85" fill="none" className="stroke-green-500" strokeWidth="1.5" />
                     <path d="M 82,90 A 8 8 0 0 0 86.42,82.85" fill="none" className="stroke-green-500" strokeWidth="1.5" />
                </>
            }
            
            {/* Labels */}
            <text x="50" y="8" textAnchor="middle" className="text-sm fill-current">{labelA}</text>
            <text x="5" y="95" textAnchor="start" className="text-sm fill-current">{labelB}</text>
            <text x="95" y="95" textAnchor="end" className="text-sm fill-current">{labelC}</text>
            {(showAltitude || showMedian || showAngleBisector) &&
                <text x="53" y="95" textAnchor="start" className="text-sm fill-current">{labelD}</text>
            }
        </svg>
    )
};

const TheoremBox = ({ title, children, drawing, formula }: { title: string; children: React.ReactNode; drawing: React.ReactNode; formula: React.ReactNode; }) => (
    <div className="bg-gray-50 dark:bg-gray-800/50 border-r-4 border-gray-400 p-6 rounded-lg mb-8">
        <h4 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">{title}</h4>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">{children}</p>
        <div className="my-4 flex justify-center">{drawing}</div>
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-md shadow-inner">
            {formula}
        </div>
    </div>
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

const IsoscelesTriangle = () => (
    <div>
        <h3 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">📐 משולש שווה-שוקיים</h3>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            משולש שווה-שוקיים הוא משולש שיש לו שתי צלעות שוות באורכן. הצלעות השוות נקראות "שוקיים", והצלע השלישית נקראת "בסיס".
        </p>

        <div className="bg-indigo-50 dark:bg-indigo-900/50 border-r-4 border-indigo-500 p-6 rounded-lg mb-6">
            <h3 className="text-xl font-semibold text-indigo-800 dark:text-indigo-200 mb-4">תכונה 1: זוויות הבסיס שוות</h3>
            <p className="text-lg text-indigo-700 dark:text-indigo-300 mb-4">במשולש שווה-שוקיים, הזוויות שמול השוקיים השוות - זוויות הבסיס - שוות זו לזו.</p>
            <div className="my-4 flex justify-center">
                <TriangleDrawing showSideTicks={true} showAngleTicks={true} />
            </div>
            <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-md text-center shadow-inner">
                <p className="font-mono text-xl">אם <span className="text-blue-500">AB</span> = <span className="text-blue-500">AC</span>, אז <span className="text-green-500">∠B</span> = <span className="text-green-500">∠C</span></p>
            </div>
        </div>
        
        <h3 className="text-3xl font-bold mt-12 mb-4 text-gray-800 dark:text-gray-100">מושגי יסוד במשולש</h3>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            לפני שנלמד איך להוכיח שמשולש הוא שווה-שוקיים, בואו נרענן כמה מושגים חשובים שתקפים לכל משולש.
        </p>

        <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="bg-indigo-50 dark:bg-indigo-900/50 p-4 rounded-lg">
                <h4 className="text-xl font-semibold text-indigo-800 dark:text-indigo-200 mb-2">גובה</h4>
                <TriangleDrawing showAltitude={true} />
                <p className="text-base mt-2">קטע היוצא מקודקוד ומאונך לצלע שמולו.</p>
            </div>
            <div className="bg-indigo-50 dark:bg-indigo-900/50 p-4 rounded-lg">
                <h4 className="text-xl font-semibold text-indigo-800 dark:text-indigo-200 mb-2">תיכון</h4>
                <TriangleDrawing showMedian={true} />
                <p className="text-base mt-2">קטע המחבר קודקוד עם אמצע הצלע שמולו.</p>
            </div>
            <div className="bg-indigo-50 dark:bg-indigo-900/50 p-4 rounded-lg">
                <h4 className="text-xl font-semibold text-indigo-800 dark:text-indigo-200 mb-2">חוצה זווית</h4>
                <TriangleDrawing showAngleBisector={true} />
                <p className="text-base mt-2">קטע המחלק את זווית הקודקוד לשתי זוויות שוות.</p>
            </div>
        </div>

        <h3 className="text-3xl font-bold mt-12 mb-4 text-gray-800 dark:text-gray-100">איך מוכיחים שמשולש הוא שווה-שוקיים?</h3>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
            כדי להוכיח שמשולש הוא שווה-שוקיים, לא תמיד צריך למדוד את הצלעות. מספיק להראות שאחד מהקווים המיוחדים (גובה, תיכון, חוצה זווית) הוא גם קו מיוחד נוסף. אם שניים מהם "מתלכדים" לקו אחד, המשולש חייב להיות שווה-שוקיים!
        </p>

        <TheoremBox
            title="משפט 1: חוצה זווית שהוא גם תיכון"
            drawing={<TriangleDrawing showAngleBisector={true} showMedian={true} />}
            formula={
                <div className="text-center text-lg space-y-2">
                    <p><span className="font-bold">תנאי א':</span> <span className="text-red-500 font-mono">AD</span> הוא <span className="text-purple-500">חוצה זווית</span> (<span dir="ltr" className="font-mono inline-block">∠BAD = ∠CAD</span>)</p>
                    <p><span className="font-bold">תנאי ב':</span> <span className="text-red-500 font-mono">AD</span> הוא גם <span className="text-green-500">תיכון</span> (<span dir="ltr" className="font-mono inline-block">BD = CD</span>)</p>
                    <p className="text-2xl my-1">&darr;</p>
                    <p><span className="font-bold">מסקנה:</span> המשולש שווה-שוקיים (<span className="text-blue-500 font-mono" dir="ltr">AB = AC</span>)</p>
                </div>
            }
        >
            אם במשולש, הקו שמחלק את זווית הראש לשניים (חוצה זווית) הוא גם הקו שמגיע בדיוק לאמצע הבסיס (תיכון), אז המשולש הוא שווה-שוקיים.
        </TheoremBox>

        <TheoremBox
            title="משפט 2: חוצה זווית שהוא גם גובה"
            drawing={<TriangleDrawing showAngleBisector={true} showAltitude={true} />}
            formula={
                 <div className="text-center text-lg space-y-2">
                    <p><span className="font-bold">תנאי א':</span> <span className="text-red-500 font-mono">AD</span> הוא <span className="text-purple-500">חוצה זווית</span> (<span dir="ltr" className="font-mono inline-block">∠BAD = ∠CAD</span>)</p>
                    <p><span className="font-bold">תנאי ב':</span> <span className="text-red-500 font-mono">AD</span> הוא גם <span className="text-orange-500">גובה</span> (<span dir="ltr" className="font-mono inline-block">∠ADB = 90°</span>)</p>
                    <p className="text-2xl my-1">&darr;</p>
                    <p><span className="font-bold">מסקנה:</span> המשולש שווה-שוקיים (<span className="text-blue-500 font-mono" dir="ltr">AB = AC</span>)</p>
                </div>
            }
        >
            אם במשולש, הקו שמחלק את זווית הראש לשניים (חוצה זווית) הוא גם הקו שיוצר זווית ישרה עם הבסיס (גובה), אז המשולש הוא שווה-שוקיים.
        </TheoremBox>

        <TheoremBox
            title="משפט 3: תיכון שהוא גם גובה"
            drawing={<TriangleDrawing showMedian={true} showAltitude={true} />}
            formula={
                 <div className="text-center text-lg space-y-2">
                    <p><span className="font-bold">תנאי א':</span> <span className="text-red-500 font-mono">AD</span> הוא <span className="text-green-500">תיכון</span> (<span dir="ltr" className="font-mono inline-block">BD = CD</span>)</p>
                    <p><span className="font-bold">תנאי ב':</span> <span className="text-red-500 font-mono">AD</span> הוא גם <span className="text-orange-500">גובה</span> (<span dir="ltr" className="font-mono inline-block">∠ADB = 90°</span>)</p>
                    <p className="text-2xl my-1">&darr;</p>
                    <p><span className="font-bold">מסקנה:</span> המשולש שווה-שוקיים (<span className="text-blue-500 font-mono" dir="ltr">AB = AC</span>)</p>
                </div>
            }
        >
             אם במשולש, הקו שמגיע לאמצע הבסיס (תיכון) הוא גם הקו שמאונך לבסיס (גובה), אז המשולש הוא שווה-שוקיים.
        </TheoremBox>

    </div>
);

export default function LearnSection() {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const contentRef = useRef(null);

    useEffect(() => {
        if (selectedTopic && contentRef.current) {
            contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [selectedTopic]);

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setSelectedTopic(null); // Reset topic when category changes
    };

    const handleTopicSelect = (topic) => {
        setSelectedTopic(topic);
    };

    const resetSelection = () => {
        setSelectedCategory(null);
        setSelectedTopic(null);
    };

    const renderContent = () => {
        if (!selectedTopic) return null;

        switch(selectedTopic) {
            case Topic.ORDER_OF_OPERATIONS: return <OrderOfOperations />;
            case Topic.DISTRIBUTIVE_PROPERTY: return <DistributiveProperty />;
            case Topic.SHORT_MULTIPLICATION: return <ShortMultiplication />;
            case Topic.ISOSCELES_TRIANGLE: return <IsoscelesTriangle />;
            default: return <p>בחר נושא להתחיל.</p>;
        }
    };
    
    const currentTopics = selectedCategory ? TopicStructure.find(c => c.category === selectedCategory.category)?.topics : [];

    if (!selectedCategory) {
        return (
            <div className="max-w-4xl mx-auto text-center">
                 <h2 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">מרכז למידה</h2>
                 <p className="text-lg text-gray-600 dark:text-gray-400 mb-10">בחר קטגוריה כדי להתחיל ללמוד.</p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {TopicStructure.map(categoryInfo => (
                        <SelectionCard 
                            key={categoryInfo.category}
                            icon={categoryInfo.icon}
                            title={categoryInfo.category}
                            onClick={() => handleCategorySelect(categoryInfo)}
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div>
            <button onClick={resetSelection} className="mb-6 text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">
                &larr; חזרה לבחירת קטגוריה
            </button>
            <div className="text-center mb-10">
                <h2 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">{selectedCategory.icon} {selectedCategory.category}</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">בחר נושא כדי לראות את חומרי הלימוד.</p>
            </div>
            <div className="flex flex-col md:flex-row gap-8 items-start">
                <nav className="md:w-1/4 space-y-2 md:sticky md:top-8">
                    {currentTopics.map(topic => (
                        <button 
                            key={topic} 
                            onClick={() => handleTopicSelect(topic)}
                            className={`w-full text-right p-3 rounded-lg transition-colors text-lg ${selectedTopic === topic ? 'bg-indigo-600 text-white font-bold' : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        >
                            {topic}
                        </button>
                    ))}
                </nav>
                <div ref={contentRef} className="md:w-3/4 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg min-h-[400px]">
                   {selectedTopic ? renderContent() : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-xl text-gray-500">בחר נושא מהתפריט כדי להתחיל.</p>
                        </div>
                   )}
                </div>
            </div>
        </div>
    );
}