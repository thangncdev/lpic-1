import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { loadQuestions } from '../data/loader';
import type { ExamId, Question } from '../types';
import QuestionItem from '../components/question-list/QuestionItem';

export default function QuestionListPage() {
  const { exam } = useParams<{ exam: ExamId }>();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!exam || (exam !== '101' && exam !== '102')) {
      navigate('/');
      return;
    }
    loadQuestions(exam).then((qs) => {
      setQuestions(qs);
      setLoading(false);
    });
  }, [exam, navigate]);

  const filtered = search.trim()
    ? questions.filter(
        (q) =>
          q.question.toLowerCase().includes(search.toLowerCase()) ||
          q.options.some((o) => o.text.toLowerCase().includes(search.toLowerCase()))
      )
    : questions;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <button onClick={() => navigate(`/exam/${exam}`)} className="text-gray-400 hover:text-gray-600 text-sm">
            ← Back
          </button>
          <span className="text-gray-300">|</span>
          <span className="text-sm font-medium text-gray-600">LPIC-{exam}</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Question List</h1>
        <p className="text-gray-500 text-sm mt-1">{questions.length} questions · Click to view answers</p>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search questions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No questions found</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((q, i) => (
            <QuestionItem key={q.number} question={q} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
