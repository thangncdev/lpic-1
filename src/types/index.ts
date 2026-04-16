export type QuestionType = 'multiple_choice' | 'fill_blank';
export type ExamId = '101' | '102';
export type QuizMode = 'instant' | 'exam';

export interface Option {
  letter: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  number: number;
  type: QuestionType;
  question: string;
  options: Option[];
  correctAnswers: string[];
  correctText: string | null;
  exam: ExamId;
}

export interface CompletedSession {
  id: string;
  date: string; // ISO string
  exam: ExamId;
  mode: QuizMode;
  score: number;
  total: number;
  durationSeconds: number;
  wrongQuestionNumbers: number[];
}

export interface ProgressStore {
  sessions: CompletedSession[];
}

export interface QuizState {
  questions: Question[];
  answers: Record<number, string[]>; // question number -> selected letters/text
  currentIndex: number;
  startTime: number;
  phase: 'setup' | 'active' | 'finished';
  exam: ExamId;
  mode: QuizMode;
  lockedQuestions: Set<number>; // for instant mode: questions already answered
}
