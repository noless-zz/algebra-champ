import { Topic, Difficulty, AnswerFormat } from '../types.ts';

// Helper functions
const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// --- Generation for Order of Operations ---

const generateOrderOfOperations = (difficulty: string) => {
  let expression = '';
  let answer = 0;

  if (difficulty === Difficulty.EASY) {
    const a = getRandomInt(1, 10);
    const b = getRandomInt(1, 10);
    const c = getRandomInt(1, 5);
    
    if (Math.random() > 0.5) {
        expression = `${a} + ${b} * ${c}`;
        answer = a + b * c;
    } else {
        expression = `${a} * ${b} + ${c}`;
        answer = a * b + c;
    }
  } else if (difficulty === Difficulty.MEDIUM) {
    const a = getRandomInt(1, 10);
    const b = getRandomInt(1, 10);
    const c = getRandomInt(1, 5);
    const d = getRandomInt(1, 5);
    expression = `${a} * (${b} + ${c}) - ${d}`;
    answer = a * (b + c) - d;
  } else { // HARD
    const a = getRandomInt(2, 5);
    const b = getRandomInt(2, 5);
    const c = getRandomInt(1, 5);
    const d = getRandomInt(1, 10);
    expression = `${d} + ${a} * ((${b} * ${c}) - ${c})`;
    answer = d + a * ((b * c) - c);
  }
  
  const points = difficulty === Difficulty.EASY ? 10 : difficulty === Difficulty.MEDIUM ? 20 : 30;

  // Generate options for multiple choice
  const options = [
    answer.toString(),
    (answer + getRandomInt(1, 5)).toString(),
    (answer - getRandomInt(1, 5)).toString(),
    (answer + getRandomInt(6, 10) * (Math.random() > 0.5 ? 1 : -1)).toString(),
  ];

  return {
    id: `q_${Date.now()}`,
    topic: Topic.ORDER_OF_OPERATIONS,
    difficulty,
    expression,
    answer: answer.toString(),
    answerFormat: AnswerFormat.MultipleChoice,
    options: shuffleArray([...new Set(options)]), // Ensure unique options
    points,
  };
};

// --- Generation for Distributive Property ---

const generateDistributiveProperty = (difficulty: string) => {
  let expression = '';
  let answer = '';
  const x = 'x'; // or any other variable

  if (difficulty === Difficulty.EASY) {
    const a = getRandomInt(2, 9);
    const b = getRandomInt(1, 10);
    expression = `${a}(${x} + ${b})`;
    answer = `${a}${x} + ${a*b}`;
  } else if (difficulty === Difficulty.MEDIUM) {
    let a = getRandomInt(-5, 5);
    if (a === 0) a = 2; // avoid 0
    const b = getRandomInt(1, 7);
    const c = getRandomInt(-10, 10);
    const sign = c >= 0 ? '+' : '-';
    expression = `${a}(${b}${x} ${sign} ${Math.abs(c)})`;
    const term2 = a*c;
    answer = `${a*b}${x} ${term2 >= 0 ? '+' : '-'} ${Math.abs(term2)}`;
    answer = answer.replace('+ -', '-').replace(/\s/g, ''); // cleanup
  } else { // HARD
    const a = getRandomInt(1, 3);
    const b = getRandomInt(1, 5);
    const c = getRandomInt(1, 3);
    const d = getRandomInt(1, 5);
    expression = `(${a === 1 ? '' : a}${x} + ${b})(${c === 1 ? '' : c}${x} + ${d})`;
    const x2_coeff = a*c;
    const x_coeff = a*d + b*c;
    const const_term = b*d;
    answer = `${x2_coeff === 1 ? '' : x2_coeff}x^2 + ${x_coeff}x + ${const_term}`;
    answer = answer.replace(/\s/g, '');
  }

  const points = difficulty === Difficulty.EASY ? 15 : difficulty === Difficulty.MEDIUM ? 25 : 40;
  
  return {
    id: `q_${Date.now()}`,
    topic: Topic.DISTRIBUTIVE_PROPERTY,
    difficulty,
    expression,
    answer,
    answerFormat: AnswerFormat.TextInput,
    points,
  };
}

// --- Generation for Short Multiplication ---

