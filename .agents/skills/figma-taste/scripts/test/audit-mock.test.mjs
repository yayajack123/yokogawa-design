// Mock Figma environment for running audit.figma.js / audit.min.figma.js in Node.
// Regression test: runs audit.figma.js and audit.min.figma.js on a mock node tree and checks they agree.
// Usage: node scripts/test/audit-mock.test.mjs   (from the skill folder)
import fs from 'node:fs';
import path from 'node:path';

import { fileURLToPath } from 'node:url';
const scripts = process.argv[2] || path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const mixed = Symbol('mixed');
let nextId = 1;
const styles = new Map();
function style(name, size) { const id = `S:${nextId++}`; styles.set(id, { id, name, size }); return id; }
const H1 = style('Arunika/Heading/H1', 112);
const ST = style('Arunika/Statement', 40);
const SM = style('Arunika/Small/Default', 15);
const BD = style('Arunika/Body/Default', 20);

const LAYOUT = ['layoutMode', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight', 'itemSpacing', 'children', 'layoutGrids', 'findAll', 'findOne'];
const SIDES = ['strokeTopWeight', 'strokeRightWeight', 'strokeBottomWeight', 'strokeLeftWeight'];
const MISSING = { TEXT: [...LAYOUT, ...SIDES, 'cornerRadius'], ELLIPSE: [...LAYOUT, ...SIDES], RECTANGLE: LAYOUT };
function node(type, props = {}, children = []) {
  const n = {
    id: props.id || `${nextId++}:1`, type, name: props.name || type, visible: true,
    fills: [], strokes: [], effects: [], boundVariables: {}, annotations: [],
    layoutMode: 'NONE', paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0, itemSpacing: 0,
    x: 0, width: 100, height: 100, layoutSizingHorizontal: 'FIXED', ...props, children: [],
  };
  for (const c of children) { c.parent = n; n.children.push(c); }
  n.findAll = (fn = () => true) => { const out = []; const walk = m => { for (const c of kidsOf(m)) { if (fn(c)) out.push(c); walk(c); } }; walk(n); return out; };
  n.findOne = fn => n.findAll(fn)[0] || null;
  if (type === 'TEXT') {
    const st = styles.get(props.textStyleId);
    const size = props.fontSize || st?.size || 16;
    n.getStyledTextSegments = () => [{ fontName: { family: props.family || 'Switzer', style: 'Regular' }, fontSize: size,
      textCase: 'ORIGINAL', letterSpacing: { unit: 'PERCENT', value: 0 }, lineHeight: { unit: 'PERCENT', value: 100 } }];
    n.characters = props.characters || '';
  }
  // Figma throws when a node is asked for a property its type does not have (selftest, 2026-10-22:
  // "no such property 'strokeLeftWeight' on TEXT node"), and `in` reports it missing. Do the same here.
  const missing = MISSING[type];
  if (!missing) return n;
  for (const k of missing) if (!(k in props)) delete n[k];
  return new Proxy(n, {
    get(t, k, r) { if (missing.includes(k) && !(k in t)) throw new TypeError(`node.${String(k)}: no such property '${String(k)}' on ${type} node`); return Reflect.get(t, k, r); },
    has(t, k) { return missing.includes(k) && !(k in t) ? false : Reflect.has(t, k); },
  });
}
function kidsOf(m) { return m._kids || ('children' in m ? m.children : []); }
const bound = { color: { id: 'V:1' } };
const solid = { type: 'SOLID', color: { r: 0, g: 0, b: 0 }, boundVariables: bound };
const T = (chars, sid, p = {}) => node('TEXT', { characters: chars, textStyleId: sid, fills: [solid], ...p });
const IMG = { type: 'IMAGE', imageHash: 'h' };

// Root with a column grid, 1920 wide.
const sec = (name, kids, p = {}) => node('FRAME', { name, layoutMode: 'VERTICAL', paddingLeft: 60, paddingRight: 60,
  boundVariables: { paddingLeft: 1, paddingRight: 1, itemSpacing: 1 }, itemSpacing: 64, width: 1920, ...p }, kids);

// Component "Card": heading ABOVE a small label (not an eyebrow). Its instance children are new objects.
const card = node('INSTANCE', { name: 'Card', layoutMode: 'VERTICAL', mainComponent: { name: 'Card' } }, [
  T('Gedung kantor', H1, { height: 112 }), T('Lihat layanan', SM, { height: 18 }),
]);
// Instance quirk: parent.children returns fresh copies (different object identity, same ids)
Object.defineProperty(card, 'children', { get() { return this._kids.map(k => ({ ...k })); }, configurable: true });
card._kids = [];
{
  const kids = [T('Gedung kantor', H1, { height: 112 }), T('Lihat layanan', SM, { height: 18 })];
  for (const k of kids) k.parent = card;
  card._kids = kids;
  card.findAll = (fn = () => true) => kids.filter(fn);
  card.findOne = fn => card.findAll(fn)[0] || null;
}

const eyebrow = sec('Section/Services', [T('Our services', SM, { height: 18, x: 60 }), T('Layanan kami', H1, { height: 112, x: 60 })]);
const hero = sec('Section/Hero', [
  T('Membangun gedung komersial', H1, { height: 224, x: 60 }),                       // 2 lines: ok
  T('A large statement set at forty pixels runs three lines here.', ST, { height: 120, x: 60 }),   // 3 lines, Statement: exempt (4.1)
  node('FRAME', { name: 'Hero/Actions', layoutMode: 'HORIZONTAL', layoutSizingHorizontal: 'HUG', x: 60, width: 423, itemSpacing: 16, boundVariables: { itemSpacing: 1 } }, []),
  node('RECTANGLE', { name: 'image/hero', fills: [IMG], x: 60, width: 1800 }),
], { fills: [IMG] });
const split = sec('Section/Stats', [
  node('FRAME', { name: 'Stats/Row', layoutMode: 'HORIZONTAL', primaryAxisAlignItems: 'MIN', x: 60, width: 1800, itemSpacing: 30, boundVariables: { itemSpacing: 1 } }, [
    node('RECTANGLE', { name: 'image/a', fills: [IMG], x: 60, width: 1037.5 }),
    node('RECTANGLE', { name: 'image/b', fills: [IMG], x: 1127.5, width: 732.5 }),
  ]),
  T('© 2026 Arunika™', SM, { height: 18, x: 60 }),
  T('🚀 Launch', SM, { height: 18, x: 60 }),
  T('Body text', BD, { height: 30, x: 60 }),
]);
const badHead = sec('Section/Bad', [T('Unstyled headline that wraps over three lines', null, { fontSize: 56, height: 168, x: 60 }), card]);
const root = node('FRAME', { id: '1:1', name: 'Page/Desktop', layoutMode: 'VERTICAL', width: 1920, height: 4000,
  fills: [solid], layoutGrids: [{ pattern: 'COLUMNS', alignment: 'STRETCH', count: 12, gutterSize: 30, offset: 60, visible: true }] },
  [hero, eyebrow, split, badHead]);

// Roots 2–4 (notes compare-1): tells that each must or must not trigger.
// 2:1 cream ground + terracotta accent, every tell present; 3:1 white ground + the same accent, every
// counter-case; 4:1 cream ground + deep ink accent.
const rgb = hex => ({ r: parseInt(hex.slice(1, 3), 16) / 255, g: parseInt(hex.slice(3, 5), 16) / 255, b: parseInt(hex.slice(5, 7), 16) / 255 });
const paintOf = hex => ({ type: 'SOLID', color: rgb(hex), boundVariables: { color: { id: `V:${hex}` } } });
const CREAM = paintOf('#F4ECD8'), CLAY = paintOf('#C2643C'), WHITE = paintOf('#FFFFFF'), INK = paintOf('#1B2430');
const BTN = label => node('FRAME', { name: 'Button', layoutMode: 'HORIZONTAL', height: 48, x: 60 }, [T(label, SM, { height: 18, x: 60 })]);
const HEAD = (chars, align) => T(chars, H1, { height: 112, x: 60, textAlignHorizontal: align });
const CARD = (p = {}) => node('FRAME', { name: 'Tier', layoutMode: 'VERTICAL', fills: [INK], x: 60, ...p }, [T('Plan', BD, { height: 30, x: 60 })]);
const CELL = (p = {}) => node('FRAME', { name: 'Cell', layoutMode: 'VERTICAL', fills: [INK], x: 60, ...p }, [T('Cell', BD, { height: 30, x: 60 })]);
const tellsRoot = node('FRAME', { id: '2:1', name: 'Page/Tells', layoutMode: 'VERTICAL', width: 1920, height: 4000, fills: [CREAM] }, [
  sec('Section/Quote', [
    HEAD('Kata klien', 'CENTER'),
    node('FRAME', { name: 'Quote/Card', layoutMode: 'HORIZONTAL', height: 120, x: 60 }, [
      node('RECTANGLE', { name: 'Quote/Bar', width: 4, height: 120, x: 60, fills: [CLAY] }), T('A quote', BD, { height: 30, x: 90 })]),
    node('FRAME', { name: 'Status', layoutMode: 'HORIZONTAL', height: 18, x: 60 }, [
      node('ELLIPSE', { name: 'Dot', width: 8, height: 8, x: 60, fills: [INK] }), T('Available now', SM, { height: 18, x: 76 })]),
    T('Jakarta 14:32 WIB', SM, { height: 18, x: 60 }),
    T('6.2°S, 106.8°E', SM, { height: 18, x: 60 }),
    T('Studio · Jakarta · Est. 2019', SM, { height: 18, x: 60 }),
    node('FRAME', { name: 'Actions', layoutMode: 'HORIZONTAL', x: 60 }, [BTN('Start →'), BTN('Read more →'), BTN('Contact →')]),
  ]),
  sec('Section/Pricing', [HEAD('Harga', 'CENTER'),
    node('FRAME', { name: 'Pricing/Row', layoutMode: 'HORIZONTAL', x: 60 }, [CARD(), CARD({ fills: [CLAY] }), CARD()])]),
  sec('Section/Work', [HEAD('Karya', 'CENTER'), HEAD('Proyek', 'LEFT'),
    node('FRAME', { name: 'Work/Bento', layoutMode: 'GRID', x: 60 }, [CELL({ gridColumnSpan: 2 }), CELL(), CELL(), CELL({ gridRowSpan: 2 })])]),
  sec('Section/Cards', [HEAD('Layanan', 'CENTER'),
    ...[1, 2, 3, 4, 5].map(i => node('RECTANGLE', { name: `Card/${i}`, cornerRadius: 16, fills: [INK], x: 60 }))]),
]);
const plainRoot = node('FRAME', { id: '3:1', name: 'Page/Plain', layoutMode: 'VERTICAL', width: 1920, height: 4000, fills: [WHITE] }, [
  sec('Section/Quote', [
    HEAD('Kata klien', 'CENTER'),
    node('FRAME', { name: 'Row/Middle', layoutMode: 'HORIZONTAL', height: 120, x: 60 }, [
      T('Left', BD, { height: 30, x: 60 }), node('RECTANGLE', { name: 'Row/Divider', width: 4, height: 120, x: 400, fills: [CLAY] }), T('Right', BD, { height: 30, x: 500 })]),
    node('FRAME', { name: 'Toggle', layoutMode: 'HORIZONTAL', height: 18, x: 60 }, [
      node('ELLIPSE', { name: 'Knob', width: 8, height: 8, x: 60, fills: [INK] }), T('On', SM, { height: 18, x: 76 })]),
    T('Mon–Fri 09:00–17:00', SM, { height: 18, x: 60 }),
    node('FRAME', { name: 'Actions', layoutMode: 'HORIZONTAL', x: 60 }, [BTN('Start →'), BTN('Read more'), BTN('Contact')]),
  ]),
  sec('Section/Pricing', [HEAD('Harga', 'LEFT'),
    node('FRAME', { name: 'Pricing/Row', layoutMode: 'HORIZONTAL', x: 60 }, [CARD(), CARD(), CARD()])]),
  sec('Section/Work', [HEAD('Karya', 'LEFT'), HEAD('Proyek', 'LEFT'),
    node('FRAME', { name: 'Work/Gallery', layoutMode: 'GRID', x: 60 }, [1, 2, 3, 4].map(i => node('RECTANGLE', { name: `image/${i}`, fills: [IMG], x: 60 })))]),
  sec('Section/Cards', [HEAD('Layanan', 'CENTER'),
    ...[1, 2, 3, 4, 5].map(i => node('RECTANGLE', { name: `Card/${i}`, cornerRadius: 999, fills: [INK], x: 60 }))]),
]);
const inkRoot = node('FRAME', { id: '4:1', name: 'Page/Ink', layoutMode: 'VERTICAL', width: 1920, height: 4000, fills: [CREAM] }, [
  T('A text layer straight under the page wrapper', BD, { height: 30, x: 60 }),
  sec('Section/Intro', [HEAD('Halo', 'LEFT'), node('RECTANGLE', { name: 'Accent', fills: [INK], x: 60 })]),
]);
const page = node('PAGE', { id: '0:1', name: 'Page' }, [root, tellsRoot, plainRoot, inkRoot]);
// absolute x: children already carry page-absolute x; give everything an absoluteTransform
const setAbs = n => { n.absoluteTransform = [[1, 0, n.x || 0], [0, 1, 0]]; for (const c of kidsOf(n)) setAbs(c); };
setAbs(page);
const byId = new Map(); const index = n => { byId.set(n.id, n); for (const c of kidsOf(n)) index(c); }; index(page);

const figma = {
  mixed, currentPage: page,
  async getNodeByIdAsync(id) { return byId.get(id) || null; },
  async getStyleByIdAsync(id) { return styles.get(id) || null; },
  async setCurrentPageAsync(p) { figma.currentPage = p; },
};

async function run(file) {
  let code = fs.readFileSync(path.join(scripts, file), 'utf8').replace("['ROOT_ID']", "['1:1', '2:1', '3:1', '4:1']");
  const fn = new (Object.getPrototypeOf(async function () {}).constructor)('figma', code);
  return fn(figma);
}
const full = await run('audit.figma.js');
const min = await run('audit.min.figma.js');
const label = f => { const n = byId.get(f.id); return n && n.type === 'TEXT' ? n.characters : f.name; };
const rules = r => r.results[0].fails.map(f => `${f.rule}:${label(f)}`).sort();
const wrules = r => r.results[0].warns.map(f => `${f.rule}:${label(f)}`).sort();
const same = JSON.stringify(full) === JSON.stringify(min);
console.log('full == min (whole result):', same);
if (!same) { console.log('FULL', JSON.stringify(full).slice(0, 1500)); console.log('MIN ', JSON.stringify(min).slice(0, 1500)); }
console.log('fails:', rules(full));
console.log('warns:', wrules(full));
const has = (r, x) => rules(full).includes(`${r}:${x}`) || wrules(full).includes(`${r}:${x}`);
const expect = [
  ['eyebrow on "Our services" (label above heading)', has('eyebrow', 'Our services')],
  ['no eyebrow inside the instance (label below heading, 2.1)', !rules(full).some(x => x === 'eyebrow:Lihat layanan')],
  ['Statement 3 lines is NOT a headline fail (4.1)', !rules(full).some(x => x.startsWith('headline-lines:A large statement'))],
  ['unstyled 56px 3-line text IS a headline fail', rules(full).some(x => x.startsWith('headline-lines:Unstyled'))],
  ['hug-width Hero/Actions: no right-edge off-grid (4.3)', !wrules(full).some(x => x === 'off-grid:Hero/Actions')],
  ['7+5 split on grid: no off-grid for image/a, image/b', !wrules(full).some(x => /off-grid:image\/(a|b)/.test(x))],
  ['© ™ pass, 🚀 fails (2.2)', has('emoji', '🚀 Launch') && !has('emoji', '© 2026 Arunika™')],
];
// compare-1: rule names found per root (fails and warns), with the node label
const found = i => [...full.results[i].fails, ...full.results[i].warns].map(f => `${f.rule}:${label(f)}`);
const on = (i, rule, x) => found(i).includes(x === undefined ? rule : `${rule}:${x}`) || (x === undefined && found(i).some(f => f.startsWith(`${rule}:`)));
const off = (i, rule) => !found(i).some(f => f.startsWith(`${rule}:`));
expect.push(
  ['§1 cream ground + terracotta accent fails assistant-palette', on(1, 'assistant-palette')],
  ['§1 white ground + terracotta accent passes', off(2, 'assistant-palette')],
  ['§1 cream ground + deep ink accent passes', off(3, 'assistant-palette')],
  ['§2.1 4×120 bar at the left edge of a card warns left-stripe', on(1, 'left-stripe', 'Quote/Bar')],
  ['§2.1 4×120 rectangle in the middle of a row does not', off(2, 'left-stripe')],
  ['§2.2 8×8 dot beside a label warns status-dot', on(1, 'status-dot', 'Dot')],
  ['§2.2 the same dot inside Toggle does not', off(2, 'status-dot')],
  ['§2.3 three buttons all ending in → warn button-arrows', on(1, 'button-arrows')],
  ['§2.3 three buttons, one arrow, do not', off(2, 'button-arrows')],
  ['§2.4 five cards at radius 16 warn soft-radius', on(1, 'soft-radius')],
  ['§2.4 five cards at radius 999 do not', off(2, 'soft-radius')],
  ['§2.5 four of five headings centred warn all-centred', on(1, 'all-centred')],
  ['§2.5 two of five centred do not', off(2, 'all-centred')],
  ['§3.1 one differently filled tier warns popular-tier', on(1, 'popular-tier', 'Tier')],
  ['§3.1 three equal tiers do not', off(2, 'popular-tier')],
  ['§3.3 filled cells in mixed spans warn bento', on(1, 'bento', 'Work/Bento')],
  ['§3.3 image cells in equal spans do not', off(2, 'bento')],
  ['§5 "Jakarta 14:32 WIB" warns micro-meta', on(1, 'micro-meta', 'Jakarta 14:32 WIB')],
  ['§5 "6.2°S, 106.8°E" warns micro-meta', on(1, 'micro-meta', '6.2°S, 106.8°E')],
  ['§5 three middle-dot fragments warn micro-meta', on(1, 'micro-meta', 'Studio · Jakarta · Est. 2019')],
  ['§5 "Mon–Fri 09:00–17:00" does not', off(2, 'micro-meta')],
  ['a TEXT as the first child of the page: no crash, fails no-title', on(3, 'no-title')],
  ['compare-1 tells do not touch the Arunika root', ['assistant-palette', 'left-stripe', 'status-dot', 'button-arrows', 'soft-radius', 'all-centred', 'popular-tier', 'bento', 'micro-meta'].every(r => off(0, r))],
);
for (const [label, ok] of expect) console.log(ok ? 'PASS' : 'FAIL', label);
process.exitCode = expect.every(e => e[1]) && same ? 0 : 1;
