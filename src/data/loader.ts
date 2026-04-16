import type { Question, ExamId } from '../types';

let cache: Question[] | null = null;

export async function loadQuestions(exam?: ExamId): Promise<Question[]> {
  if (!cache) {
    const base = import.meta.env.BASE_URL;
    const [r101, r102] = await Promise.all([
      fetch(`${base}data/questions_101.json`).then((r) => r.json()),
      fetch(`${base}data/questions_102.json`).then((r) => r.json()),
    ]);
    cache = [
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...r101.map((q: any) => ({ ...q, exam: '101' as ExamId })),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...r102.map((q: any) => ({ ...q, exam: '102' as ExamId })),
    ];
  }
  if (!exam) return cache;
  return cache.filter((q) => q.exam === exam);
}
