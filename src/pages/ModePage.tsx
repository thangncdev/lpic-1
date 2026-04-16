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
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Select Mode</h1>
      <p className="text-gray-500 mb-10">What would you like to do today?</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <button
          onClick={() => navigate(`/exam/${exam}/list`)}
          className="rounded-2xl border-2 border-purple-200 bg-purple-50 hover:border-purple-400 p-8 text-left transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer"
        >
          <div className="text-4xl mb-4">📖</div>
          <div className="text-xl font-bold text-purple-700 mb-2">Question List</div>
          <p className="text-gray-600 text-sm leading-relaxed">
            View all questions and answers. Perfect for reading, memorizing, and reviewing theory.
          </p>
          <div className="mt-4 text-xs text-gray-400">120 questions · Unlimited time</div>
        </button>

        <button
          onClick={() => navigate(`/exam/${exam}/quiz`)}
          className="rounded-2xl border-2 border-orange-200 bg-orange-50 hover:border-orange-400 p-8 text-left transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer"
        >
          <div className="text-4xl mb-4">⏱️</div>
          <div className="text-xl font-bold text-orange-700 mb-2">Practice Test</div>
          <p className="text-gray-600 text-sm leading-relaxed">
            60 random questions with 90-minute countdown—just like the real exam. Results are saved to history.
          </p>
          <div className="mt-4 text-xs text-gray-400">60 questions · 90 minutes</div>
        </button>
      </div>

      <div className="mt-8">
        <button
          onClick={() => navigate('/history')}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          View test history →
        </button>
      </div>
    </div>
  );
}
