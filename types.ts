
export interface User {
  uid: string;
  email: string;
  username: string;
  score: number;
  completedExercises: number;
}

export enum View {
  DASHBOARD,
  LEARN,
  PRACTICE,
  LEADERBOARD,
}

export enum Topic {
  ORDER_OF_OPERATIONS = "סדר פעולות חשבון",
  DISTRIBUTIVE_PROPERTY = "חוק הפילוג",
  SHORT_MULTIPLICATION = "נוסחאות הכפל המקוצר",
}

export enum QuestionType {
  // Order of operations
  OO_SIMPLE, // e.g., a + b * c
  OO_PARENTHESIS, // e.g., (a + b) * c
  OO_EXPONENT, // e.g., a + b^2
  
  // Distributive property
  DP_SIMPLE, // e.g., a(bx + c)
  DP_EXPANDED, // e.g., (ax + b)(cx + d)

  // Shortened multiplication
  SM_SQUARE_SUM, // (ax+b)^2
  SM_SQUARE_DIFF, // (ax-b)^2
  SM_DIFF_SQUARES, // (ax-b)(ax+b)
}

export enum AnswerFormat {
  MULTIPLE_CHOICE,
  TEXT_INPUT,
}

export interface Question {
  id: string;
  topic: Topic;
  type: QuestionType;
  questionText: string | React.ReactNode;
  answerFormat: AnswerFormat;
  options?: string[]; // For multiple choice
  correctAnswer: string;
  // For text input with multiple fields
  isMultiPartInput?: boolean;
  correctAnswerParts?: Record<string, string>;
  solution: {
    explanation: string;
    finalAnswer: string;
  };
}
