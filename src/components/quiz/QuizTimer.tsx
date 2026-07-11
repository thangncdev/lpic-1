import { formatDuration } from '../../utils/scoring';

interface Props {
  timeLeft: number;
  total: number;
  dark?: boolean;
}

const WARNING_THRESHOLD = 5 * 60; // 5 minutes

export default function QuizTimer({ timeLeft, total, dark }: Props) {
  const isWarning = timeLeft <= WARNING_THRESHOLD;
  const percent = (timeLeft / total) * 100;

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-sm font-semibold
      ${isWarning
        ? dark ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-700'
        : dark ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-700'
      }`}>
      <span>{isWarning ? '⚠️' : '⏱️'}</span>
      <span>{formatDuration(timeLeft)}</span>
      <div className={`w-16 h-1 rounded-full overflow-hidden ${dark ? 'bg-gray-700' : 'bg-gray-200'}`}>
        <div
          className={`h-full rounded-full transition-all ${isWarning ? 'bg-red-500' : 'bg-blue-500'}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
