import type { Question } from '../../types';

interface Props {
  questions: Question[];
  currentIndex: number;
  answers: Record<number, string[]>;
  lockedQuestions: Set<number>;
  onGoTo: (index: number) => void;
}

export default function QuestionNavigator({
  questions,
  currentIndex,
  answers,
  lockedQuestions,
  onGoTo,
}: Props) {
  return (
    <>
      <div className="grid grid-cols-5 gap-0.5">
        {questions.map((q, i) => {
          const ans = answers[q.number] ?? [];
          const hasAnswer = ans.length > 0;
          const isLocked = lockedQuestions.has(q.number);
          return (
            <button
              key={q.number}
              onClick={() => onGoTo(i)}
              className={`w-7 h-7 rounded text-[11px] font-bold transition-colors
                ${i === currentIndex ? 'bg-orange-500 text-white' :
                  isLocked ? 'bg-blue-400 text-white' :
                  hasAnswer ? 'bg-gray-400 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] text-gray-500">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-orange-500 shrink-0" /> Current
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-blue-400 shrink-0" /> Reviewed
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-gray-400 shrink-0" /> Answered
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-gray-100 border border-gray-300 shrink-0" /> Unanswered
        </div>
      </div>
    </>
  );
}
