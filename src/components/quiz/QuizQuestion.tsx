import type { Question, QuizMode } from '../../types';
import { isAnswerCorrect } from '../../utils/scoring';

interface Props {
  question: Question;
  answer: string[];
  mode: QuizMode;
  locked: boolean;
  onAnswer: (selected: string[]) => void;
}

export default function QuizQuestion({ question, answer, mode, locked, onAnswer }: Props) {
  const isMulti = question.correctAnswers.length > 1;
  const showFeedback = mode === 'instant' && locked;
  const correct = showFeedback ? isAnswerCorrect(question, answer) : null;

  function toggleOption(letter: string) {
    if (locked) return;
    if (question.type === 'fill_blank') return;

    if (isMulti) {
      const next = answer.includes(letter)
        ? answer.filter((l) => l !== letter)
        : [...answer, letter];
      onAnswer(next);
    } else {
      onAnswer([letter]);
    }
  }

  function handleFillBlankChange(val: string) {
    if (locked) return;
    onAnswer([val]);
  }

  return (
    <div>
      {/* Question header */}
      <div className="flex items-center gap-2 mb-3">
        {question.type === 'fill_blank' ? (
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Fill in the blank</span>
        ) : isMulti ? (
          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
            Select {question.correctAnswers.length} answers
          </span>
        ) : (
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Select 1 answer</span>
        )}
        {showFeedback && (
          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${correct ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {correct ? '✓ Correct' : '✗ Incorrect'}
          </span>
        )}
      </div>

      {/* Question text */}
      <p className="text-gray-800 text-base leading-relaxed mb-6 whitespace-pre-wrap font-medium">
        {question.question}
      </p>

      {/* Fill blank */}
      {question.type === 'fill_blank' ? (
        <div className="space-y-3">
          <input
            type="text"
            value={answer[0] ?? ''}
            onChange={(e) => handleFillBlankChange(e.target.value)}
            disabled={locked}
            placeholder="Enter answer..."
            className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 font-mono text-sm focus:outline-none focus:border-blue-400 disabled:bg-gray-50 disabled:text-gray-500"
          />
          {showFeedback && (
            <div className="text-sm">
              <span className="text-gray-500">Correct answer: </span>
              <span className="font-mono bg-green-100 text-green-800 px-2 py-1 rounded font-semibold">
                {question.correctText}
              </span>
            </div>
          )}
        </div>
      ) : (
        /* Multiple choice */
        <div className="space-y-2">
          {question.options.map((opt) => {
            const isSelected = answer.includes(opt.letter);
            let optClass = 'border-gray-200 bg-white hover:bg-gray-50';
            let circleClass = 'bg-gray-200 text-gray-600';

            if (showFeedback) {
              if (opt.isCorrect) {
                optClass = 'border-green-400 bg-green-50';
                circleClass = 'bg-green-500 text-white';
              } else if (isSelected && !opt.isCorrect) {
                optClass = 'border-red-400 bg-red-50';
                circleClass = 'bg-red-500 text-white';
              }
            } else if (isSelected) {
              optClass = 'border-blue-400 bg-blue-50';
              circleClass = 'bg-blue-500 text-white';
            }

            return (
              <button
                key={opt.letter}
                onClick={() => toggleOption(opt.letter)}
                disabled={locked}
                className={`w-full flex items-start gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all text-sm
                  ${optClass} ${!locked ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <span className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 ${circleClass}`}>
                  {opt.letter}
                </span>
                <span className="whitespace-pre-wrap leading-relaxed">{opt.text}</span>
                {showFeedback && opt.isCorrect && <span className="ml-auto shrink-0 text-green-600 font-bold">✓</span>}
                {showFeedback && isSelected && !opt.isCorrect && <span className="ml-auto shrink-0 text-red-600 font-bold">✗</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
