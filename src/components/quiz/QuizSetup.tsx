import { useState } from 'react';
import type { ExamId, QuizMode } from '../../types';

interface Props {
  exam: ExamId;
  onStart: (mode: QuizMode) => void;
  onBack: () => void;
}

export default function QuizSetup({ exam, onStart, onBack }: Props) {
  const [mode, setMode] = useState<QuizMode>('exam');

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-600 text-sm">
          ← Back
        </button>
        <span className="text-gray-300">|</span>
        <span className="text-sm font-medium text-gray-600">LPIC-{exam} · Practice Test</span>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">Test Setup</h1>
      <p className="text-gray-500 text-sm mb-8">60 random questions · 90 minutes</p>

      <div className="mb-8">
        <div className="text-sm font-semibold text-gray-700 mb-3">Answer Display Mode</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => setMode('exam')}
            className={`p-5 rounded-xl border-2 text-left transition-all cursor-pointer
              ${mode === 'exam'
                ? 'border-orange-400 bg-orange-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
          >
            <div className="font-semibold text-gray-800 mb-1">📋 Exam Mode</div>
            <p className="text-xs text-gray-500 leading-relaxed">
              No answers shown while taking the test. View results after submission.
            </p>
          </button>

          <button
            onClick={() => setMode('instant')}
            className={`p-5 rounded-xl border-2 text-left transition-all cursor-pointer
              ${mode === 'instant'
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
          >
            <div className="font-semibold text-gray-800 mb-1">⚡ Instant Feedback</div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Immediate feedback on correct/incorrect answers. Great for practice and memorization.
            </p>
          </button>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-5 mb-8 text-sm text-gray-600 space-y-2">
        <div className="flex items-center gap-2"><span>📝</span><span><b>60 questions</b> randomly selected from 120 questions</span></div>
        <div className="flex items-center gap-2"><span>⏱️</span><span>Time: <b>90 minutes</b></span></div>
        <div className="flex items-center gap-2"><span>✅</span><span>Passing score: <b>500/800 points (~62.5%)</b></span></div>
        <div className="flex items-center gap-2"><span>💾</span><span>Results are saved to history</span></div>
      </div>

      <button
        onClick={() => onStart(mode)}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-xl text-lg transition-colors"
      >
        Start Test →
      </button>
    </div>
  );
}
