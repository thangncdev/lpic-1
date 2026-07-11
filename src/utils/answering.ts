import type { Question } from '../types';

export function toggleOptionAnswer(question: Question, answer: string[], letter: string): string[] {
  if (question.type === 'fill_blank') return answer;

  const isMulti = question.correctAnswers.length > 1;
  if (isMulti) {
    return answer.includes(letter)
      ? answer.filter((l) => l !== letter)
      : [...answer, letter];
  }
  return [letter];
}

export function selectOptionByIndex(
  question: Question,
  answer: string[],
  index: number,
): string[] | null {
  if (question.type === 'fill_blank') return null;

  const opt = question.options[index];
  if (!opt) return null;

  return toggleOptionAnswer(question, answer, opt.letter);
}
