import type { Question } from '../types';

export function isAnswerCorrect(question: Question, answer: string[]): boolean {
  if (question.type === 'fill_blank') {
    const userAns = (answer[0] ?? '').trim().toLowerCase();
    const correct = (question.correctText ?? '').trim().toLowerCase();
    return userAns === correct;
  }
  // multiple_choice: exact set match
  const selected = new Set(answer);
  const correct = new Set(question.correctAnswers);
  if (selected.size !== correct.size) return false;
  for (const c of correct) {
    if (!selected.has(c)) return false;
  }
  return true;
}

export function calculateScore(
  questions: Question[],
  answers: Record<number, string[]>
): { score: number; total: number; wrongNumbers: number[] } {
  let score = 0;
  const wrongNumbers: number[] = [];
  for (const q of questions) {
    const ans = answers[q.number] ?? [];
    if (isAnswerCorrect(q, ans)) {
      score++;
    } else {
      wrongNumbers.push(q.number);
    }
  }
  return { score, total: questions.length, wrongNumbers };
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}
