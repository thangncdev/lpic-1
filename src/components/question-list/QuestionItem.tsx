import { useState } from 'react';
import type { Question } from '../../types';

interface Props {
  question: Question;
  index: number;
}

export default function QuestionItem({ question, index }: Props) {
  const [open, setOpen] = useState(false);
  const isMulti = question.correctAnswers.length > 1;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left px-5 py-4 flex items-start gap-3 hover:bg-gray-50 transition-colors"
      >
        <span className="shrink-0 text-xs font-mono bg-gray-100 text-gray-500 px-2 py-1 rounded mt-0.5">
          #{index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {question.type === 'fill_blank' ? (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Fill</span>
            ) : isMulti ? (
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                Select {question.correctAnswers.length}
              </span>
            ) : (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">One answer</span>
            )}
          </div>
          <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">{question.question}</p>
        </div>
        <span className="shrink-0 text-gray-400 text-lg ml-2">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-gray-100 pt-4">
          {question.type === 'fill_blank' ? (
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Answer</div>
              <div className="inline-block bg-green-100 text-green-800 font-mono px-4 py-2 rounded-lg font-semibold">
                {question.correctText}
              </div>
            </div>
          ) : (
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Options</div>
              <div className="space-y-2">
                {question.options.map((opt) => (
                  <div
                    key={opt.letter}
                    className={`flex items-start gap-3 px-4 py-3 rounded-lg text-sm
                      ${opt.isCorrect
                        ? 'bg-green-50 border border-green-300 text-green-900 font-medium'
                        : 'bg-gray-50 border border-gray-200 text-gray-600'
                      }`}
                  >
                    <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                      ${opt.isCorrect ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
                      {opt.letter}
                    </span>
                    <span className="whitespace-pre-wrap">{opt.text}</span>
                    {opt.isCorrect && <span className="ml-auto shrink-0 text-green-600">✓</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
