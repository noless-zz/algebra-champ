
import React, { useState } from 'react';
import { Topic } from '../types';

const AreaModelVisualizer = () => {
    const [a, setA] = useState(3);
    const [b, setB] = useState(5);
    const [c, setC] = useState(2);
    
    const width = 300;
    const height = 150;
    const cWidth = (c / (b + c)) * width;
    const bWidth = (b / (b + c)) * width;

    return (
        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
            <h4 className="font-bold mb-2 text-lg">ויזואליזציה אינטראקטיבית: מודל השטח</h4>
            <p className="text-sm mb-4 text-slate-600 dark:text-slate-400">שנו את הערכים כדי לראות איך חוק הפילוג עובד ויזואלית.</p>
            <div className="flex gap-4 mb-4 items-center justify-center">
                <div className="text-lg font-mono">
                    <input type="number" value={a} onChange={e => setA(Math.max(1, parseInt(e.target.value) || 1))} className="w-12 text-center bg-transparent border-b-2 border-pink-500"/>
                    (
                    <input type="number" value={b} onChange={e => setB(Math.max(1, parseInt(e.target.value) || 1))} className="w-12 text-center bg-transparent border-b-2 border-cyan-500"/>
                    +
                    <input type="number" value={c} onChange={e => setC(Math.max(1, parseInt(e.target.value) || 1))} className="w-12 text-center bg-transparent border-b-2 border-lime-500"/>
                    ) = {a*b} + {a*c} = <span className="font-bold">{a * (b+c)}</span>
                </div>
            </div>
            <svg viewBox={`0 0 ${width} ${height}`} className="mx-auto">
                {/* Rects */}
                <rect x="0" y="0" width={bWidth} height={height} className="fill-cyan-500/50" />
                <rect x={bWidth} y="0" width={cWidth} height={height} className="fill-lime-500/50" />
                
                {/* Borders */}
                <rect x="0" y="0" width={width} height={height} className="fill-transparent stroke-slate-500 dark:stroke-slate-300" strokeWidth="2" />
                <line x1={bWidth} y1="0" x2={bWidth} y2={height} className="stroke-slate-500 dark:stroke-slate-300" strokeWidth="1" strokeDasharray="4"/>

                {/* Labels */}
                <text x={bWidth/2} y={height/2} textAnchor="middle" dy=".3em" className="fill-slate-900 dark:fill-slate-100 font-bold text-[1.2rem]">{a*b}</text>
                <text x={bWidth + cWidth/2} y={height/2} textAnchor="middle" dy=".3em" className="fill-slate-900 dark:fill-slate-100 font-bold text-[1.2rem]">{a*c}</text>
                
                <text x="-5" y={height/2} textAnchor="end" dy=".3em" className="fill-pink-500 font-mono text-xl">{a}</text>
                <text x={bWidth/2} y="-5" textAnchor="middle" className="fill-cyan-500 font-mono text-xl">{b}</text>
                <text x={bWidth + cWidth/2} y="-5" textAnchor="middle" className="fill-lime-500 font-mono text-xl">{c}</text>
            </svg>
        </div>
    )
}


export const LearnSection: React.FC<{ setView: (v: any) => void }> = ({ setView }) => {
  return (
    <div className="container mx-auto p-6">
        <button onClick={() => setView('DASHBOARD')} className="mb-6 text-primary-600 dark:text-primary-400 hover:underline">
        &larr; חזרה ללוח הבקרה
      </button>
      <h2 className="text-4xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-secondary-500">מרכז הלמידה</h2>
      
      <div className="space-y-12">
        
        <div id="order-of-operations" className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
          <h3 className="text-2xl font-bold mb-4">{Topic.ORDER_OF_OPERATIONS}</h3>
          <p className="mb-4 text-slate-600 dark:text-slate-300">
            כדי למנוע בלבול, מתמטיקאים קבעו סדר פעולות קבוע. הכלל ידוע בראשי התיבות <strong className="text-primary-500">חז"כ חי"ח</strong> (חזקות, כפל וחילוק, חיבור וחיסור). תמיד מתחילים ממה שבתוך הסוגריים.
          </p>
          <ol className="list-decimal list-inside space-y-2 mb-4">
              <li><strong>סוגריים:</strong> פתרון כל הביטויים שבתוך סוגריים.</li>
              <li><strong>חזקות ושורשים:</strong> חישוב כל החזקות והשורשים.</li>
              <li><strong>כפל וחילוק:</strong> ביצוע כל פעולות הכפל והחילוק, משמאל לימין.</li>
              <li><strong>חיבור וחיסור:</strong> ביצוע כל פעולות החיבור והחיסור, משמאל לימין.</li>
          </ol>
           <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-md">
            <p className="font-bold">דוגמה:</p>
            <p className="font-mono text-lg">5 + (6 + 2) * 3² - 10 / 2</p>
            <p className="font-mono text-lg">= 5 + 8 * 3² - 10 / 2 &nbsp;&nbsp;&nbsp;&nbsp; (סוגריים)</p>
            <p className="font-mono text-lg">= 5 + 8 * 9 - 10 / 2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (חזקות)</p>
            <p className="font-mono text-lg">= 5 + 72 - 5 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (כפל וחילוק)</p>
            <p className="font-mono text-lg">= 72 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (חיבור וחיסור)</p>
          </div>
        </div>

        <div id="distributive-property" className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
          <h3 className="text-2xl font-bold mb-4">{Topic.DISTRIBUTIVE_PROPERTY}</h3>
          <p className="mb-4 text-slate-600 dark:text-slate-300">
            חוק הפילוג מאפשר לנו "לפתוח סוגריים" על ידי הכפלת הגורם שמחוץ לסוגריים בכל אחד מהגורמים שבתוך הסוגריים.
          </p>
          <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-md mb-6">
            <p className="font-bold">הנוסחה:</p>
            <p className="font-mono text-2xl text-center my-2">a(b + c) = ab + ac</p>
          </div>
          <AreaModelVisualizer />
        </div>

        <div id="short-multiplication" className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
          <h3 className="text-2xl font-bold mb-4">{Topic.SHORT_MULTIPLICATION}</h3>
           <p className="mb-4 text-slate-600 dark:text-slate-300">
            אלו הן נוסחאות מיוחדות המפשטות כפל של ביטויים אלגבריים נפוצים וחוסכות לנו זמן חישוב.
          </p>
          <div className="space-y-4">
            <div className="p-4 bg-slate-100 dark:bg-slate-900/50 rounded-md">
              <p className="font-bold">ריבוע של סכום:</p>
              <p className="font-mono text-xl text-center my-1">(a + b)² = a² + 2ab + b²</p>
            </div>
             <div className="p-4 bg-slate-100 dark:bg-slate-900/50 rounded-md">
              <p className="font-bold">ריבוע של הפרש:</p>
              <p className="font-mono text-xl text-center my-1">(a - b)² = a² - 2ab + b²</p>
            </div>
             <div className="p-4 bg-slate-100 dark:bg-slate-900/50 rounded-md">
              <p className="font-bold">הפרש ריבועים:</p>
              <p className="font-mono text-xl text-center my-1">(a - b)(a + b) = a² - b²</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
