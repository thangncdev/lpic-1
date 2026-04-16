import { useNavigate, useParams } from 'react-router-dom';
import type { ExamId } from '../types';
import { useQuiz } from '../hooks/useQuiz';
import QuizSetup from '../components/quiz/QuizSetup';
import QuizQuestion from '../components/quiz/QuizQuestion';
import QuizTimer from '../components/quiz/QuizTimer';
import QuizResults from '../components/quiz/QuizResults';

const QUIZ_DURATION = 90 * 60;

export default function QuizPage() {
  const { exam } = useParams<{ exam: ExamId }>();
  const navigate = useNavigate();

  if (!exam || (exam !== '101' && exam !== '102')) {
    navigate('/');
    return null;
  }

  const {
    phase, mode, questions, answers, lockedQuestions,
    currentIndex, timeLeft, result,
    startQuiz, answerQuestion, confirmAndNext, submitQuiz, goNext, goPrev, goTo, resetQuiz,
  } = useQuiz(exam);

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
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
        <span className="ml-3 text-gray-500">Đang chuẩn bị bài thi...</span>
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

  // Active phase
  const currentQuestion = questions[currentIndex];
  const currentAnswer = answers[currentQuestion?.number] ?? [];
  const isLocked = lockedQuestions.has(currentQuestion?.number);
  const answeredCount = Object.keys(answers).length;

  function handleAnswer(selected: string[]) {
    answerQuestion(currentQuestion.number, selected);
  }

  // Nút Tiếp: instant mode → lock + next; exam mode → chỉ next
  function handleNext() {
    if (mode === 'instant' && !isLocked) {
      confirmAndNext(currentQuestion.number);
    } else {
      goNext();
    }
  }

  return (
    <div>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-600">LPIC-{exam}</span>
          <span className="text-gray-300">·</span>
          <span className="text-sm text-gray-500">
            Câu {currentIndex + 1} / {questions.length}
          </span>
          <span className="text-gray-300">·</span>
          <span className="text-sm text-gray-500">Đã trả lời: {answeredCount}/{questions.length}</span>
        </div>
        <div className="flex items-center gap-3">
          <QuizTimer timeLeft={timeLeft} total={QUIZ_DURATION} />
          <button
            onClick={() => {
              if (confirm('Bạn có chắc muốn nộp bài không?')) submitQuiz();
            }}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Nộp bài
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-gray-200 rounded-full mb-4">
        <div
          className="h-full bg-orange-400 rounded-full transition-all"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Main layout: question left, navigator right */}
      <div className="flex gap-4 items-start">
        {/* Question card */}
        <div className="flex-1 min-w-0 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          {currentQuestion && (
            <QuizQuestion
              question={currentQuestion}
              answer={currentAnswer}
              mode={mode}
              locked={isLocked}
              onAnswer={handleAnswer}
            />
          )}
        </div>

        {/* Question navigator — right sidebar */}
        <div className="hidden sm:block w-52 shrink-0 bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Danh sách câu
          </div>
          <div className="grid grid-cols-5 gap-1">
            {questions.map((q, i) => {
              const ans = answers[q.number] ?? [];
              const hasAnswer = ans.length > 0;
              const isLocked_ = lockedQuestions.has(q.number);
              return (
                <button
                  key={q.number}
                  onClick={() => goTo(i)}
                  className={`w-8 h-8 rounded text-xs font-bold transition-colors
                    ${i === currentIndex ? 'bg-orange-500 text-white' :
                      isLocked_ ? 'bg-blue-400 text-white' :
                      hasAnswer ? 'bg-gray-400 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
          {/* Legend */}
          <div className="mt-4 space-y-1.5 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-orange-500 inline-block shrink-0"></span> Câu hiện tại
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-gray-400 inline-block shrink-0"></span> Đã trả lời
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-gray-100 border border-gray-300 inline-block shrink-0"></span> Chưa trả lời
            </div>
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={goPrev}
          disabled={currentIndex === 0}
          className="px-5 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-40 text-gray-700 font-medium rounded-xl transition-colors"
        >
          ← Trước
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === questions.length - 1}
          className="px-5 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-40 text-gray-700 font-medium rounded-xl transition-colors"
        >
          Tiếp →
        </button>
      </div>
    </div>
  );
}
