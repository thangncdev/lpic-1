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
          ← Quay lại
        </button>
        <span className="text-gray-300">|</span>
        <span className="text-sm font-medium text-gray-600">LPIC-{exam} · Thi thử</span>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">Thiết lập bài thi</h1>
      <p className="text-gray-500 text-sm mb-8">60 câu ngẫu nhiên · 90 phút</p>

      <div className="mb-8">
        <div className="text-sm font-semibold text-gray-700 mb-3">Chế độ hiển thị đáp án</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => setMode('exam')}
            className={`p-5 rounded-xl border-2 text-left transition-all cursor-pointer
              ${mode === 'exam'
                ? 'border-orange-400 bg-orange-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
          >
            <div className="font-semibold text-gray-800 mb-1">📋 Chế độ thi</div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Không hiện đáp án trong lúc làm bài. Xem kết quả sau khi nộp bài.
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
              Hiện ngay đúng/sai sau mỗi câu. Phù hợp để luyện tập và ghi nhớ.
            </p>
          </button>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-5 mb-8 text-sm text-gray-600 space-y-2">
        <div className="flex items-center gap-2"><span>📝</span><span><b>60 câu</b> được chọn ngẫu nhiên từ 120 câu</span></div>
        <div className="flex items-center gap-2"><span>⏱️</span><span>Thời gian: <b>90 phút</b></span></div>
        <div className="flex items-center gap-2"><span>✅</span><span>Ngưỡng đậu: <b>500/800 điểm (~62.5%)</b></span></div>
        <div className="flex items-center gap-2"><span>💾</span><span>Kết quả được lưu vào lịch sử</span></div>
      </div>

      <button
        onClick={() => onStart(mode)}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-xl text-lg transition-colors"
      >
        Bắt đầu thi →
      </button>
    </div>
  );
}
