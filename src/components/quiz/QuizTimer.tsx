import { formatDuration } from '../../utils/scoring';

interface Props {
  timeLeft: number;
  total: number;
}

const WARNING_THRESHOLD = 5 * 60; // 5 minutes

export default function QuizTimer({ timeLeft, total }: Props) {
  const isWarning = timeLeft <= WARNING_THRESHOLD;
  const percent = (timeLeft / total) * 100;

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-sm font-semibold
      ${isWarning ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
      <span>{isWarning ? '⚠️' : '⏱️'}</span>
      <span>{formatDuration(timeLeft)}</span>
      <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${isWarning ? 'bg-red-500' : 'bg-blue-500'}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
