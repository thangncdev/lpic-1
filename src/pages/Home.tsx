import { useNavigate } from 'react-router-dom';
import type { ExamId } from '../types';

const exams: { id: ExamId; title: string; description: string; color: string }[] = [
  {
    id: '101',
    title: 'LPIC-101',
    description: 'Linux Architecture, Package Management, GNU & Unix Commands, Devices, Filesystems',
    color: 'blue',
  },
  {
    id: '102',
    title: 'LPIC-102',
    description: 'Shells & Scripting, Interfaces & Desktops, Administrative Tasks, Networking, Security',
    color: 'green',
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">LPIC-1 Practice</h1>
      <p className="text-gray-500 mb-10 text-lg">Ôn tập và thi thử chứng chỉ LPIC-1</p>

      <h2 className="text-lg font-semibold text-gray-700 mb-6">Chọn bài thi</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
        {exams.map((exam) => (
          <button
            key={exam.id}
            onClick={() => navigate(`/exam/${exam.id}`)}
            className={`rounded-2xl border-2 p-8 text-left transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer
              ${exam.color === 'blue'
                ? 'border-blue-200 bg-blue-50 hover:border-blue-400'
                : 'border-green-200 bg-green-50 hover:border-green-400'
              }`}
          >
            <div className={`text-4xl font-bold mb-3 ${exam.color === 'blue' ? 'text-blue-600' : 'text-green-600'}`}>
              {exam.title}
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">{exam.description}</p>
            <div className="mt-4 text-xs text-gray-400">120 câu hỏi</div>
          </button>
        ))}
      </div>
    </div>
  );
}