const generateShortMultiplication = (difficulty: string) => {
  let expression = '';
  let answer = '';
  let formulaType = '';
  const x = 'x';
  const a = getRandomInt(1, 5);
  const b = getRandomInt(2, 9);
  
  const type = difficulty === Difficulty.EASY ? 1 : difficulty === Difficulty.MEDIUM ? 2 : 3;
  
  switch(type) {
    case 1: // (ax+b)^2
      formulaType = '(a+b)^2';
      expression = `(${a === 1 ? '' : a}${x} + ${b})^2`;
      const x2_coeff1 = a*a;
      const x_coeff1 = 2*a*b;
      const const_term1 = b*b;
      answer = `${x2_coeff1 === 1 ? '' : x2_coeff1}x^2 + ${x_coeff1}x + ${const_term1}`;
      break;
    case 2: // (ax-b)^2
      formulaType = '(a-b)^2';
      expression = `(${a === 1 ? '' : a}${x} - ${b})^2`;
      const x2_coeff2 = a*a;
      const x_coeff2 = 2*a*b;
      const const_term2 = b*b;
      answer = `${x2_coeff2 === 1 ? '' : x2_coeff2}x^2 - ${x_coeff2}x + ${const_term2}`;
      break;
    case 3: // (ax+b)(ax-b)
    default:
      formulaType = '(a+b)(a-b)';
      expression = `(${a === 1 ? '' : a}${x} + ${b})(${a === 1 ? '' : a}${x} - ${b})`;
      const x2_coeff3 = a*a;
      const const_term3 = b*b;
      answer = `${x2_coeff3 === 1 ? '' : x2_coeff3}x^2 - ${const_term3}`;
      break;
  }
  
  const points = difficulty === Difficulty.EASY ? 20 : difficulty === Difficulty.MEDIUM ? 30 : 40;

  return {
    id: `q_${Date.now()}`,
    topic: Topic.SHORT_MULTIPLICATION,
    difficulty,
    expression,
    answer: answer.replace(/\s/g, ''),
    answerFormat: AnswerFormat.TextInput,
    points,
    formulaType,
  };
}

// --- Generation for Isosceles Triangle ---

const generateIsoscelesTriangleExercise = (difficulty: string) => {
    const scenarios = [
        // Level 1 (Easy): Basic "No" cases.
        { description: 'גובה בלבד', drawingProps: { showAltitude: true }, answer: 'לא', points: 15, level: 1 },
        { description: 'תיכון בלבד', drawingProps: { showMedian: true }, answer: 'לא', points: 15, level: 1 },
        { description: 'חוצה זווית בלבד', drawingProps: { showAngleBisector: true }, answer: 'לא', points: 15, level: 1 },

        // Level 2 (Medium): Basic "Yes" cases.
        { description: 'שתי צלעות שוות', drawingProps: { showSideTicks: true }, answer: 'כן', points: 20, level: 2 },
        { description: 'שתי זוויות בסיס שוות', drawingProps: { showAngleTicks: true }, answer: 'כן', points: 20, level: 2 },

        // Level 3 (Hard): Combined "Yes" cases and tricky "No" cases.
        { description: 'גובה לבסיס הוא גם תיכון', drawingProps: { showAltitude: true, showMedian: true }, answer: 'כן', points: 30, level: 3 },
        { description: 'גובה לבסיס הוא גם חוצה זווית הראש', drawingProps: { showAltitude: true, showAngleBisector: true }, answer: 'כן', points: 30, level: 3 },
        { description: 'תיכון לבסיס הוא גם חוצה זווית הראש', drawingProps: { showMedian: true, showAngleBisector: true }, answer: 'כן', points: 30, level: 3 },
        { description: 'גובה ותיכון מקודקודים שונים', drawingProps: { showAltitude: true, showMedianFromB: true }, answer: 'לא', points: 35, level: 3 },
    ];

    let filteredScenarios;
    if (difficulty === Difficulty.EASY) {
        // Only level 1 questions
        filteredScenarios = scenarios.filter(s => s.level === 1);
    } else if (difficulty === Difficulty.MEDIUM) {
        // Level 1 and 2 questions to mix it up
        filteredScenarios = scenarios.filter(s => s.level <= 2);
    } else { // HARD
        // All questions are available
        filteredScenarios = scenarios;
    }
    
    // Fallback in case a level has no specific questions (should not happen with current setup)
    if (filteredScenarios.length === 0) {
        filteredScenarios = scenarios;
    }

    const scenario = filteredScenarios[Math.floor(Math.random() * filteredScenarios.length)];
    
    return {
        id: `q_${Date.now()}`,
        topic: Topic.ISOSCELES_TRIANGLE,
        difficulty,
        expression: 'בהתאם לנתונים בשרטוט, האם המשולש ABC הוא בוודאות משולש שווה-שוקיים?',
        drawingProps: scenario.drawingProps,
        description: scenario.description,
        answer: scenario.answer,
        answerFormat: AnswerFormat.MultipleChoice,
        options: ['כן', 'לא'],
        points: scenario.points,
    };
};

// --- Main Exported Function ---

export const generateExercise = (topic: string, difficulty: string) => {
    switch (topic) {
        case Topic.ORDER_OF_OPERATIONS:
            return generateOrderOfOperations(difficulty);
        case Topic.DISTRIBUTIVE_PROPERTY:
            return generateDistributiveProperty(difficulty);
        case Topic.SHORT_MULTIPLICATION:
            return generateShortMultiplication(difficulty);
        case Topic.ISOSCELES_TRIANGLE:
            return generateIsoscelesTriangleExercise(difficulty);
        default:
            // Fallback to a default exercise if topic is unknown
            return generateOrderOfOperations(Difficulty.EASY);
    }
};