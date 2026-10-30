// Regression test: a deal.mjs run with the same arguments must keep giving the same hero and sections.
// The expected values were pinned on 2026-10-22 (notes compare-1 §4). A note that changes the deal pool
// updates them once, in the same commit, and says so in the CHANGELOG.
// Usage: node scripts/test/deal.test.mjs   (from anywhere)
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const deal = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'deal.mjs');
const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'figma-taste-deal-'));
const run = args => execFileSync(process.execPath, [deal, ...args], { cwd, encoding: 'utf8' });
// "Hero:  x" and "   1. role → composition" lines, per option
const picks = out => out.split('\n')
  .filter(l => /^Hero:|^ +\d+\. /.test(l))
  .map(l => l.replace(/\s+needs:.*$/, '').replace(/\s+/g, ' ').trim());

const cases = [
  ['editorial-grid, seed 1',
    ['--brief', 'arunika studio', '--sections', 'intro,work,services,about,contact', '--direction', 'editorial-grid', '--seed', '1'],
    ['Hero: hero-split-7-5', '1. intro → s-statement', '2. work → s-gallery-wall', '3. services → s-spec-table',
      '4. about → s-full-image', '5. contact → s-place', '6. footer → s-closing-simple']],
  ['quiet-luxury, seed 12',
    ['--brief', 'arunika studio', '--sections', 'intro,pricing,process,testimonial,cta', '--direction', 'quiet-luxury', '--seed', '12'],
    ['Hero: hero-full-bleed', '1. intro → s-big-figure', '2. pricing → s-index-list', '3. process → s-columns-text',
      '4. testimonial → s-statement', '5. cta → s-field-band', '6. footer → s-closing-simple']],
  ['warm-craft with --have, seed 5',
    ['--brief', 'kopi roastery', '--sections', 'story,products,process,location,contact', '--direction', 'warm-craft', '--have', 'photos,items,address', '--seed', '5'],
    ['Hero: hero-strip', '1. story → s-sticky-pair', '2. products → s-catalogue', '3. process → s-columns-text',
      '4. location → s-statement', '5. contact → s-spec-table', '6. footer → s-closing-simple']],
  ['--options-deal 3, seed 9',
    ['--brief', 'saas tool', '--sections', 'features,stats,pricing,faq,cta', '--options-deal', '3', '--seed', '9'],
    ['Hero: hero-offset-stack', '1. features → s-spec-table', '2. stats → s-big-figure', '3. pricing → s-index-list',
      '4. faq → s-questions', '5. cta → s-statement', '6. footer → s-close-name',
      'Hero: hero-split-7-5', '1. features → s-sticky-pair', '2. stats → s-big-figure', '3. pricing → s-spec-table',
      '4. faq → s-questions', '5. cta → s-field-band', '6. footer → s-closing-simple',
      'Hero: hero-strip', '1. features → s-split-media', '2. stats → s-big-figure', '3. pricing → s-spec-table',
      '4. faq → s-questions', '5. cta → s-statement', '6. footer → s-close-name']],
];

let ok = true;
for (const [label, args, expected] of cases) {
  const got = picks(run(args));
  const pass = JSON.stringify(got) === JSON.stringify(expected);
  if (!pass) { ok = false; console.log('  expected', expected, '\n  got     ', got); }
  console.log(pass ? 'PASS' : 'FAIL', label);
}
fs.rmSync(cwd, { recursive: true, force: true });
process.exitCode = ok ? 0 : 1;
