import { useNavigate, useParams } from 'react-router-dom';
import type { ExamId } from '../types';

export default function ModePage() {
  const { exam } = useParams<{ exam: ExamId }>();
  const navigate = useNavigate();

  if (!exam || (exam !== '101' && exam !== '102')) {
    navigate('/');
    return null;
  }

  return (
    <div className="text-center">
      <div className="inline-block bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full mb-4">
        LPIC-{exam}
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Chọn chế độ</h1>
      <p className="text-gray-500 mb-10">Bạn muốn làm gì hôm nay?</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <button
          onClick={() => navigate(`/exam/${exam}/list`)}
          className="rounded-2xl border-2 border-purple-200 bg-purple-50 hover:border-purple-400 p-8 text-left transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer"
        >
          <div className="text-4xl mb-4">📖</div>
          <div className="text-xl font-bold text-purple-700 mb-2">Danh sách câu hỏi</div>
          <p className="text-gray-600 text-sm leading-relaxed">
            Xem toàn bộ câu hỏi và đáp án. Phù hợp để đọc, ghi nhớ và ôn lý thuyết.
          </p>
          <div className="mt-4 text-xs text-gray-400">120 câu · Không giới hạn thời gian</div>
        </button>

        <button
          onClick={() => navigate(`/exam/${exam}/quiz`)}
          className="rounded-2xl border-2 border-orange-200 bg-orange-50 hover:border-orange-400 p-8 text-left transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer"
        >
          <div className="text-4xl mb-4">⏱️</div>
          <div className="text-xl font-bold text-orange-700 mb-2">Thi thử</div>
          <p className="text-gray-600 text-sm leading-relaxed">
            60 câu ngẫu nhiên, đếm ngược 90 phút — giống kỳ thi thật. Lưu kết quả vào lịch sử.
          </p>
          <div className="mt-4 text-xs text-gray-400">60 câu · 90 phút</div>
        </button>
      </div>

      <div className="mt-8">
        <button
          onClick={() => navigate('/history')}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Xem lịch sử thi →
        </button>
      </div>
    </div>
  );
}
