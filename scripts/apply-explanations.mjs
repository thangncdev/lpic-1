import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const exam = process.argv[2];
const explanationsPath = process.argv[3];

if (!exam || !explanationsPath) {
  console.error('Usage: node scripts/apply-explanations.mjs <101|102> <explanations.json>');
  process.exit(1);
}

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const questionsPath = join(root, `public/data/questions_${exam}.json`);

const questions = JSON.parse(readFileSync(questionsPath, 'utf8'));
const explanations = JSON.parse(readFileSync(explanationsPath, 'utf8'));

const byNumber = new Map(explanations.map((e) => [e.number, e.explanation]));

let applied = 0;
for (const q of questions) {
  const exp = byNumber.get(q.number);
  if (exp?.trim()) {
    q.explanation = exp.trim();
    applied++;
  }
}

writeFileSync(questionsPath, `${JSON.stringify(questions, null, 2)}\n`);
console.log(`Applied ${applied} explanations to questions_${exam}.json`);
