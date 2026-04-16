import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { formatDuration } from '../utils/scoring';
import type { ExamId } from '../types';

const PASS_THRESHOLD = 62.5;

export default function HistoryPage() {
  const navigate = useNavigate();
  const { progress, clearHistory } = useAppStore();
  const sessions = progress.sessions;
  const [examFilter, setExamFilter] = useState<ExamId | 'all'>('all');

  const filtered = examFilter === 'all' ? sessions : sessions.filter((s) => s.exam === examFilter);

  // Stats per exam
  function getStats(exam: ExamId | 'all') {
    const list = exam === 'all' ? sessions : sessions.filter((s) => s.exam === exam);
    if (list.length === 0) return null;
    const scores = list.map((s) => Math.round((s.score / s.total) * 100));
    return {
      count: list.length,
      avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      best: Math.max(...scores),
    };
  }

  const stats = getStats(examFilter);

  function handleClear() {
    if (confirm('Xóa toàn bộ lịch sử thi? Hành động này không thể hoàn tác.')) {
      clearHistory();
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-gray-600 text-sm">
          ← Trang chủ
        </button>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Lịch sử thi</h1>
        {sessions.length > 0 && (
          <button
            onClick={handleClear}
            className="text-sm text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-lg transition-colors"
          >
            Xóa tất cả
          </button>
        )}
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {(['all', '101', '102'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setExamFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${examFilter === f ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {f === 'all' ? 'Tất cả' : `LPIC-${f}`}
          </button>
        ))}
      </div>

      {/* Stats overview */}
      {stats && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-gray-800">{stats.count}</div>
            <div className="text-xs text-gray-500 mt-1">Lần thi</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
            <div className={`text-2xl font-bold ${stats.avg >= PASS_THRESHOLD ? 'text-green-600' : 'text-red-500'}`}>
              {stats.avg}%
            </div>
            <div className="text-xs text-gray-500 mt-1">Trung bình</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
            <div className={`text-2xl font-bold ${stats.best >= PASS_THRESHOLD ? 'text-green-600' : 'text-red-500'}`}>
              {stats.best}%
            </div>
            <div className="text-xs text-gray-500 mt-1">Cao nhất</div>
          </div>
        </div>
      )}

      {/* Sessions list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-4">📋</div>
          <p className="text-gray-400">Chưa có lịch sử thi nào</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors"
          >
            Thi thử ngay
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((session) => {
            const percent = Math.round((session.score / session.total) * 100);
            const passed = percent >= PASS_THRESHOLD;
            const date = new Date(session.date);
            return (
              <div
                key={session.id}
                onClick={() => navigate(`/history/${session.id}`)}
                className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:border-orange-300 hover:shadow-sm transition-all"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shrink-0
                  ${passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                  {percent}%
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-gray-800">LPIC-{session.exam}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${session.mode === 'instant' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                      {session.mode === 'instant' ? 'Instant' : 'Exam'}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {passed ? 'ĐẠT' : 'CHƯA ĐẠT'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-3">
                    <span>{session.score}/{session.total} câu đúng</span>
                    <span>·</span>
                    <span>⏱ {formatDuration(session.durationSeconds)}</span>
                    <span>·</span>
                    <span>{date.toLocaleDateString('vi-VN')} {date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
                {/* Mini progress bar */}
                <div className="w-20 shrink-0">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${passed ? 'bg-green-500' : 'bg-red-400'}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
