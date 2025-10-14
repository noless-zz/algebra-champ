import React, { useState, useEffect, useRef } from 'react';
import { Topic } from '../types.ts';

// --- Reusable Helper Components ---

/**
 * A styled box for displaying formulas and examples.
 */
const FormulaBox = ({ title, children, explanation, ltr = false }: { title: string; children: React.ReactNode; explanation?: string; ltr?: boolean; }) => (
    <div className="bg-indigo-50 dark:bg-indigo-900/50 border-r-4 border-indigo-500 p-6 rounded-lg mb-6">
        <h3 className="text-xl font-semibold text-indigo-800 dark:text-indigo-200">{title}</h3>
        <div dir={ltr ? "ltr" : "rtl"} className="my-4 p-4 bg-white dark:bg-gray-800 rounded-md text-center shadow-inner min-h-[60px] flex items-center justify-center text-2xl font-mono tracking-wider">
            {children}
        </div>
        {explanation && <p className="text-indigo-700 dark:text-indigo-300">{explanation}</p>}
    </div>
);

/**
 * A card for selecting a topic.
 */
const TopicCard = ({ icon, title, onClick }) => (
    <button onClick={onClick} className="w-full bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex flex-col items-center gap-4 text-center transition-transform transform hover:-translate-y-2 hover:shadow-xl">
        {icon}
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
            default:
                return null;
        }
    };
    
    if (selectedTopic) {
        return (
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg max-w-4xl mx-auto">
                <button onClick={() => setSelectedTopic(null)} className="mb-6 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 font-bold py-2 px-4 rounded-lg">
                    &rarr; חזרה למרכז הלמידה
                </button>
                {renderTopicContent()}
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-4 text-gray-900 dark:text-white">מרכז הלמידה</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 text-center mb-10">
                בחר נושא כדי להתחיל ללמוד, לרענן את הזיכרון, או לחזור על חומר שלא הבנת.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <TopicCard 
                    title={Topic.ORDER_OF_OPERATIONS} 
                    onClick={() => setSelectedTopic(Topic.ORDER_OF_OPERATIONS)}
                    icon={<div className="text-5xl">🔢</div>}
                />
                <TopicCard 
                    title={Topic.DISTRIBUTIVE_PROPERTY} 
                    onClick={() => setSelectedTopic(Topic.DISTRIBUTIVE_PROPERTY)}
                    icon={<div className="text-5xl">↔️</div>}
                />
                <TopicCard 
                    title={Topic.SHORT_MULTIPLICATION} 
                    onClick={() => setSelectedTopic(Topic.SHORT_MULTIPLICATION)}
                    icon={<div className="text-5xl">⚡️</div>}
                />
            </div>
        </div>
    );
}