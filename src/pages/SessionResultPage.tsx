import { useNavigate, useParams } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import QuizResults from '../components/quiz/QuizResults';

export default function SessionResultPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const sessions = useAppStore((s) => s.progress.sessions);

  const session = sessions.find((s) => s.id === sessionId);

  if (!session) {
    return (
      <div className="text-center py-24">
        <div className="text-4xl mb-4">🔍</div>
        <p className="text-gray-400 mb-4">Test result not found</p>
        <button
          onClick={() => navigate('/history')}
          className="px-6 py-2 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors"
        >
          Back to History
        </button>
      </div>
    );
  }

  if (!session.questions || !session.answers) {
    return (
      <div className="text-center py-24">
        <div className="text-4xl mb-4">📋</div>
        <p className="text-gray-500 mb-2 font-medium">No detailed data</p>
        <p className="text-gray-400 text-sm mb-4">
          Older test results don't have detailed question information. Only recent tests support detailed review.
        </p>
        <button
          onClick={() => navigate('/history')}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-300 transition-colors"
        >
          Back to History
        </button>
      </div>
    );
  }

  const result = {
    score: session.score,
    total: session.total,
    wrongNumbers: session.wrongQuestionNumbers,
    durationSeconds: session.durationSeconds,
  };

  return (
    <div className="fixed inset-0 bg-gray-50 flex flex-col z-50">
      <div className="flex-1 flex overflow-hidden max-w-5xl w-full mx-auto">
        <QuizResults
          result={result}
          questions={session.questions}
          answers={session.answers}
          exam={session.exam}
          onRetry={() => navigate(`/exam/${session.exam}/quiz`)}
          onHome={() => navigate('/history')}
        />
      </div>
    </div>
  );
}
