import { useCallback, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { ExamId, Question, QuizMode } from '../types';
import { loadQuestions } from '../data/loader';
import { shuffle } from '../utils/shuffle';
import { calculateScore } from '../utils/scoring';
import { useAppStore } from '../store/useAppStore';

const QUIZ_COUNT = 60;
const QUIZ_DURATION = 90 * 60; // 90 minutes in seconds

export type QuizPhase = 'setup' | 'loading' | 'active' | 'finished';

export interface QuizResult {
  score: number;
  total: number;
  wrongNumbers: number[];
  durationSeconds: number;
}

export function useQuiz(exam: ExamId) {
  const addSession = useAppStore((s) => s.addSession);

  const [phase, setPhase] = useState<QuizPhase>('setup');
  const [mode, setMode] = useState<QuizMode>('exam');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string[]>>({});
  const [lockedQuestions, setLockedQuestions] = useState<Set<number>>(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUIZ_DURATION);
  const [result, setResult] = useState<QuizResult | null>(null);
  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Start timer when active
  useEffect(() => {
    if (phase !== 'active') return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          submitQuiz();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const startQuiz = useCallback(async (selectedMode: QuizMode) => {
    setPhase('loading');
    setMode(selectedMode);
    const allQuestions = await loadQuestions(exam);
    const picked = shuffle(allQuestions).slice(0, QUIZ_COUNT);
    setQuestions(picked);
    setAnswers({});
    setLockedQuestions(new Set());
    setCurrentIndex(0);
    setTimeLeft(QUIZ_DURATION);
    startTimeRef.current = Date.now();
    setResult(null);
    setPhase('active');
  }, [exam]);

  const answerQuestion = useCallback((questionNumber: number, selected: string[]) => {
    setAnswers((prev) => ({ ...prev, [questionNumber]: selected }));
  }, []);

  // instant mode: lock current question (reveal answer), then go next
  const confirmAndNext = useCallback((questionNumber: number) => {
    setLockedQuestions((prev) => new Set([...prev, questionNumber]));
    setCurrentIndex((i) => Math.min(i + 1, QUIZ_COUNT - 1));
  }, []);

  const submitQuiz = useCallback(() => {
    clearInterval(timerRef.current!);
    const durationSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
    const { score, total, wrongNumbers } = calculateScore(questions, answers);
    const sessionResult: QuizResult = { score, total, wrongNumbers, durationSeconds };
    setResult(sessionResult);
    setPhase('finished');

    addSession({
      id: uuidv4(),
      date: new Date().toISOString(),
      exam,
      mode,
      score,
      total,
      durationSeconds,
      wrongQuestionNumbers: wrongNumbers,
    });
  }, [questions, answers, exam, mode, addSession]);

  const goNext = useCallback(() => {
    setCurrentIndex((i) => Math.min(i + 1, questions.length - 1));
  }, [questions.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => Math.max(i - 1, 0));
  }, []);

  const goTo = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const resetQuiz = useCallback(() => {
    clearInterval(timerRef.current!);
    setPhase('setup');
    setQuestions([]);
    setAnswers({});
    setLockedQuestions(new Set());
    setCurrentIndex(0);
    setResult(null);
  }, []);

  return {
    phase,
    mode,
    questions,
    answers,
    lockedQuestions,
    currentIndex,
    timeLeft,
    result,
    startQuiz,
    answerQuestion,
    confirmAndNext,
    submitQuiz,
    goNext,
    goPrev,
    goTo,
    resetQuiz,
  };
}
