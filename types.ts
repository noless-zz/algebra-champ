/**
 * @typedef {Object} User
 * @property {string} uid
 * @property {string} email
 * @property {string} username
 * @property {number} score
 * @property {number} completedExercises
 */
// Fix: Defined and exported the User type as a TypeScript interface to resolve import error.
export type User = {
  uid: string;
  email: string;
  username: string;
  score: number;
  completedExercises: number;
};

export const Topic = {
  ORDER_OF_OPERATIONS: 'סדר פעולות חשבון',
  DISTRIBUTIVE_PROPERTY: 'חוק הפילוג',
  SHORT_MULTIPLICATION: 'נוסחאות הכפל המקוצר',
  ISOSCELES_TRIANGLE: 'משולש שווה-שוקיים',
};

export const TopicStructure = [
    {
        category: 'אלגברה',
        icon: '🧮',
        topics: [
            Topic.ORDER_OF_OPERATIONS,
            Topic.DISTRIBUTIVE_PROPERTY,
            Topic.SHORT_MULTIPLICATION,
        ]
    },
    {
        category: 'גאומטריה',
        icon: '📐',
        topics: [
            Topic.ISOSCELES_TRIANGLE,
        ]
    }
];


export const Difficulty = {
  EASY: 'קל',
  MEDIUM: 'בינוני',
  HARD: 'קשה',
};

export const AnswerFormat = {
  MultipleChoice: 'MULTIPLE_CHOICE',
  TextInput: 'TEXT_INPUT',
};

/**
 * @typedef {Object} Question
 * @property {string} id - A unique ID for the question
 * @property {string} topic - From Topic enum values
 * @property {string} difficulty - From Difficulty enum values
 * @property {string} expression - The math expression to be solved (e.g., "3 * (4 + 5)")
 * @property {string} answer - The correct answer as a string
 * @property {AnswerFormat} answerFormat
 * @property {string[]} [options] - Options for multiple choice
 * @property {number} points - Points awarded for a correct answer
 */

export const View = {
    Dashboard: 'DASHBOARD',
    Learn: 'LEARN',
    Practice: 'PRACTICE',
    Leaderboard: 'LEADERBOARD'
};