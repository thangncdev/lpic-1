import { useRef, useState } from 'react';
import type { Question } from '../../types';
import type { QuizResult } from '../../hooks/useQuiz';
import { isAnswerCorrect } from '../../utils/scoring';
import { formatDuration } from '../../utils/scoring';

interface Props {
  result: QuizResult;
  questions: Question[];
  answers: Record<number, string[]>;
  exam: string;
  onRetry: () => void;
  onHome: () => void;
}

const PASS_THRESHOLD = 0.625;

function getQuestionStatus(q: Question, ans: string[]): 'correct' | 'wrong' | 'skipped' {
  if (ans.length === 0) return 'skipped';
  return isAnswerCorrect(q, ans) ? 'correct' : 'wrong';
}

export default function QuizResults({ result, questions, answers, exam, onRetry, onHome }: Props) {
  const { score, total, durationSeconds } = result;
  const percent = Math.round((score / total) * 100);
  const passed = percent >= PASS_THRESHOLD * 100;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);

  function scrollToQuestion(i: number) {
    setActiveIndex(i);
    questionRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="flex gap-0 w-full overflow-hidden">
      {/* Left: scrollable detail */}
      <div className="flex-1 overflow-y-auto px-4 pt-6 pb-8 min-w-0">
        {/* Score card */}
        <div className={`rounded-2xl p-8 text-center mb-6 ${passed ? 'bg-green-50 border-2 border-green-300' : 'bg-red-50 border-2 border-red-300'}`}>
          <div className="text-5xl mb-3">{passed ? '🎉' : '😔'}</div>
          <div className={`text-6xl font-bold mb-2 ${passed ? 'text-green-600' : 'text-red-600'}`}>
            {percent}%
          </div>
          <div className="text-xl font-semibold text-gray-700 mb-1">
            {score} / {total} correct
          </div>
          <div className={`text-sm font-semibold ${passed ? 'text-green-600' : 'text-red-600'}`}>
            {passed ? '✓ PASSED — You exceeded the 62.5% threshold' : '✗ NOT PASSED — At least 62.5% required to pass'}
          </div>
          <div className="mt-3 text-sm text-gray-500">
            LPIC-{exam} · Time: {formatDuration(durationSeconds)}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={onRetry}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            Retry
          </button>
          <button
            onClick={onHome}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-xl transition-colors"
          >
            Home
          </button>
        </div>

        {/* Question breakdown */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4">Question Breakdown</h2>
          <div className="space-y-4">
            {questions.map((q, i) => {
              const ans = answers[q.number] ?? [];
              const status = getQuestionStatus(q, ans);
              const isActive = activeIndex === i;

              const statusColors = {
                correct: 'border-green-200 bg-green-50',
                wrong: 'border-red-200 bg-red-50',
                skipped: 'border-gray-200 bg-gray-50',
              };
              const iconColors = {
                correct: 'bg-green-500 text-white',
                wrong: 'bg-red-500 text-white',
                skipped: 'bg-gray-400 text-white',
              };
              const icon = { correct: '✓', wrong: '✗', skipped: '—' }[status];

              return (
                <div
                  key={q.number}
                  ref={(el) => { questionRefs.current[i] = el; }}
                  className={`rounded-xl border-2 p-4 scroll-mt-4 transition-shadow ${statusColors[status]} ${isActive ? 'ring-2 ring-orange-400' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${iconColors[status]}`}>
                      {icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-500 mb-1 font-medium">Question {i + 1}</div>
                      <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap mb-3">{q.question}</p>

                      {/* All options */}
                      {q.type === 'multiple_choice' && q.options.length > 0 && (
                        <div className="space-y-1.5 mb-3">
                          {q.options.map((opt) => {
                            const userSelected = ans.includes(opt.letter);
                            const isCorrectOption = q.correctAnswers.includes(opt.letter);

                            let optClass = 'border-gray-200 bg-white text-gray-700';
                            if (isCorrectOption) {
                              optClass = 'border-green-400 bg-green-50 text-green-800';
                            } else if (userSelected && !isCorrectOption) {
                              optClass = 'border-red-400 bg-red-50 text-red-800';
                            }

                            return (
                              <div
                                key={opt.letter}
                                className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-xs ${optClass}`}
                              >
                                <span className="font-bold shrink-0 w-4">{opt.letter}.</span>
                                <span className="leading-relaxed">{opt.text}</span>
                                {userSelected && isCorrectOption && (
                                  <span className="ml-auto shrink-0 text-green-600 font-semibold">✓ you selected</span>
                                )}
                                {userSelected && !isCorrectOption && (
                                  <span className="ml-auto shrink-0 text-red-600 font-semibold">✗ you selected</span>
                                )}
                                {!userSelected && isCorrectOption && (
                                  <span className="ml-auto shrink-0 text-green-600 font-semibold">correct answer</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Fill blank */}
                      {q.type === 'fill_blank' && (
                        <div className="text-xs space-y-1 mb-2">
                          <div>
                            <span className="text-gray-500">You entered: </span>
                            <span className={`font-mono font-semibold ${status === 'correct' ? 'text-green-700' : status === 'wrong' ? 'text-red-700' : 'text-gray-500'}`}>
                              {ans[0] ?? '(left blank)'}
                            </span>
                          </div>
                          {status !== 'correct' && (
                            <div>
                              <span className="text-gray-500">Correct answer: </span>
                              <span className="font-mono font-semibold text-green-700">{q.correctText}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Summary line */}
                      <div className="text-xs text-gray-400 border-t border-gray-200 pt-2 mt-1">
                        {status === 'skipped' && <span className="italic">Skipped — no answer</span>}
                        {status === 'correct' && <span className="text-green-600 font-medium">Answered correctly</span>}
                        {status === 'wrong' && q.type === 'multiple_choice' && (
                          <span className="text-red-600">
                            Your choice: <span className="font-mono font-semibold">{ans.join(', ')}</span>
                            {' · '}Correct answer: <span className="font-mono font-semibold text-green-700">{q.correctAnswers.join(', ')}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right: fixed question list */}
      <div className="w-52 shrink-0 border-l border-gray-200 bg-white overflow-y-auto px-3 pt-6 pb-8">
        <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Question List</div>

        {/* Legend */}
        <div className="flex flex-col gap-1 mb-4 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-green-500 inline-block shrink-0" />
            Correct
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-red-400 inline-block shrink-0" />
            Incorrect
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-gray-300 inline-block shrink-0" />
            Skipped
          </div>
        </div>

        <div className="grid grid-cols-5 gap-1">
          {questions.map((q, i) => {
            const ans = answers[q.number] ?? [];
            const status = getQuestionStatus(q, ans);
            const bgColor = {
              correct: 'bg-green-500 text-white',
              wrong: 'bg-red-400 text-white',
              skipped: 'bg-gray-200 text-gray-600',
            }[status];

            return (
              <button
                key={q.number}
                onClick={() => scrollToQuestion(i)}
                className={`w-full aspect-square rounded text-xs font-semibold transition-all hover:opacity-80 ${bgColor} ${activeIndex === i ? 'ring-2 ring-orange-400 ring-offset-1' : ''}`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>

        {/* Summary counts */}
        <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500 space-y-1">
          <div className="flex justify-between">
            <span>Correct</span>
            <span className="font-semibold text-green-600">{questions.filter((q) => getQuestionStatus(q, answers[q.number] ?? []) === 'correct').length}</span>
          </div>
          <div className="flex justify-between">
            <span>Incorrect</span>
            <span className="font-semibold text-red-500">{questions.filter((q) => getQuestionStatus(q, answers[q.number] ?? []) === 'wrong').length}</span>
          </div>
          <div className="flex justify-between">
            <span>Skipped</span>
            <span className="font-semibold text-gray-500">{questions.filter((q) => getQuestionStatus(q, answers[q.number] ?? []) === 'skipped').length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
