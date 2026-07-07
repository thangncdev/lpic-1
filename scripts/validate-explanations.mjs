import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const files = [
  { exam: '101', path: join(root, 'public/data/questions_101.json') },
  { exam: '102', path: join(root, 'public/data/questions_102.json') },
];

let hasMissing = false;

for (const { exam, path } of files) {
  const questions = JSON.parse(readFileSync(path, 'utf8'));
  const missing = questions.filter(
    (q) => !q.explanation || !String(q.explanation).trim(),
  );

  if (missing.length === 0) {
    console.log(`LPIC-${exam}: OK — ${questions.length}/${questions.length} explanations`);
  } else {
    hasMissing = true;
    console.log(
      `LPIC-${exam}: MISSING — ${missing.length}/${questions.length} without explanation`,
    );
    console.log(`  Numbers: ${missing.map((q) => q.number).join(', ')}`);
  }
}

process.exit(hasMissing ? 1 : 0);
