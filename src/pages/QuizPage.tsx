import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { ExamId, Question } from '../types';
import { useQuiz } from '../hooks/useQuiz';
import QuizSetup from '../components/quiz/QuizSetup';
import QuizQuestion from '../components/quiz/QuizQuestion';
import QuizTimer from '../components/quiz/QuizTimer';
import QuizResults from '../components/quiz/QuizResults';
import QuestionNavigator from '../components/quiz/QuestionNavigator';
import { selectOptionByIndex } from '../utils/answering';

const QUIZ_DURATION = 90 * 60;

function needsManualCheck(question: Question): boolean {
  return question.type === 'fill_blank' || question.correctAnswers.length > 1;
}

function hasAnswer(question: Question, answer: string[]): boolean {
  if (question.type === 'fill_blank') return (answer[0]?.trim() ?? '') !== '';
  return answer.length > 0;
}

export default function QuizPage() {
  const { exam } = useParams<{ exam: ExamId }>();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const examId: ExamId = exam === '102' ? '102' : '101';

  const {
    phase, mode, questions, answers, lockedQuestions,
    currentIndex, timeLeft, result,
    startQuiz, answerQuestion, lockQuestion, submitQuiz, goNext, goPrev, goTo, resetQuiz,
  } = useQuiz(examId);

  const isActive = phase === 'active';
  const currentQuestion = isActive ? questions[currentIndex] : undefined;
  const currentAnswer = currentQuestion ? (answers[currentQuestion.number] ?? []) : [];
  const isLocked = currentQuestion ? lockedQuestions.has(currentQuestion.number) : false;
  const answeredCount = Object.keys(answers).length;
  const isInstant = mode === 'instant';
  const manualCheck = currentQuestion ? needsManualCheck(currentQuestion) : false;
  const canCheck = !!(
    isActive &&
    currentQuestion &&
    isInstant &&
    !isLocked &&
    manualCheck &&
    hasAnswer(currentQuestion, currentAnswer)
  );

  function handleAnswer(selected: string[]) {
    if (!currentQuestion) return;
    answerQuestion(currentQuestion.number, selected);
    if (isInstant && !isLocked && !needsManualCheck(currentQuestion)) {
      lockQuestion(currentQuestion.number);
    }
  }

  function handleCheckAnswer() {
    if (canCheck && currentQuestion) {
      lockQuestion(currentQuestion.number);
    }
  }

  function selectByIndex(index: number) {
    if (!currentQuestion || isLocked || currentQuestion.type === 'fill_blank') return;
    const next = selectOptionByIndex(currentQuestion, currentAnswer, index);
    if (next) handleAnswer(next);
  }

  useEffect(() => {
    if (!isActive || !currentQuestion) return;

    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

      if (e.key === 'Escape' && drawerOpen) {
        setDrawerOpen(false);
        return;
      }

      if (!isTyping && !drawerOpen) {
        if (/^[1-9]$/.test(e.key)) {
          e.preventDefault();
          selectByIndex(Number(e.key) - 1);
          return;
        }
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          goPrev();
          return;
        }
        if (e.key === 'ArrowRight' && currentIndex < questions.length - 1) {
          e.preventDefault();
          goNext();
          return;
        }
      }

      if (e.key === 'Enter' || (e.key === ' ' && !isTyping)) {
        if (canCheck) {
          e.preventDefault();
          handleCheckAnswer();
          return;
        }
        if (!isTyping && currentIndex < questions.length - 1) {
          e.preventDefault();
          goNext();
        }
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    isActive,
    currentQuestion,
    currentAnswer,
    isLocked,
    canCheck,
    currentIndex,
    questions.length,
    drawerOpen,
    goNext,
    goPrev,
  ]);

  if (!exam || (exam !== '101' && exam !== '102')) {
    navigate('/');
    return null;
  }

  function handleGoTo(index: number) {
    goTo(index);
    setDrawerOpen(false);
  }

  if (phase === 'setup') {
    return (
      <QuizSetup
        exam={exam}
        onStart={startQuiz}
        onBack={() => navigate(`/exam/${exam}`)}
      />
    );
  }

  if (phase === 'loading') {
    return (
      <div className="fixed inset-0 bg-gray-50 flex items-center justify-center z-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500" />
        <span className="ml-3 text-gray-500">Preparing test...</span>
      </div>
    );
  }

  if (phase === 'finished' && result) {
    return (
      <div className="fixed inset-0 bg-gray-50 flex flex-col z-50">
        <div className="flex-1 flex overflow-hidden max-w-5xl w-full mx-auto">
          <QuizResults
            result={result}
            questions={questions}
            answers={answers}
            exam={exam}
            onRetry={resetQuiz}
            onHome={() => navigate('/')}
          />
        </div>
      </div>
    );
  }

  function handleHome() {
    if (confirm('Leave the quiz? Your progress will be lost.')) {
      navigate('/');
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-50 flex flex-col z-50">
      {/* Merged top bar */}
      <header className="shrink-0 bg-gray-900 text-white px-3 sm:px-4 py-2 flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <span className="text-lg shrink-0">🐧</span>
          <span className="font-semibold text-sm shrink-0">LPIC-{exam}</span>
          <span className="text-gray-500 hidden sm:inline">·</span>
          <span className="text-sm text-gray-300 truncate">
            Q {currentIndex + 1}/{questions.length}
            <span className="hidden sm:inline"> · {answeredCount} answered</span>
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <QuizTimer timeLeft={timeLeft} total={QUIZ_DURATION} dark />
          <button
            onClick={() => {
              if (confirm('Are you sure you want to submit?')) submitQuiz();
            }}
            className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Submit
          </button>
          <button
            onClick={handleHome}
            className="hidden sm:block text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← Home
          </button>
        </div>
      </header>

      {/* Progress bar */}
      <div className="shrink-0 h-1 bg-gray-200">
        <div
          className="h-full bg-orange-400 transition-all"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Question panel — scrolls independently */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto p-3 sm:p-4">
            {currentQuestion && (
              <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-sm">
                <QuizQuestion
                  question={currentQuestion}
                  answer={currentAnswer}
                  mode={mode}
                  locked={isLocked}
                  onAnswer={handleAnswer}
                />
              </div>
            )}
          </div>
        </div>

        {/* Desktop sidebar */}
        <aside className="hidden sm:flex w-44 shrink-0 flex-col border-l border-gray-200 bg-white overflow-hidden">
          <div className="shrink-0 px-3 py-2 border-b border-gray-100">
            <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
              Questions
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            <QuestionNavigator
              questions={questions}
              currentIndex={currentIndex}
              answers={answers}
              lockedQuestions={lockedQuestions}
              onGoTo={handleGoTo}
            />
          </div>
        </aside>
      </div>

      {/* Keyboard shortcut hint — desktop only */}
      <div className="hidden lg:block shrink-0 border-t border-gray-100 bg-gray-50 px-4 py-1 text-center text-[11px] text-gray-400">
        1–5 select answer · Enter check/next · ← → navigate
      </div>

      {/* Sticky bottom bar */}
      <footer className="shrink-0 border-t border-gray-200 bg-white px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2">
        <button
          onClick={goPrev}
          disabled={currentIndex === 0}
          className="px-3 sm:px-5 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-40 text-gray-700 text-sm font-medium rounded-xl transition-colors"
        >
          ← Prev
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setDrawerOpen(true)}
            className="sm:hidden px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-xl transition-colors"
          >
            ☰ {currentIndex + 1}/{questions.length}
          </button>

          {canCheck && (
            <button
              onClick={handleCheckAnswer}
              className="px-4 sm:px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              Check
            </button>
          )}
        </div>

        <button
          onClick={goNext}
          disabled={currentIndex === questions.length - 1}
          className={`px-3 sm:px-5 py-2 text-sm font-medium rounded-xl transition-colors disabled:opacity-40
            ${isInstant && isLocked
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
        >
          Next →
        </button>
      </footer>

      {/* Mobile question drawer */}
      {drawerOpen && (
        <div className="sm:hidden fixed inset-0 z-[60]">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-56 bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <span className="text-sm font-semibold text-gray-700">Questions</span>
              <button
                onClick={() => setDrawerOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-lg leading-none"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <QuestionNavigator
                questions={questions}
                currentIndex={currentIndex}
                answers={answers}
                lockedQuestions={lockedQuestions}
                onGoTo={handleGoTo}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
