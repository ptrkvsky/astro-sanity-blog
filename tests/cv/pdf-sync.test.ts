import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';

const DATA_FILES = [
  'src/features/cv/data/cv.ts',
  'src/features/cv/data/publishable.ts',
  'src/config/person.ts',
];

describe('PDF du CV', () => {
  it('existe', () => {
    expect(existsSync('public/cv/johan-petrikovsky-cv-lead-frontend.pdf')).toBe(true);
  });

  it('est à jour par rapport aux données (relancer pnpm cv:pdf sinon)', () => {
    const hash = createHash('sha256');
    DATA_FILES.forEach((file) => hash.update(readFileSync(file)));
    const meta = JSON.parse(readFileSync('public/cv/cv.meta.json', 'utf8'));
    expect(meta.dataHash).toBe(hash.digest('hex'));
  });
});
