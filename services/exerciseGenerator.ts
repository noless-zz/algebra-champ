
import React from 'react';
import { Topic, QuestionType, AnswerFormat } from '../types';
import type { Question } from '../types';

const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const shuffle = <T,>(array: T[]): T[] => array.sort(() => Math.random() - 0.5);

const generateOrderOfOperations = (): Question => {
    const a = randInt(2, 10);
    const b = randInt(2, 10);
    const c = randInt(2, 5);
    const type = [QuestionType.OO_SIMPLE, QuestionType.OO_PARENTHESIS, QuestionType.OO_EXPONENT][randInt(0, 2)];
    let questionText = '';
    let correctAnswer = 0;

    switch (type) {
        case QuestionType.OO_PARENTHESIS:
            questionText = `(${a} + ${b}) * ${c} = ?`;
            correctAnswer = (a + b) * c;
            break;
        case QuestionType.OO_EXPONENT:
            questionText = `${a} * ${c} + ${b}² = ?`;
            correctAnswer = (a * c) + (b ** 2);
            break;
        case QuestionType.OO_SIMPLE:
        default:
            questionText = `${a} + ${b} * ${c} = ?`;
            correctAnswer = a + b * c;
            break;
    }

    const options = shuffle([
        correctAnswer.toString(),
        (a + b * c + randInt(1, 5)).toString(),
        ((a + b) * c).toString(),
        (a * b + c).toString(),
    ]).slice(0, 4);
    
    return {
        id: crypto.randomUUID(),
        topic: Topic.ORDER_OF_OPERATIONS,
        type,
        questionText,
        answerFormat: AnswerFormat.MULTIPLE_CHOICE,
        options,
        correctAnswer: correctAnswer.toString(),
        solution: {
            explanation: `לפי סדר פעולות חשבון, פותרים קודם כפל/חילוק/חזקות ורק אז חיבור/חיסור. הביטוי הוא: ${questionText}`,
            finalAnswer: correctAnswer.toString(),
        },
    };
};

const generateDistributiveProperty = (): Question => {
    const a = randInt(2, 6);
    const b = randInt(2, 6);
    const c = randInt(2, 6);
    const type = [QuestionType.DP_SIMPLE, QuestionType.DP_EXPANDED][randInt(0,1)];
    
    if (type === QuestionType.DP_SIMPLE) {
         return {
            id: crypto.randomUUID(),
            topic: Topic.DISTRIBUTIVE_PROPERTY,
            type,
            // FIX: Corrected the question string to be a valid mathematical expression.
            questionText: `פשטו את הביטוי: ${a}(${b}x + ${c})`,
            answerFormat: AnswerFormat.TEXT_INPUT,
            correctAnswer: `${a*b}x + ${a*c}`,
            solution: {
                explanation: `פותחים את הסוגריים באמצעות חוק הפילוג: ${a}*${b}x + ${a}*${c}`,
                finalAnswer: `${a*b}x + ${a*c}`,
            }
        };
    } else { // DP_EXPANDED
        const d = randInt(2, 6);
        const correct = {
            x2: a*c,
            x: a*d + b*c,
            c: b*d
        };
        return {
            id: crypto.randomUUID(),
            topic: Topic.DISTRIBUTIVE_PROPERTY,
            type,
            // FIX: Replaced JSX with React.createElement to be valid in a .ts file. This resolves numerous parsing errors.
            questionText: React.createElement(
                'div',
                { className: 'flex items-center justify-center text-2xl font-mono' },
                React.createElement('span', null, '('),
                React.createElement('span', { className: 'text-pink-500' }, `${a}x`),
                React.createElement('span', null, ' + '),
                React.createElement('span', { className: 'text-cyan-500' }, `${b}`),
                React.createElement('span', null, ')('),
                React.createElement('span', { className: 'text-lime-500' }, `${c}x`),
                React.createElement('span', null, ' + '),
                React.createElement('span', { className: 'text-amber-500' }, `${d}`),
                React.createElement('span', null, ')')
            ),
            answerFormat: AnswerFormat.TEXT_INPUT,
            isMultiPartInput: true,
            correctAnswer: `${correct.x2}x^2 + ${correct.x}x + ${correct.c}`,
            correctAnswerParts: {
                x2: correct.x2.toString(),
                x: correct.x.toString(),
                c: correct.c.toString(),
            },
            solution: {
                explanation: `פותחים סוגריים: ${a}x*${c}x + ${a}x*${d} + ${b}*${c}x + ${b}*${d}`,
                finalAnswer: `${correct.x2}x² + ${correct.x}x + ${correct.c}`,
            }
        }
    }
};

const generateShortMultiplication = (): Question => {
    const a = randInt(1, 5);
    const b = randInt(2, 10);
    const x = a === 1 ? 'x' : `${a}x`;
    const type = [QuestionType.SM_SQUARE_SUM, QuestionType.SM_SQUARE_DIFF, QuestionType.SM_DIFF_SQUARES][randInt(0, 2)];
    let questionText, correctAnswer;

    switch (type) {
        case QuestionType.SM_SQUARE_SUM:
            questionText = `פשטו את הביטוי: (${x} + ${b})²`;
            correctAnswer = `${a*a}x² + ${2*a*b}x + ${b*b}`;
            break;
        case QuestionType.SM_SQUARE_DIFF:
            questionText = `פשטו את הביטוי: (${x} - ${b})²`;
            correctAnswer = `${a*a}x² - ${2*a*b}x + ${b*b}`;
            break;
        case QuestionType.SM_DIFF_SQUARES:
            questionText = `פשטו את הביטוי: (${x} - ${b})(${x} + ${b})`;
            correctAnswer = `${a*a}x² - ${b*b}`;
            break;
    }

    const options = [correctAnswer, `${a*a}x² + ${b*b}`, `${a*a}x² - ${b*b}`, `${a}x² + ${2*a*b}x + ${b*b}`];

    return {
        id: crypto.randomUUID(),
        topic: Topic.SHORT_MULTIPLICATION,
        type,
        questionText,
        answerFormat: AnswerFormat.MULTIPLE_CHOICE,
        options: shuffle(options).slice(0, 4),
        correctAnswer: correctAnswer,
        solution: {
            explanation: `משתמשים בנוסחת הכפל המקוצר המתאימה.`,
            finalAnswer: correctAnswer,
        },
    };
};


export const generateExercise = (topic: Topic): Question => {
    switch (topic) {
        case Topic.ORDER_OF_OPERATIONS:
            return generateOrderOfOperations();
        case Topic.DISTRIBUTIVE_PROPERTY:
            return generateDistributiveProperty();
        case Topic.SHORT_MULTIPLICATION:
            return generateShortMultiplication();
        default:
            // Should not happen
            return generateOrderOfOperations();
    }
};