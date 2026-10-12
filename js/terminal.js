(() => {
'use strict';

/* ════════════════════ Utilities ════════════════════ */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const norm = s => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
const clen = s => [...String(s)].length;
const pick = a => a[Math.floor(Math.random() * a.length)];
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const num = s => { const m = String(s ?? '').replace(',', '.').match(/-?\d+(\.\d+)?/); return m ? parseFloat(m[0]) : null; };
const BL = '<div> </div>';
// A terminal only wraps at spaces: stop the browser from breaking lines at hyphens (rm -rf, --model…).
const nb = h => String(h).replace(/[^\s<>*_~`()\[\]\u0001\u0002]*-[^\s<>*_~`()\[\]\u0001\u0002]*/g, m => `<span class="nw">${m}</span>`);

/* ════════════════════ Claude Code constants ════════════════════ */
const VERBS = ['Accomplishing','Actioning','Actualizing','Baking','Booping','Brewing','Calculating','Cerebrating','Channelling','Churning','Clauding','Coalescing','Cogitating','Combobulating','Computing','Concocting','Conjuring','Considering','Contemplating','Cooking','Crafting','Creating','Crunching','Deciphering','Deliberating','Determining','Discombobulating','Divining','Doing','Effecting','Elucidating','Enchanting','Envisioning','Finagling','Flibbertigibbeting','Forging','Forming','Frolicking','Generating','Germinating','Hatching','Herding','Honking','Hustling','Ideating','Imagining','Incubating','Inferring','Jiving','Manifesting','Marinating','Meandering','Moseying','Mulling','Mustering','Musing','Noodling','Percolating','Perusing','Philosophising','Pondering','Pontificating','Processing','Puttering','Puzzling','Reticulating','Ruminating','Scheming','Schlepping','Shimmying','Shucking','Simmering','Smooshing','Spelunking','Spinning','Stewing','Sussing','Synthesizing','Thinking','Tinkering','Transmuting','Unfurling','Unravelling','Vibing','Wandering','Whirring','Wibbling','Wizarding','Working','Wrangling'];
const DONE_VERBS = ['Baked','Brewed','Churned','Cogitated','Cooked','Crunched','Sautéed','Worked'];
const FRAMES = { win: ['·','✢','*','✶','✻','✽'], mac: ['·','✢','✳','✶','✻','✽'] };
const RAINBOW = ['rgb(235,95,87)','rgb(245,139,87)','rgb(250,195,95)','rgb(145,200,130)','rgb(130,170,220)','rgb(155,130,200)','rgb(200,130,180)'];
const EFFORTS = ['low','medium','high','xhigh','max','ultracode'];
const EFFORT_ICON = { low: '○', medium: '◔', high: '◑', xhigh: '◕', max: '●', ultracode: '✦' };
const EFFORT_LABEL = { low: 'Low effort', medium: 'Medium effort', high: 'High effort', xhigh: 'Extra high effort', max: 'Max effort', ultracode: 'Ultracode' };
const EFFORT_DELAY = { low: 1300, medium: 2400, high: 3600, xhigh: 4800, max: 6000, ultracode: 8000 };
const EFFORT_ALIAS = { bajo:'low', baja:'low', low:'low', minimo:'low', medio:'medium', media:'medium', medium:'medium', normal:'medium', alto:'high', alta:'high', high:'high', xhigh:'xhigh', extra:'xhigh', muyalto:'xhigh', altisimo:'xhigh', max:'max', maximo:'max', maxima:'max', maximum:'max', ultracode:'ultracode', ultra:'ultracode' };
const normEff = q => norm(q).replace(/muy\s+alt[oa]/g, 'muyalto').replace(/extra\s+high/g, 'xhigh');
const MODE_ALIAS = { normal:'normal', default:'normal', plan:'plan', edits:'edits', edit:'edits', aceptar:'edits', accept:'edits', 'accept-edits':'edits', bypass:'bypass', yolo:'bypass' };
const SLASH = [
  ['/add-dir','Add a new working directory'],
  ['/agents','Manage agent configurations'],
  ['/clear','Clear conversation history and free up context'],
  ['/compact','Clear conversation history but keep a summary in context. Optional: /compact [instructions for summarization]'],
  ['/config','Open config panel'],
  ['/context','Visualize current context usage as a colored grid'],
  ['/cost','Show the total cost and duration of the current session'],
  ['/doctor','Diagnose and verify your Claude Code installation and settings'],
  ['/effort','Set effort level for model usage'],
  ['/exit','Exit the REPL'],
  ['/export','Export the current conversation to a file or clipboard'],
  ['/help','Show help and available commands'],
  ['/init','Initialize a new CLAUDE.md file with codebase documentation'],
  ['/login','Sign in with your Anthropic account'],
  ['/logout','Sign out from your Anthropic account'],
  ['/mcp','Manage MCP servers'],
  ['/memory','Edit Claude memory files'],
  ['/model','Set the AI model for Claude Code'],
  ['/permissions','Manage allow & deny tool permission rules'],
  ['/resume','Resume a conversation'],
  ['/review','Review a pull request'],
  ['/status','Show Claude Code status including version, model, account, API connectivity, and tool statuses'],
  ['/usage','Show plan usage limits'],
];
const PS_ICON = '<svg width="16" height="16" viewBox="0 0 16 16"><rect x="1" y="2" width="14" height="12" rx="2.2" fill="#2671be"/><path d="M4.2 5.6l3 2.4-3 2.4" stroke="#fff" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.3 10.6h3.6" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/></svg>';
const IC_X_SMALL = '<svg width="9" height="9" viewBox="0 0 10 10"><path d="M1 1l8 8M9 1L1 9" stroke="currentColor" stroke-width="1.2"/></svg>';
const IC_PLUS = '<svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 1v10M1 6h10" stroke="currentColor" stroke-width="1.1"/></svg>';
const IC_CHEV = '<svg width="10" height="10" viewBox="0 0 10 10"><path d="M1.5 3.5L5 7l3.5-3.5" stroke="currentColor" stroke-width="1.1" fill="none"/></svg>';
const IC_MIN = '<svg width="10" height="10" viewBox="0 0 10 10"><path d="M0 5.5h10" stroke="currentColor" stroke-width="1"/></svg>';
const IC_MAX = '<svg width="10" height="10" viewBox="0 0 10 10"><rect x=".5" y=".5" width="9" height="9" rx="1.6" fill="none" stroke="currentColor"/></svg>';
const IC_CLOSE = '<svg width="10" height="10" viewBox="0 0 10 10"><path d="M.5.5l9 9M9.5.5l-9 9" stroke="currentColor" stroke-width="1"/></svg>';

/* ════════════════════ Settings ════════════════════ */
const THEMES = {
  wt:      { bg: '#0C0C0C', fg: '#CCCCCC' },
  vscode:  { bg: '#181818', fg: '#CCCCCC' },
  mac:     { bg: '#1E1E1E', fg: '#FFFFFF' },
  iterm:   { bg: '#000000', fg: '#C7C7C7' },
  ghostty: { bg: '#282C34', fg: '#FFFFFF' },
  light:   { bg: '#FFFFFF', fg: '#1F1F1F' },
};
const DEFAULT_MODELS = [
  'default | Default (recommended) | Opus 5.5 | Most capable for complex work | si',
  'sonnet | Sonnet | Sonnet 5.5 | Best for everyday tasks | si',
  'haiku | Haiku | Haiku 5.5 | Fastest for quick answers | no',
].join('\n');
const DEF = {
  mode: 'magic', theme: 'wt', bg: '#0C0C0C', fg: '#CCCCCC', font: 'Cascadia Mono', fontSize: 16, pad: 8,
  frame: 'none', welcome: 'full', platform: 'win', promptChar: '>', version: '2.1.98',
  shellLine: true, userBg: true, thinkingExpanded: false, workedFor: false,
  statusline: false, statusTpl: '{model} · {effortIcon} {effort} effort',
  speed: 1, typeCps: 14, reveal: 'block', streamCps: 240, charsPerKey: 1, startDelay: 1,
  hideMouse: true, toasts: true, models: DEFAULT_MODELS,
};
const LS_S = 'ccsim.settings.v1', LS_SCRIPT = 'ccsim.script.v1';
const lsGet = k => { try { return localStorage.getItem(k); } catch { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, v); } catch {} };
let S = Object.assign({}, DEF, (() => { try { return JSON.parse(lsGet(LS_S) || '{}'); } catch { return {}; } })());
const saveS = () => lsSet(LS_S, JSON.stringify(S));
const EXAMPLE = (window.EXAMPLE_SCRIPT || '').replace(/^\s*\n/, ''); // js/example-script.js
const storedScript = lsGet(LS_SCRIPT);
const firstRun = storedScript == null;
// An old built-in example saved in the browser is replaced by the current one; a script you wrote is kept.
const isOldExample = t => (/GUION DE EJEMPLO/.test(t || '') && /agujeros negros/i.test(t || '')) || (/CLAUDE SIMULATOR · EXAMPLE SCRIPT/.test(t || '') && /^(@user: Alex|user: ultrathink .*|\[title Physics rescue attempt\])$/m.test(t || ''));
let SCRIPT = storedScript && storedScript.trim() && !isOldExample(storedScript) ? storedScript : EXAMPLE;
if (storedScript && isOldExample(storedScript)) lsSet(LS_SCRIPT, EXAMPLE);

let MODELS = [];
function parseModels(txt) {
  const out = String(txt || '').split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('//')).map(l => {
    const p = l.split('|').map(x => x.trim());
    return { alias: norm(p[0]), label: p[1] || p[2] || p[0], name: p[2] || p[1] || p[0], desc: p[3] || '', effort: /^(s|si|y|yes|true|1)$/.test(norm(p[4] || '')) };
  });
  return out.length ? out : parseModels(DEFAULT_MODELS);
}
function findModel(q) {
  q = norm(q).replace(/\s+/g, ' ');
  if (!q) return null;
  return MODELS.find(m => m.alias === q) || MODELS.find(m => norm(m.name) === q) || MODELS.find(m => norm(m.label) === q)
    || MODELS.find(m => norm(m.name).includes(q)) || MODELS.find(m => norm(m.label).includes(q)) || MODELS.find(m => m.alias && m.alias.includes(q)) || null;
}
function parseEffort(q) {
  for (const w of normEff(q).split(/[\s,;]+/)) if (EFFORT_ALIAS[w]) return EFFORT_ALIAS[w];
  return null;
}
function parseTarget(h) {
  const r = { model: null, effort: null };
  const rest = [];
  for (const w of normEff(h).split(/[\s,;]+/).filter(Boolean)) {
    if (EFFORT_ALIAS[w] && !r.effort) r.effort = EFFORT_ALIAS[w]; else rest.push(w);
  }
  if (rest.length) r.model = findModel(rest.join(' ')) || findModel(rest[0]);
  return r;
}

/* ════════════════════ Script parser ════════════════════ */
const BLOCKS = {
  yo: 'user', user: 'user', usuario: 'user', humano: 'user', human: 'user',
  claude: 'claude', assistant: 'claude', asistente: 'claude',
  razonamiento: 'reasoning', pensamiento: 'reasoning', thinking: 'reasoning', reasoning: 'reasoning',
  tool: 'tool', herramienta: 'tool', 'tool-error': 'toolerr', 'herramienta-error': 'toolerr', toolerror: 'toolerr',
  editar: 'edit', edit: 'edit', tareas: 'todos', todos: 'todos', todo: 'todos', permiso: 'perm', permission: 'perm',
};
const DIRS = {
  pensar: a => { const m = a.match(/^\s*(\d+(?:[.,]\d+)?)\s*(?:s|seg|segundos|sec)?\b\s*(.*)$/i); return m ? { t: 'think', secs: parseFloat(m[1].replace(',', '.')), verb: m[2].trim() || null } : { t: 'think', secs: null, verb: a.trim() || null }; },
  pausa: a => ({ t: 'pause', secs: num(a) ?? 1 }),
  modo: a => ({ t: 'mode', mode: MODE_ALIAS[norm(a)] || 'normal' }),
  contexto: a => ({ t: 'context', pct: num(a) }),
  titulo: a => ({ t: 'title', text: a.trim() }),
  error: a => ({ t: 'error', text: a.trim() }),
  info: a => ({ t: 'info', text: a }),
  interrumpir: () => ({ t: 'interrupt' }),
  limpiar: () => ({ t: 'clear' }),
  compactar: () => ({ t: 'compact' }),
  elegir: a => ({ t: 'choose', n: Math.max(1, Math.min(3, num(a) || 1)) }),
  detalle: () => ({ t: 'detail' }),
  tokens: a => ({ t: 'tokens', n: parseTokens(a) }),
};
const DIR_ALIAS = {
  pensar:'pensar', piensa:'pensar', pensando:'pensar', think:'pensar', thinking:'pensar',
  pausa:'pausa', pause:'pausa', espera:'pausa', esperar:'pausa', wait:'pausa',
  modo:'modo', mode:'modo', contexto:'contexto', context:'contexto', titulo:'titulo', title:'titulo',
  error:'error', info:'info', salida:'info', nota:'info',
  interrumpir:'interrumpir', interrupt:'interrumpir', esc:'interrumpir',
  limpiar:'limpiar', clear:'limpiar', compactar:'compactar', compact:'compactar',
  elegir:'elegir', opcion:'elegir', choose:'elegir', detalle:'detalle', 'ctrl+o':'detalle', detail:'detalle', tokens:'tokens', token:'tokens', gasto:'tokens', consumo:'tokens',
};
const TURN = new Set(['claude','reasoning','tool','toolerr','edit','todos','perm','error','interrupt','think']);
const INTURN = new Set(['pause','mode','context','title','info','detail','tokens']);
// "3.5M", "3,5 millones", "800k", "1200000" → number of tokens
function parseTokens(a) {
  const t = norm(a).replace(/\s+/g, '');
  const m = t.match(/(\d+(?:[.,]\d+)?)(millones|millon|billones|mil|mm|m|k|b)?/);
  if (!m) return 0;
  const v = parseFloat(m[1].replace(',', '.'));
  const mult = { k: 1e3, mil: 1e3, m: 1e6, mm: 1e6, millones: 1e6, millon: 1e6, b: 1e9, billones: 1e9 }[m[2]] || 1;
  return Math.round(v * mult);
}
// Finds a [tokens] directive inside the turn starting at pc (including loose directives at the end of the turn).
function turnTokens(steps, pc) {
  for (let j = pc; j < steps.length && (TURN.has(steps[j].t) || INTURN.has(steps[j].t)); j++) if (steps[j].t === 'tokens') return steps[j].n;
  return 0;
}

function trimBlank(arr) {
  let a = 0, b = arr.length;
  while (a < b && !arr[a].trim()) a++;
  while (b > a && !arr[b - 1].trim()) b--;
  return arr.slice(a, b);
}
function parseCall(h) {
  h = String(h || '').trim();
  const m = h.match(/^([^(]+?)\s*\(([\s\S]*)\)\s*$/);
  return m ? { name: m[1].trim(), args: m[2] } : { name: h || 'Tool', args: null };
}
function parseDiff(lines) {
  let start = 1; const out = [];
  for (const l of lines) {
    const m = l.match(/^@@\s*(\d+)/);
    if (m) { if (!out.length) start = parseInt(m[1], 10); continue; }
    if (l.startsWith('+')) out.push({ s: '+', text: l.slice(1).replace(/^ /, '') });
    else if (l.startsWith('-')) out.push({ s: '-', text: l.slice(1).replace(/^ /, '') });
    else out.push({ s: ' ', text: l.replace(/^ /, '') });
  }
  let o = start, n = start;
  for (const d of out) {
    if (d.s === ' ') { d.n = n; o++; n++; }
    else if (d.s === '-') { d.n = o; o++; }
    else { d.n = n; n++; }
  }
  return out;
}
function parseTodo(l) {
  const m = l.match(/^\s*(?:[-*]\s*)?\[(.?)\]\s*(.*)$/);
  if (!m) return { s: 'pending', text: l.trim() };
  const k = m[1].toLowerCase();
  return { s: /[x✓✔]/.test(k) ? 'done' : /[>~\-/]/.test(k) ? 'progress' : 'pending', text: m[2] };
}
function finalize(c) {
  const all = trimBlank([c.head, ...c.lines]);
  switch (c.t) {
    case 'user': {
      let hidden = null;
      const text = all.join('\n').replace(/\{([^}]*)\}/g, (_, h) => { hidden = (hidden ? hidden + ' ' : '') + h; return ''; }).replace(/[ \t]+$/gm, '').trim();
      return { t: 'user', text, hidden, line: c.line };
    }
    case 'claude': return { t: 'claude', md: all.join('\n'), line: c.line };
    case 'reasoning': {
      // Optional: "reasoning: [Title] text" (the title is only used by the Desktop version)
      let text = all.join('\n'), title = null;
      const m = text.match(/^\s*\[([^\]\n]+)\]\s*/);
      if (m) { title = m[1].trim(); text = text.slice(m[0].length); }
      return { t: 'reasoning', text, title, line: c.line };
    }
    case 'tool': case 'toolerr': { const { name, args } = parseCall(c.head); return { t: c.t, name, args, out: trimBlank(c.lines), line: c.line }; }
    case 'perm': {
      let head = c.head.trim(), desc = '';
      const m = head.match(/^(.*\))\s*\|\s*(.*)$/);
      if (m) { head = m[1]; desc = m[2]; }
      else { const i = head.indexOf('|'); if (i >= 0) { desc = head.slice(i + 1).trim(); head = head.slice(0, i).trim(); } }
      const { name, args } = parseCall(head);
      return { t: 'perm', name, args, desc, out: trimBlank(c.lines), choice: 1, line: c.line };
    }
    case 'edit': return { t: 'edit', file: c.head.trim() || 'file.txt', diff: parseDiff(trimBlank(c.lines)), line: c.line };
    case 'todos': return { t: 'todos', items: all.filter(l => l.trim()).map(parseTodo), line: c.line };
  }
  return null;
}
function compile(src) {
  const lines = String(src || '').replace(/\r\n?/g, '\n').split('\n');
  const steps = [], hdr = {}, warn = [];
  let cur = null, fence = false;
  const flush = () => { if (cur) { const s = finalize(cur); if (s) steps.push(s); cur = null; } fence = false; };
  for (let n = 0; n < lines.length; n++) {
    const raw = lines[n];
    if (cur && (cur.t === 'claude' || cur.t === 'reasoning')) {
      if (/^\s*(```|~~~)/.test(raw)) { fence = !fence; cur.lines.push(raw); continue; }
      if (fence) { cur.lines.push(raw); continue; }
    }
    if (/^\/\//.test(raw)) continue;
    let m;
    if ((m = raw.match(/^@\s*([^:\s]+)\s*:\s*(.*)$/))) { flush(); hdr[norm(m[1])] = m[2].trim(); continue; }
    if ((m = raw.match(/^\[\s*([^\s\]]+)\s*(.*?)\s*\]\s*$/)) && DIR_ALIAS[norm(m[1])]) {
      flush(); steps.push(Object.assign(DIRS[DIR_ALIAS[norm(m[1])]](m[2]), { line: n + 1 })); continue;
    }
    if ((m = raw.match(/^([A-Za-zÁÉÍÓÚÜÑáéíóúüñ][A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9_-]*)\s*:(.*)$/)) && BLOCKS[norm(m[1])]) {
      flush(); cur = { t: BLOCKS[norm(m[1])], head: m[2].replace(/^\s+/, ''), lines: [], line: n + 1 }; continue;
    }
    if (/^\/(model|effort|clear|compact)\b/i.test(raw) && (!cur || cur.t === 'user')) {
      flush(); cur = { t: 'user', head: raw.trim(), lines: [], line: n + 1 }; continue;
    }
    if (cur) cur.lines.push(raw);
    else if (raw.trim()) warn.push(`Line ${n + 1}: text outside a block (missing "user:" or "claude:"?)`);
  }
  flush();
  const out = [];
  // A session is named once (@title or its first [title]) and keeps that name; /clear starts a new one.
  let titled = !!(hdr.titulo || hdr.title);
  for (const s of steps) {
    if (s.t === 'choose') {
      const p = [...out].reverse().find(x => x.t === 'perm');
      if (p) p.choice = s.n; else warn.push(`Line ${s.line}: [choose] without a "permission:" before it`);
      continue;
    }
    if (s.t === 'clear' || (s.t === 'user' && /^\/clear\b/i.test(s.text))) titled = false;
    else if (s.t === 'title') {
      if (titled) { warn.push(`Line ${s.line}: [title] ignored: the session already has a title (it never changes; /clear starts a new session)`); continue; }
      titled = true;
    }
    out.push(s);
  }
  return { steps: out, hdr, warn };
}

/* ════════════════════ Claude Code-style Markdown ════════════════════ */
const KW = new Set('const let var function return if else for while do switch case break continue new class extends import from export default async await try catch finally throw typeof instanceof in of def lambda pass elif and or not is None True False self public private protected static void int float double bool boolean string struct enum interface type fn mut pub use impl match null undefined true false this yield with as package func go defer chan map range echo fi then done esac print'.split(' '));
const HASH_LANGS = new Set(['py','python','sh','bash','shell','zsh','rb','ruby','yaml','yml','toml','r','perl','pl','ps1','powershell','dockerfile','make','makefile','conf','ini']);
const HL_RE = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)(?=\s*\()|([A-Za-z_$][\w$]*)/g;
const HL_RE_HASH = /(#[^\n]*)|("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)(?=\s*\()|([A-Za-z_$][\w$]*)/g;
function highlight(code, lang) {
  const re = HASH_LANGS.has(String(lang || '').toLowerCase()) ? HL_RE_HASH : HL_RE;
  re.lastIndex = 0;
  let out = '', last = 0, m;
  while ((m = re.exec(code))) {
    out += esc(code.slice(last, m.index));
    const t = m[0];
    if (m[1]) out += `<span class="hl-com">${esc(t)}</span>`;
    else if (m[2]) out += `<span class="hl-str">${esc(t)}</span>`;
    else if (m[3]) out += `<span class="hl-num">${esc(t)}</span>`;
    else if (m[4]) out += `<span class="${KW.has(t) ? 'hl-kw' : 'hl-fn'}">${esc(t)}</span>`;
    else out += KW.has(t) ? `<span class="hl-kw">${esc(t)}</span>` : /^[A-Z]/.test(t) ? `<span class="hl-type">${esc(t)}</span>` : esc(t);
    last = re.lastIndex;
  }
  return out + esc(code.slice(last));
}
function inline(s) {
  s = String(s ?? '');
  const codes = [];
  s = s.replace(/`([^`\n]+)`/g, (_, c) => { codes.push(c); return '\u0001' + (codes.length - 1) + '\u0002'; });
  s = nb(esc(s));
  s = s.replace(/\*\*(?=\S)([\s\S]*?\S)\*\*/g, '<b>$1</b>').replace(/__(?=\S)([\s\S]*?\S)__/g, '<b>$1</b>');
  s = s.replace(/(^|[^*\w])\*(?=\S)([^*\n]*?\S)\*(?!\*)/g, '$1<i>$2</i>');
  s = s.replace(/(^|[^\w])_(?=\S)([^_\n]*?\S)_(?!\w)/g, '$1<i>$2</i>');
  s = s.replace(/~~(?=\S)([\s\S]*?\S)~~/g, '<s>$1</s>');
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<span class="u">$1</span>');
  s = s.replace(/\u0001(\d+)\u0002/g, (_, n) => `<span class="c-perm">${esc(codes[+n])}</span>`);
  return s;
}
const stripMd = s => String(s ?? '').replace(/`([^`]+)`/g, '$1').replace(/\*\*(.+?)\*\*/g, '$1').replace(/__(.+?)__/g, '$1')
  .replace(/(^|[^*\w])\*(\S[^*]*?)\*/g, '$1$2').replace(/~~(.+?)~~/g, '$1').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
const splitRow = l => { let s = l.trim(); if (s.startsWith('|')) s = s.slice(1); if (s.endsWith('|')) s = s.slice(0, -1); return s.split('|').map(x => x.trim()); };
const TABLE_SEP = /^\s*\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)*\|?\s*$/;
const LIST_RE = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/;
const HR_RE = /^\s*([-*_])(\s*\1){2,}\s*$/;
const isTableAt = (lines, i) => lines[i].includes('|') && i + 1 < lines.length && lines[i + 1].includes('|') && TABLE_SEP.test(lines[i + 1]);
const isBlockStart = (lines, i) => /^\s*(```|~~~)/.test(lines[i]) || /^#{1,6}\s/.test(lines[i]) || LIST_RE.test(lines[i]) || /^\s*>/.test(lines[i]) || HR_RE.test(lines[i]) || isTableAt(lines, i);

function tableHTML(rows, aligns) {
  const ncol = Math.max(...rows.map(r => r.length));
  const w = Array.from({ length: ncol }, (_, c) => Math.max(3, ...rows.map(r => clen(stripMd(r[c] || '')))));
  const line = (l, m, r) => l + w.map(x => '─'.repeat(x + 2)).join(m) + r;
  const rowh = (r, hdr) => '│' + w.map((x, c) => {
    const cell = r[c] || '', d = x - clen(stripMd(cell)), al = aligns[c];
    let L = 1, R = 1 + d;
    if (al === 'right') { L = 1 + d; R = 1; }
    else if (al === 'center') { L = 1 + Math.floor(d / 2); R = 1 + d - Math.floor(d / 2); }
    return ' '.repeat(L) + (hdr ? `<b>${inline(cell)}</b>` : inline(cell)) + ' '.repeat(R);
  }).join('│') + '│';
  return '<div class="pre">' + [line('┌', '┬', '┐'), rowh(rows[0], true), line('├', '┼', '┤'), ...rows.slice(1).map(r => rowh(r, false)), line('└', '┴', '┘')].join('\n') + '</div>';
}
function listNum(d, n) {
  if (d === 2) { let s = ''; while (n > 0) { n--; s = String.fromCharCode(97 + (n % 26)) + s; n = Math.floor(n / 26); } return s; }
  if (d === 3) { const R = [[10,'x'],[9,'ix'],[5,'v'],[4,'iv'],[1,'i']]; let s = ''; for (const [v, r] of R) while (n >= v) { s += r; n -= v; } return s; }
  return String(n);
}
function listHTML(items) {
  const stack = [], counters = [];
  return '<div>' + items.map(it => {
    while (stack.length && it.indent < stack[stack.length - 1]) stack.pop();
    if (!stack.length || it.indent > stack[stack.length - 1]) stack.push(it.indent);
    const d = stack.length - 1;
    counters.length = d + 1;
    let marker = '-';
    if (it.ordered) { counters[d] = counters[d] == null ? it.num : counters[d] + 1; marker = listNum(d, counters[d]) + '.'; }
    else counters[d] = null;
    return '  '.repeat(d) + marker + ' ' + inline(it.text);
  }).join('\n') + '</div>';
}
function mdHTML(src) {
  const lines = String(src || '').replace(/\r/g, '').split('\n');
  const blocks = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    let m = line.match(/^\s*(```|~~~)\s*([\w+#.-]*)/);
    if (m) {
      const f = m[1], lang = m[2], code = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith(f)) { code.push(lines[i]); i++; }
      i++;
      blocks.push(`<div>${highlight(code.join('\n'), lang) || ' '}</div>`);
      continue;
    }
    if ((m = line.match(/^(#{1,6})\s+(.*?)\s*#*\s*$/))) { blocks.push(`<div class="${m[1].length === 1 ? 'b i u' : 'b'}">${inline(m[2])}</div>`); i++; continue; }
    if (HR_RE.test(line)) { blocks.push('<div class="c-dim">---</div>'); i++; continue; }
    if (isTableAt(lines, i)) {
      const head = splitRow(line);
      const aligns = splitRow(lines[i + 1]).map(c => /^:-+:$/.test(c) ? 'center' : /-:$/.test(c) ? 'right' : 'left');
      const rows = [head];
      i += 2;
      while (i < lines.length && lines[i].includes('|') && lines[i].trim()) { rows.push(splitRow(lines[i])); i++; }
      blocks.push(tableHTML(rows, aligns));
      continue;
    }
    if (/^\s*>/.test(line)) {
      const q = [];
      while (i < lines.length && /^\s*>/.test(lines[i])) { q.push(lines[i].replace(/^\s*>\s?/, '')); i++; }
      blocks.push(`<div class="c-dim i">${q.map(l => '▎ ' + inline(l)).join('\n')}</div>`);
      continue;
    }
    if (LIST_RE.test(line)) {
      const items = [];
      while (i < lines.length) {
        const l = lines[i], mm = l.match(LIST_RE);
        if (mm) { items.push({ indent: mm[1].replace(/\t/g, '    ').length, ordered: /^\d/.test(mm[2]), num: parseInt(mm[2], 10) || 1, text: mm[3] }); i++; continue; }
        if (!l.trim()) { let j = i + 1; while (j < lines.length && !lines[j].trim()) j++; if (j < lines.length && LIST_RE.test(lines[j])) { i = j; continue; } break; }
        if (/^\s+\S/.test(l) && items.length) { items[items.length - 1].text += ' ' + l.trim(); i++; continue; }
        break;
      }
      blocks.push(listHTML(items));
      continue;
    }
    const p = [];
    do { p.push(lines[i].replace(/^\s+/, '')); i++; } while (i < lines.length && lines[i].trim() && !isBlockStart(lines, i));
    blocks.push(`<div>${p.map(inline).join('\n')}</div>`);
  }
  return blocks.join(BL);
}

/* ════════════════════ State ════════════════════ */
const term = $('#term'), elT = $('#transcript'), elLive = $('#live'), elPrompt = $('#prompt');
const st = {
  cols: 80, rows: 24, cw: 9, lh: 19, items: [], steps: [], warn: [], hdr: {},
  input: '', placeholder: true, model: null, effort: 'medium', pmode: 'normal', context: null, title: '',
  spin: null, dialog: null, magic: null, free: null, paused: false, detailed: false,
  waitingStart: false, startResolve: null, playing: false, finished: false,
};
let turn = null;

/* ════════════════════ Cancelable waits ════════════════════ */
class Cancel extends Error {}
let gen = 0;
const pendings = new Set();
function track(fn) {
  return new Promise((res, rej) => {
    const entry = { reject: rej };
    pendings.add(entry);
    fn(v => { pendings.delete(entry); res(v); }, e => { pendings.delete(entry); rej(e); });
  });
}
function cancelAll() {
  gen++;
  const ps = [...pendings];
  pendings.clear();
  ps.forEach(p => p.reject(new Cancel()));
  turn = null;
}
function wait(ms, interruptible = false) {
  const my = gen;
  return track(resolve => {
    let left = Math.max(0, ms) / (S.speed || 1), last = performance.now();
    const tick = () => {
      if (my !== gen) return;
      if (interruptible && turn && turn.interrupted) return resolve('int');
      const now = performance.now();
      if (!st.paused) left -= now - last;
      last = now;
      if (left <= 0) return resolve();
      setTimeout(tick, Math.min(30, Math.max(4, left)));
    };
    tick();
  });
}

/* ════════════════════ Measurements ════════════════════ */
function measure() {
  const p = $('#probe');
  p.textContent = 'M'.repeat(100);
  const r = p.getBoundingClientRect();
  st.cw = r.width / 100 || 9;
  st.lh = r.height || 19;
  const cs = getComputedStyle(term);
  const iw = term.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  const ih = term.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
  const cols = Math.max(20, Math.floor((iw + 0.5) / st.cw));
  const rows = Math.max(5, Math.floor(ih / st.lh));
  const changed = cols !== st.cols || rows !== st.rows;
  st.cols = cols; st.rows = rows;
  return changed;
}

/* ════════════════════ UI components ════════════════════ */
const seg = (t, c = '') => [t, c];
const segLen = a => a.reduce((n, [t]) => n + clen(t), 0);
const segHTML = a => a.map(([t, c]) => c ? `<span class="${c}">${esc(t)}</span>` : esc(t)).join('');
const truncate = (t, w) => { const a = [...t]; return a.length <= w ? t : (w <= 1 ? '…' : a.slice(0, w - 1).join('') + '…'); };
const truncStart = (t, w) => { const a = [...t]; return a.length <= w ? t : '…' + a.slice(a.length - w + 1).join(''); };
function padSegs(a, w, align) {
  const l = segLen(a);
  if (l >= w) return a;
  const d = w - l;
  if (align === 'center') { const L = Math.floor(d / 2); return [seg(' '.repeat(L)), ...a, seg(' '.repeat(d - L))]; }
  return [...a, seg(' '.repeat(d))];
}
const MASCOT = [' ▐▛███▜▌ ', '▝▜█████▛▘', '  ▘▘ ▝▝  '];

function welcomeHTML(it) {
  const W = st.cols, H = st.hdr;
  const meta = H.plan ? `${it.model} · ${H.plan}` : it.model;
  if (it.style === 'compact' || W < 50) {
    return [
      [seg(MASCOT[0], 'c-claude'), seg('  '), seg('Claude Code', 'b'), seg(' v' + H.version, 'c-dim')],
      [seg(MASCOT[1], 'c-claude'), seg('  '), seg(meta, 'c-dim')],
      [seg(MASCOT[2], 'c-claude'), seg('  '), seg(H.cwd, 'c-dim')],
    ].map(l => `<div class="pre">${segHTML(l)}</div>`).join('');
  }
  const inner = W - 2, two = W >= 76;
  const Lw = two ? Math.max(30, Math.min(Math.floor((inner - 1) * 0.5), inner - 29)) : inner;
  const Rw = two ? inner - 1 - Lw : 0;
  const ttl = [seg('╭───', 'c-claude'), seg(' '), seg('Claude Code', 'c-claude'), seg(' '), seg('v' + H.version, 'c-dim'), seg(' ')];
  const rows = [[...ttl, seg('─'.repeat(Math.max(0, W - 1 - segLen(ttl))) + '╮', 'c-claude')]];
  const lw = Lw - 2, rw = Rw - 2;
  const L = [[], [seg(truncate(H.user ? `Welcome back ${H.user}!` : 'Welcome back!', lw), 'b')], [],
    [seg(MASCOT[0], 'c-claude')], [seg(MASCOT[1], 'c-claude')], [seg(MASCOT[2], 'c-claude')], [],
    [seg(truncate(meta, lw), 'c-dim')], [seg(truncStart(H.cwd, lw), 'c-dim')]];
  const R = two ? [
    [seg(truncate('Tips for getting started', rw), 'c-claude b')],
    [seg(truncate('Run /init to create a CLAUDE.md file with instructions for Claude', rw))],
    [seg('─'.repeat(Math.max(0, rw)), 'c-claude')],
    [seg(truncate('Recent activity', rw), 'c-claude b')],
    [seg(truncate('No recent activity', rw), 'c-dim')],
  ] : [];
  for (let i = 0; i < Math.max(L.length, R.length); i++) {
    const l = padSegs(L[i] || [], Lw, 'center');
    rows.push(two
      ? [seg('│', 'c-claude'), ...l, seg('│', 'c-claude'), seg(' '), ...padSegs(R[i] || [], rw), seg(' '), seg('│', 'c-claude')]
      : [seg('│', 'c-claude'), ...l, seg('│', 'c-claude')]);
  }
  rows.push([seg('╰' + '─'.repeat(W - 2) + '╯', 'c-claude')]);
  return rows.map(r => `<div class="pre">${segHTML(r)}</div>`).join('');
}
function shellHTML() {
  const H = st.hdr;
  if (S.platform === 'mac') {
    const folder = H.cwd.split(/[\\/]/).filter(Boolean).pop() || '~';
    const u = (H.user || 'user').toLowerCase().replace(/\s+/g, '');
    return `<div>${esc(u)}@MacBook-Pro ${esc(folder)} % claude</div>`;
  }
  return `<div>PS ${esc(H.cwd)}&gt; <span class="c-psy">claude</span></div>`;
}
const userTextHTML = t => String(t).split(/(ultrathink)/i)
  .map((p, k) => k % 2 ? [...p].map((ch, i) => `<span style="color:${RAINBOW[i % RAINBOW.length]}">${esc(ch)}</span>`).join('') : nb(esc(p))).join('');
const userHTML = t => `<div class="row${S.userBg ? ' ubg' : ''}"><div class="g g2 c-dim">${esc(S.promptChar)} </div><div class="c c-dim">${userTextHTML(t)}</div></div>`;
const resultHTML = lines => (!lines || !lines.length) ? '' : `<div class="row"><div class="g g5 c-dim">  ⎿  </div><div class="c">${lines.join('\n')}</div></div>`;
const dotRow = (dot, content) => `<div class="row"><div class="g g2">${dot}</div><div class="c">${content}</div></div>`;
const DOTS = { running: '<span class="c-dim blink">●</span>', pending: '<span class="c-dim">●</span>', ok: '<span class="c-ok">●</span>', err: '<span class="c-err">●</span>', rej: '<span class="c-err">●</span>' };
const isBash = name => /^bash$/i.test(name);

function outLines(it) {
  const bash = isBash(it.name);
  const cls = it.state === 'err' ? 'c-err' : bash ? '' : 'c-dim';
  const max = bash ? 4 : 6;
  let lines = it.out, extra = 0;
  if (!st.detailed && lines.length > max + 1) { extra = lines.length - max; lines = lines.slice(0, max); }
  const arr = lines.map(l => { const h = bash ? nb(esc(l)) : inline(l); return cls ? `<span class="${cls}">${h}</span>` : h; });
  if (extra) arr.push(`<span class="c-dim">… +${extra} lines (ctrl+o to expand)</span>`);
  return arr;
}
function toolHTML(it) {
  const head = `<span class="b">${esc(it.name)}</span>${it.args != null ? '(' + nb(esc(it.args)) + ')' : ''}`;
  let h = dotRow(DOTS[it.state], head);
  if (it.state === 'running' && isBash(it.name)) h += resultHTML(['<span class="c-dim">Running…</span>']);
  else if ((it.state === 'ok' || it.state === 'err') && it.out.length) h += resultHTML(outLines(it));
  return h;
}
function editHTML(it) {
  let h = dotRow(DOTS[it.state === 'running' ? 'running' : 'ok'], `<span class="b">Update</span>(${esc(it.file)})`);
  if (it.state === 'running') return h;
  const add = it.diff.filter(d => d.s === '+').length, del = it.diff.filter(d => d.s === '-').length;
  const parts = [];
  if (add) parts.push(`<span class="b">${add}</span> ${add === 1 ? 'addition' : 'additions'}`);
  if (del) parts.push(`<span class="b">${del}</span> ${del === 1 ? 'removal' : 'removals'}`);
  const summary = `<span class="c-dim">Updated <span class="b">${esc(it.file)}</span>${parts.length ? ' with ' + parts.join(' and ') : ''}</span>`;
  const w = Math.max(1, ...it.diff.map(d => String(d.n).length));
  const lang = it.file.includes('.') ? it.file.split('.').pop() : '';
  const rows = it.diff.map(d => `<div class="${d.s === '+' ? 'dadd' : d.s === '-' ? 'ddel' : ''}"><span class="${d.s === ' ' ? 'c-dim' : ''}">${String(d.n).padStart(w + 1)}</span> ${d.s}  ${highlight(d.text, lang)}</div>`).join('');
  return h + `<div class="row"><div class="g g5 c-dim">  ⎿  </div><div class="c"><div>${summary}</div>${rows}</div></div>`;
}
function todosHTML(it) {
  const lines = it.items.map(x => x.s === 'done' ? `<span class="c-dim">☒ <span class="s">${inline(x.text)}</span></span>`
    : x.s === 'progress' ? `<span class="b">☐ ${inline(x.text)}</span>` : `☐ ${inline(x.text)}`);
  return dotRow(DOTS.ok, '<span class="b">Update Todos</span>') + resultHTML(lines);
}
function reasoningHTML(it) {
  if (st.detailed || S.thinkingExpanded)
    return `<div class="c-dim i">∴ Thinking…</div>${BL}<div class="row"><div class="g g2"> </div><div class="c c-dim i">${mdHTML(it.text)}</div></div>`;
  return `<div class="c-dim i">∴ Thought for ${it.secs}s (ctrl+o to show thinking)</div>`;
}
const fmtDur = s => s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`;
const fmtTok = n => { n = Math.round(n); return n >= 1e6 ? (n / 1e6).toFixed(n >= 1e7 ? 0 : 1) + 'M' : n < 1000 ? String(n) : (n / 1000).toFixed(1) + 'k'; };

function itemHTML(it) {
  const g = it.gap ? BL : '';
  switch (it.k) {
    case 'shell': return shellHTML();
    case 'welcome': return g + welcomeHTML(it);
    case 'user': return g + userHTML(it.text);
    case 'slash': return g + userHTML(it.text) + resultHTML(it.res);
    case 'assistant': return g + dotRow('●', mdHTML(it.shown));
    case 'reasoning': return g + reasoningHTML(it);
    case 'tool': return g + toolHTML(it);
    case 'edit': return g + editHTML(it);
    case 'todos': return g + todosHTML(it);
    case 'error': return resultHTML([`<span class="c-err">${esc(it.text)}</span>`]);
    case 'info': return resultHTML([`<span class="c-dim">${inline(it.text)}</span>`]);
    case 'interrupted': return resultHTML(['<span class="c-err">Interrupted</span><span class="c-dim"> · What should Claude do instead?</span>']);
    case 'worked': return g + `<div class="c-dim">✻ ${esc(it.verb)} for ${fmtDur(it.secs)}${it.tokens ? ` · ↓ ${fmtTok(it.tokens)} tokens` : ''}</div>`;
    case 'compacted': return g + '<div class="c-dim">✻ Conversation compacted · ctrl+o for history</div>';
  }
  return '';
}

/* Spinner */
function spinnerHTML(sp) {
  const fr = FRAMES[S.platform === 'mac' ? 'mac' : 'win'];
  const seq = [...fr, ...fr.slice().reverse()];
  const glyph = seq[sp.frame % seq.length];
  const v = [...(sp.verb + '…')].map((ch, i) => `<span class="${Math.abs(i - sp.glint) <= 1 ? 'c-shimmer' : 'c-claude'}">${esc(ch)}</span>`).join('');
  const secs = Math.floor(sp.elapsed / 1000);
  const info = (secs < 1 || sp.simple) ? '(esc to interrupt)' : `(${fmtDur(secs)} · ↓ ${fmtTok(sp.tokens)} tokens · esc to interrupt)`;
  return `<div><span class="cell c-claude">${glyph}</span> ${v} <span class="c-dim">${info}</span></div>`;
}

/* Model picker */
function pickerHTML(P) {
  let h = BL + `<div class="pre c-border">${'─'.repeat(st.cols)}</div>`;
  h += '<div class="row"><div class="g g1"> </div><div class="c"><span class="b c-sug">Select model</span></div></div>';
  h += '<div class="row"><div class="g g1"> </div><div class="c c-dim">Switch between Claude models. Applies to this session and future Claude Code sessions. For other/previous model names, specify with <span class="nw">--model.</span></div></div>';
  h += BL;
  const lw = Math.max(...MODELS.map(m => clen(m.label) + (m === st.model ? 2 : 0)));
  MODELS.forEach((m, i) => {
    const sel = i === P.idx, cur = m === st.model;
    const check = cur ? ' <span class="cell c-ok">✔</span>' : '';
    const padn = lw - clen(m.label) - (cur ? 2 : 0) + 2;
    const left = sel
      ? `<span class="c-sug">❯ ${i + 1}. ${esc(m.label)}</span>${check}`
      : `  ${i + 1}. ${esc(m.label)}${check}`;
    h += `<div class="pre"> ${left}${' '.repeat(padn)}<span class="c-dim">${esc(m.name)}${m.desc ? ' · ' + esc(m.desc) : ''}</span></div>`;
  });
  const m = MODELS[P.idx];
  if (m && m.effort) {
    const e = EFFORTS[P.eff];
    const ultra = e === 'ultracode';
    h += BL + `<div class="pre"> <span class="${ultra ? 'c-ultra' : 'c-claude'}">${EFFORT_ICON[e]}</span> <span class="${ultra ? 'c-ultra' : ''}">${EFFORT_LABEL[e]}</span>${e === 'medium' ? '<span class="c-dim"> (default)</span>' : ''} <span class="c-dim">← → to adjust</span></div>`;
  }
  h += BL + '<div class="pre c-dim"> Enter to confirm · Esc to exit</div>';
  return h;
}

/* Permission dialog */
const permOptions = s => {
  const bash = isBash(s.name);
  const first = String(s.args || '').trim().split(/\s+/)[0] || 'these';
  return ['Yes',
    bash ? `Yes, and don't ask again for ${first} commands in ${st.hdr.cwd}` : "Yes, and don't ask again this session",
    'No, and tell Claude what to do differently (esc)'];
};
function permHTML(P) {
  const s = P.s, bash = isBash(s.name);
  const title = bash ? 'Bash command' : /^(edit|update|write|multiedit)$/i.test(s.name) ? 'Edit file' : /fetch/i.test(s.name) ? 'Fetch' : s.name;
  let h = BL + `<div class="pre c-perm">${'─'.repeat(st.cols)}</div>`;
  h += `<div class="pre"> <span class="b c-perm">${esc(title)}</span></div>` + BL;
  const body = bash ? (s.args ?? '') : `${s.name}${s.args != null ? '(' + s.args + ')' : ''}`;
  h += `<div class="row"><div class="g g3"></div><div class="c">${nb(esc(body))}</div></div>`;
  if (s.desc) h += `<div class="row"><div class="g g3"></div><div class="c c-dim">${nb(esc(s.desc))}</div></div>`;
  h += BL + '<div class="pre"> Do you want to proceed?</div>';
  permOptions(s).forEach((o, i) => {
    h += i === P.idx
      ? `<div class="row"><div class="g g3"> <span class="c-sug">❯</span> </div><div class="c c-sug">${i + 1}. ${esc(o)}</div></div>`
      : `<div class="row"><div class="g g3"></div><div class="c">${i + 1}. ${esc(o)}</div></div>`;
  });
  return h;
}

/* Prompt (input box) */
function statusHTML() {
  const H = st.hdr;
  const folder = H.cwd.split(/[\\/]/).filter(Boolean).pop() || H.cwd;
  const map = { model: st.model.name, effort: st.effort, effortIcon: EFFORT_ICON[st.effort], cwd: H.cwd, folder, user: H.user || '' };
  return esc(String(S.statusTpl || '').replace(/\{(\w+)\}/g, (m, k) => map[k] ?? m));
}
function suggestionsHTML() {
  const t = st.input;
  if (!t.startsWith('/') || /\s/.test(t)) return '';
  const q = t.slice(1).toLowerCase();
  const list = SLASH.filter(([c]) => c.slice(1).startsWith(q)).slice(0, 7);
  if (!list.length) return '';
  const w = Math.max(...list.map(([c]) => c.length)) + 4;
  return list.map(([c, d], i) => i === 0
    ? `<div class="pre">  <span class="c-sug">${esc(c.padEnd(w))}${esc(d)}</span></div>`
    : `<div class="pre">  ${esc(c.padEnd(w))}<span class="c-dim">${esc(d)}</span></div>`).join('');
}
function footerHTML() {
  const sg = suggestionsHTML();
  if (sg) return sg;
  const cyc = '<span class="c-dim"> (shift+tab to cycle)</span>';
  let left = '', right = '';
  if (st.pmode === 'edits') left = `<span class="c-accept">⏵⏵ accept edits on</span>${cyc}`;
  else if (st.pmode === 'plan') left = `<span class="c-plan">⏸ plan mode on</span>${cyc}`;
  else if (st.pmode === 'bypass') left = `<span class="c-err">⏵⏵ bypass permissions on</span>${cyc}`;
  else if (!S.statusline && !st.input) left = '<span class="c-dim">? for shortcuts</span>';
  if (st.context != null) right = `<span class="${st.context <= 5 ? 'c-err' : st.context <= 15 ? 'c-warn' : 'c-dim'}">Context left until auto-compact: ${st.context}%</span>`;
  let h = '';
  if (S.statusline) h += `<div class="pre c-dim">  ${statusHTML()}</div>`;
  if (left || right || !S.statusline) h += `<div class="foot"><span>  ${left}</span><span>${right}</span></div>`;
  return h;
}
function promptHTML() {
  if (st.dialog) return '';
  const bashMode = st.input.startsWith('!');
  const rule = `<div class="pre ${bashMode ? 'c-bash' : 'c-border'}">${'─'.repeat(st.cols)}</div>`;
  const pc = bashMode ? '<span class="c-bash">!</span> ' : esc(S.promptChar) + ' ';
  const body = (!st.input && st.placeholder)
    ? '<span class="inv">T</span><span class="c-dim">ry "how does &lt;filepath&gt; work?"</span>'
    : userTextHTML(bashMode ? st.input.slice(1) : st.input) + '<span class="inv"> </span>';
  return BL + rule + `<div class="row"><div class="g g2">${pc}</div><div class="c">${body}</div></div>` + rule + footerHTML();
}
function liveHTML() {
  if (st.dialog) return st.dialog.type === 'picker' ? pickerHTML(st.dialog.P) : permHTML(st.dialog.P);
  if (st.spin) return BL + spinnerHTML(st.spin);
  return '';
}

/* ════════════════════ Render ════════════════════ */
const scrollBottom = () => { term.scrollTop = term.scrollHeight; };
function addItem(it) {
  st.items.push(it);
  it.el = document.createElement('div');
  it.el.innerHTML = itemHTML(it);
  elT.appendChild(it.el);
  scrollBottom();
  return it;
}
function update(it) { if (it.el) it.el.innerHTML = itemHTML(it); scrollBottom(); }
function renderLive() { elLive.innerHTML = liveHTML(); scrollBottom(); }
function renderPrompt() { elPrompt.innerHTML = promptHTML(); scrollBottom(); }
function setInput(t) { st.input = t; renderPrompt(); }
function renderTitle() {
  const t = '✳ ' + (st.title || 'Claude Code');
  document.title = t;
  const tb = $('#titlebar');
  $('#stage').className = S.frame === 'none' ? '' : 'framed f-' + S.frame;
  if (S.frame === 'win') {
    tb.className = 'wt'; tb.style.display = 'flex';
    tb.innerHTML = `<div class="tab"><span class="ico">${PS_ICON}</span><span class="t">${esc(t)}</span><span class="x">${IC_X_SMALL}</span></div><div class="nb">${IC_PLUS}</div><div class="nb">${IC_CHEV}</div><div class="sp"></div><div class="ctl">${IC_MIN}</div><div class="ctl">${IC_MAX}</div><div class="ctl">${IC_CLOSE}</div>`;
  } else if (S.frame === 'mac') {
    const folder = (st.hdr.cwd || '').split(/[\\/]/).filter(Boolean).pop() || '~';
    tb.className = 'mac'; tb.style.display = 'flex';
    tb.innerHTML = `<div class="lights"><i></i><i></i><i></i></div><div class="t">${esc(folder)} — ${esc(t)} — claude — ${st.cols}×${st.rows}</div>`;
  } else { tb.className = ''; tb.style.display = 'none'; tb.innerHTML = ''; }
}
function luminance(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex || '');
  if (!m) return 0;
  const n = parseInt(m[1], 16);
  return (0.2126 * (n >> 16 & 255) + 0.7152 * (n >> 8 & 255) + 0.0722 * (n & 255)) / 255;
}
function applyTheme() {
  const r = document.documentElement.style;
  r.setProperty('--bg', S.bg);
  r.setProperty('--fg', S.fg);
  r.setProperty('--font', `"${S.font}", "Cascadia Mono", Consolas, "SF Mono", Menlo, monospace`);
  r.setProperty('--fs', S.fontSize + 'px');
  r.setProperty('--pad', S.pad + 'px');
  document.body.classList.toggle('light', luminance(S.bg) > 0.5);
}
function renderAll() {
  applyTheme();
  renderTitle();
  measure();
  elT.innerHTML = '';
  for (const it of st.items) {
    it.el = document.createElement('div');
    it.el.innerHTML = itemHTML(it);
    elT.appendChild(it.el);
  }
  renderLive();
  renderPrompt();
  renderTitle();
  scrollBottom();
}
new ResizeObserver(() => {
  if (!measure()) return;
  for (const it of st.items) if (it.k === 'welcome') it.el.innerHTML = itemHTML(it);
  renderLive(); renderPrompt(); renderTitle(); scrollBottom();
}).observe(term);

/* Spinner animation */
let lastTick = performance.now();
setInterval(() => {
  const now = performance.now(), dt = now - lastTick;
  lastTick = now;
  const sp = st.spin;
  if (!sp || st.dialog || st.paused) return;
  sp.elapsed += dt; sp.acc += dt; sp.gacc += dt;
  if (sp.target) sp.tokens = Math.min(sp.target * 0.97, sp.tokens + Math.max(sp.target * 0.004, (sp.target - sp.tokens) * 0.03) * dt / 50);
  else sp.tokens += dt / 1000 * sp.rate;
  if (Math.random() < 0.04) sp.rate = 12 + Math.random() * 70;
  while (sp.acc >= 120) { sp.acc -= 120; sp.frame++; }
  while (sp.gacc >= 55) { sp.gacc -= 55; sp.glint++; if (sp.glint > clen(sp.verb) + 9) sp.glint = -4; }
  renderLive();
}, 50);
function startSpinner(verb) {
  st.spin = { verb: verb || pick(VERBS), frame: 0, glint: -4, elapsed: 0, acc: 0, gacc: 0, tokens: 0, rate: 30 };
  renderLive();
}
function stopSpinner() { st.spin = null; renderLive(); }

/* ════════════════════ Initial state ════════════════════ */
function resetState() {
  MODELS = parseModels(S.models);
  const { steps, hdr, warn } = compile(SCRIPT);
  const H = keys => { for (const k of keys) if (hdr[k] != null && hdr[k] !== '') return hdr[k]; return null; };
  const wl = norm(H(['bienvenida', 'welcome', 'logo']) || '');
  st.steps = steps; st.warn = warn;
  st.hdr = {
    user: H(['usuario', 'user', 'nombre', 'name']) ?? '',
    plan: H(['plan', 'cuenta']) ?? 'Claude Max',
    cwd: H(['cwd', 'directorio', 'carpeta', 'dir', 'ruta']) ?? '~/projects/demo',
    version: String(H(['version']) || S.version || '2.1.98').replace(/^v/i, ''),
    welcome: wl.startsWith('comp') && !wl.startsWith('comple') ? 'compact' : (wl.startsWith('ning') || wl === 'none' || wl === 'no') ? 'none' : (wl.startsWith('comple') || wl === 'full') ? 'full' : null,
  };
  st.model = findModel(H(['modelo', 'model']) || '') || MODELS[0];
  st.effort = parseEffort(H(['esfuerzo', 'effort']) || '') || 'medium';
  st.pmode = MODE_ALIAS[norm(H(['modo', 'mode']) || '')] || 'normal';
  const c = H(['contexto', 'context']);
  st.context = c != null ? num(c) : null;
  st.title = H(['titulo', 'title']) || '';
  Object.assign(st, { items: [], input: '', placeholder: true, spin: null, dialog: null, magic: null, free: null, paused: false, waitingStart: false, startResolve: null, playing: false, finished: false });
  turn = null;
  if (S.shellLine) st.items.push({ k: 'shell' });
  const style = st.hdr.welcome || S.welcome;
  if (style !== 'none') st.items.push({ k: 'welcome', model: st.model.name, style, gap: S.shellLine });
}
function clearScreen() {
  st.items = [];
  elT.innerHTML = '';
  const style = st.hdr.welcome || S.welcome;
  if (style !== 'none') addItem({ k: 'welcome', model: st.model.name, style, gap: false });
  renderPrompt();
}

/* ════════════════════ Playback engine ════════════════════ */
const driverFor = () => S.mode === 'auto' ? 'auto' : S.mode === 'magic' ? 'magic' : 'manual';

function typeDelay(ch) {
  let d = (1000 / S.typeCps) * (0.55 + Math.random() * 0.9);
  if (ch === ' ') d *= 1.25;
  if (/[.,;:!?¿¡]/.test(ch)) d *= 2.2;
  if (Math.random() < 0.04) d += 220 + Math.random() * 260;
  return d;
}
async function typeInput(text) {
  if (S.mode === 'auto') {
    await wait(320);
    const ch = [...text];
    for (let i = 0; i < ch.length; i++) { setInput(ch.slice(0, i + 1).join('')); await wait(typeDelay(ch[i])); }
    await wait(450);
  } else {
    await track(resolve => { st.magic = { chars: [...text], pos: 0, resolve, finishing: false }; setInput(''); });
  }
}
const freeInput = () => track(resolve => { st.free = { resolve }; renderPrompt(); });
function submitUser(text) {
  st.placeholder = false;
  st.input = '';
  addItem({ k: 'user', text, gap: true });
  renderPrompt();
}
const effortDelay = () => (st.model.effort ? EFFORT_DELAY[st.effort] : 1100) * (0.85 + Math.random() * 0.3);
function continuesTurn(steps, pc) {
  for (let j = pc; j < steps.length; j++) {
    if (TURN.has(steps[j].t)) return true;
    if (!INTURN.has(steps[j].t)) return false;
  }
  return false;
}

async function run() {
  try {
    if (S.mode === 'auto') {
      st.waitingStart = true; updateRunState();
      await track(r => { st.startResolve = r; });
      st.waitingStart = false; st.startResolve = null;
      await wait(S.startDelay * 1000);
    }
    st.playing = true; updateRunState();
    const steps = st.steps;
    let pc = 0;
    while (pc < steps.length) {
      const s = steps[pc];
      if (s.t === 'user') {
        if (S.mode === 'free') { pc = await freeStep(steps, pc); continue; }
        pc++;
        await typeInput(s.text);
        if (s.text.startsWith('/')) { await runSlash(s.text, s.hidden, driverFor()); continue; }
        submitUser(s.text);
        pc = await runTurn(steps, pc);
      } else if (TURN.has(s.t)) {
        pc = await runTurn(steps, pc);
      } else {
        await runMeta(s);
        pc++;
      }
    }
    st.playing = false; st.finished = true; updateRunState();
    if (S.mode === 'free') {
      for (;;) {
        const t = (await freeInput()).trim();
        if (t.startsWith('/')) await runSlash(t, null, 'manual'); else submitUser(t);
      }
    }
  } catch (e) {
    if (!(e instanceof Cancel)) console.error(e);
  }
}
async function freeStep(steps, pc) {
  const t = (await freeInput()).trim();
  if (t.startsWith('/')) {
    const cmd = t.split(/\s+/)[0].toLowerCase();
    let hidden = null;
    if (steps[pc].text.split(/\s+/)[0].toLowerCase() === cmd) { hidden = steps[pc].hidden; pc++; }
    await runSlash(t, hidden, 'manual');
    return pc;
  }
  while (pc < steps.length && steps[pc].t === 'user' && steps[pc].text.startsWith('/')) pc++;
  if (pc < steps.length && steps[pc].t === 'user') pc++;
  submitUser(t);
  return runTurn(steps, pc);
}
async function runTurn(steps, pc) {
  const T = { interrupted: false };
  turn = T;
  startSpinner();
  const tokTarget = turnTokens(steps, pc);
  if (tokTarget) st.spin.target = tokTarget;
  let first = true, pendingThink = null;
  while (pc < steps.length) {
    const s = steps[pc];
    if (!TURN.has(s.t) && !(INTURN.has(s.t) && continuesTurn(steps, pc))) break;
    pc++;
    if (T.interrupted) continue;
    if (s.t === 'think') {
      if (s.secs != null) pendingThink = s.secs;
      if (s.verb && st.spin) st.spin.verb = s.verb;
      continue;
    }
    if (s.t === 'pause') { await wait(s.secs * 1000, true); continue; }
    if (INTURN.has(s.t)) { await runMeta(s); continue; }
    if (s.t === 'interrupt') { if (pendingThink != null) await wait(pendingThink * 1000, true); T.interrupted = true; continue; }
    const ms = pendingThink != null ? pendingThink * 1000 : first ? effortDelay() : 600 + Math.random() * 700;
    pendingThink = null;
    await wait(ms, true);
    if (T.interrupted) continue;
    first = false;
    await runVisible(s, T, ms);
  }
  const elapsed = st.spin ? st.spin.elapsed : 0;
  stopSpinner();
  if (T.interrupted) addItem({ k: 'interrupted' });
  else if (tokTarget) addItem({ k: 'worked', verb: pick(DONE_VERBS), secs: Math.max(1, Math.round(elapsed / 1000)), tokens: tokTarget, gap: true });
  else if (S.workedFor && elapsed > 2000) addItem({ k: 'worked', verb: pick(DONE_VERBS), secs: Math.round(elapsed / 1000), gap: true });
  turn = null;
  return pc;
}
async function runVisible(s, T, ms) {
  switch (s.t) {
    case 'claude': {
      const it = addItem({ k: 'assistant', md: s.md, shown: S.reveal === 'stream' ? '' : s.md, gap: true });
      if (st.spin) st.spin.tokens += s.md.length / 3.6;
      if (S.reveal === 'stream') {
        const ch = [...s.md];
        let i = 0;
        while (i < ch.length && !T.interrupted) {
          const n = 2 + Math.floor(Math.random() * 6);
          i = Math.min(ch.length, i + n);
          it.shown = ch.slice(0, i).join('');
          update(it);
          await wait(n * 1000 / S.streamCps, true);
        }
      }
      break;
    }
    case 'reasoning':
      addItem({ k: 'reasoning', text: s.text, secs: Math.max(1, Math.round(ms / 1000)), gap: true });
      if (st.spin) st.spin.tokens += s.text.length / 3.6;
      break;
    case 'tool': case 'toolerr': {
      const it = addItem({ k: 'tool', name: s.name, args: s.args, out: s.out, state: 'running', gap: true });
      await wait(800 + Math.random() * 900, true);
      it.state = T.interrupted ? 'err' : s.t === 'toolerr' ? 'err' : 'ok';
      if (T.interrupted) it.out = [];
      update(it);
      break;
    }
    case 'edit': {
      const it = addItem({ k: 'edit', file: s.file, diff: s.diff, state: 'running', gap: true });
      await wait(600 + Math.random() * 500, true);
      it.state = 'ok';
      update(it);
      break;
    }
    case 'todos':
      addItem({ k: 'todos', items: s.items, gap: true });
      break;
    case 'perm': {
      const it = addItem({ k: 'tool', name: s.name, args: s.args, out: s.out, state: 'pending', gap: true });
      const P = { idx: 0, tIdx: (s.choice || 1) - 1, s };
      const choice = await openDialog('perm', P, driverFor());
      if (choice === 3) { it.state = 'rej'; update(it); T.interrupted = true; }
      else {
        it.state = 'running'; update(it);
        await wait(700 + Math.random() * 700, true);
        it.state = T.interrupted ? 'err' : 'ok';
        update(it);
      }
      break;
    }
    case 'error':
      addItem({ k: 'error', text: s.text || 'API Error: 529 {"type":"error","error":{"type":"overloaded_error","message":"Overloaded"}}' });
      break;
  }
}
async function runMeta(s) {
  switch (s.t) {
    case 'pause': await wait(s.secs * 1000); break;
    case 'mode': st.pmode = s.mode; renderPrompt(); break;
    case 'context': st.context = s.pct; renderPrompt(); break;
    case 'title': st.title = s.text; renderTitle(); break;
    case 'info': addItem({ k: 'info', text: s.text }); break;
    case 'clear': clearScreen(); break;
    case 'compact': await compactFlow(); break;
    case 'detail': toggleDetail(); break;
  }
}
async function compactFlow() {
  startSpinner('Compacting conversation');
  st.spin.simple = true;
  await wait(3000);
  stopSpinner();
  clearScreen();
  addItem({ k: 'compacted', gap: true });
}
const setModelMsg = (m, e) => `<span class="c-dim">Set model to <span class="b">${esc(m.name)}</span>${e === 'ultracode' ? ' with <span class="b c-ultra">Ultracode</span>' : e ? ` with <span class="b">${e}</span> effort` : ''}</span>`;
async function runSlash(text, hidden, driver) {
  const parts = text.trim().split(/\s+/), cmd = parts[0].toLowerCase(), arg = parts.slice(1).join(' ');
  st.placeholder = false;
  setInput('');
  if (cmd === '/clear') { clearScreen(); return; }
  const it = addItem({ k: 'slash', text: text.trim(), res: [], gap: true });
  if (cmd === '/model') {
    if (arg) {
      const tg = parseTarget(arg + ' ' + (hidden || ''));
      if (!tg.model) it.res = [`<span class="c-err">Model '${esc(arg)}' not found</span>`];
      else {
        const prev = st.effort;
        st.model = tg.model;
        let em = null;
        if (tg.effort && tg.model.effort) { st.effort = tg.effort; if (tg.effort !== prev) em = tg.effort; }
        it.res = [setModelMsg(tg.model, em)];
      }
    } else {
      await wait(200);
      const P = { idx: Math.max(0, MODELS.indexOf(st.model)), eff: Math.max(0, EFFORTS.indexOf(st.effort)) };
      const tg = parseTarget(hidden || '');
      P.tIdx = tg.model ? MODELS.indexOf(tg.model) : P.idx;
      P.tEff = tg.effort ? EFFORTS.indexOf(tg.effort) : P.eff;
      const ok = await openDialog('picker', P, driver);
      if (ok) {
        const m = MODELS[P.idx], prev = st.effort;
        st.model = m;
        let em = null;
        if (m.effort) { st.effort = EFFORTS[P.eff]; if (st.effort !== prev) em = st.effort; }
        it.res = [setModelMsg(m, em)];
      } else it.res = [`<span class="c-dim">Kept model as <span class="b">${esc(st.model.name)}</span></span>`];
    }
  } else if (cmd === '/effort') {
    const e = parseEffort(arg || hidden || '');
    if (e) { st.effort = e; it.res = [`<span class="c-dim">Set effort level to <span class="b">${e}</span></span>`]; }
    else it.res = [`<span class="c-dim">Current effort level: <span class="b">${st.effort}</span></span>`];
  } else if (cmd === '/compact') {
    await compactFlow();
    return;
  }
  update(it);
  renderPrompt();
}

/* Dialogs (model picker and permissions) */
function stepToward(type, P) {
  if (P.idx !== P.tIdx) { P.idx += Math.sign(P.tIdx - P.idx); return true; }
  if (type === 'picker' && MODELS[P.idx].effort && P.eff !== P.tEff) { P.eff += Math.sign(P.tEff - P.eff); return true; }
  return false;
}
const confirmValue = (type, P) => type === 'picker' ? true : P.idx + 1;
function openDialog(type, P, driver) {
  st.dialog = { type, P, driver };
  renderLive(); renderPrompt();
  return track(resolve => {
    P.finish = v => {
      if (P.done) return;
      P.done = true;
      st.dialog = null;
      renderLive(); renderPrompt();
      resolve(v);
    };
    if (driver === 'auto') (async () => {
      try {
        await wait(type === 'picker' ? 850 : 1300);
        while (stepToward(type, P)) { renderLive(); await wait(type === 'picker' ? 300 : 380); }
        await wait(550);
        P.finish(confirmValue(type, P));
      } catch {}
    })();
  });
}
function dialogKey(e) {
  const D = st.dialog, P = D.P;
  if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Dead'].includes(e.key)) return;
  e.preventDefault();
  if (D.driver === 'auto' || P.done) return;
  if (D.driver === 'magic') {
    if (e.key === 'Enter') {
      while (stepToward(D.type, P));
      renderLive();
      wait(140).then(() => P.finish(confirmValue(D.type, P)), () => {});
    } else { stepToward(D.type, P); renderLive(); }
    return;
  }
  const n = D.type === 'picker' ? MODELS.length : 3;
  switch (e.key) {
    case 'ArrowUp': P.idx = Math.max(0, P.idx - 1); break;
    case 'ArrowDown': P.idx = Math.min(n - 1, P.idx + 1); break;
    case 'ArrowLeft': if (D.type === 'picker') P.eff = Math.max(0, P.eff - 1); break;
    case 'ArrowRight': if (D.type === 'picker') P.eff = Math.min(EFFORTS.length - 1, P.eff + 1); break;
    case 'Enter': P.finish(confirmValue(D.type, P)); return;
    case 'Escape': P.finish(D.type === 'picker' ? false : 3); return;
    default:
      if (/^[1-9]$/.test(e.key) && +e.key <= n) { P.idx = +e.key - 1; renderLive(); P.finish(confirmValue(D.type, P)); return; }
  }
  renderLive();
}

/* ════════════════════ Keyboard ════════════════════ */
function magicKey(e) {
  const M = st.magic;
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (e.key === 'Enter') {
    e.preventDefault();
    if (M.finishing) return;
    M.finishing = true;
    (async () => {
      try {
        while (M.pos < M.chars.length) { M.pos = Math.min(M.chars.length, M.pos + 2); setInput(M.chars.slice(0, M.pos).join('')); await wait(16); }
        await wait(140);
        st.magic = null;
        M.resolve();
      } catch {}
    })();
    return;
  }
  if (e.key === 'Backspace') { e.preventDefault(); if (!M.finishing && M.pos > 0) { M.pos--; setInput(M.chars.slice(0, M.pos).join('')); } return; }
  if (e.key.length === 1) {
    e.preventDefault();
    if (M.finishing) return;
    M.pos = Math.min(M.chars.length, M.pos + S.charsPerKey);
    setInput(M.chars.slice(0, M.pos).join(''));
  }
}
function freeKey(e) {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (e.key === 'Enter') {
    e.preventDefault();
    if (e.shiftKey) { setInput(st.input + '\n'); return; }
    let t = st.input;
    if (!t.trim()) return;
    if (t.startsWith('/') && !/\s/.test(t)) { const sg = SLASH.find(([c]) => c.slice(1).startsWith(t.slice(1).toLowerCase())); if (sg) t = sg[0]; }
    const F = st.free;
    st.free = null;
    setInput('');
    F.resolve(t);
    return;
  }
  if (e.key === 'Backspace') { e.preventDefault(); setInput([...st.input].slice(0, -1).join('')); return; }
  if (e.key.length === 1) { e.preventDefault(); setInput(st.input + e.key); }
}
function toggleDetail() {
  st.detailed = !st.detailed;
  for (const it of st.items) if (it.k === 'reasoning' || it.k === 'tool') update(it);
  scrollBottom();
}
function cycleMode() {
  const order = ['normal', 'edits', 'plan'];
  st.pmode = order[(order.indexOf(st.pmode) + 1) % order.length];
  renderPrompt();
}
function startNow() { if (st.startResolve) { const r = st.startResolve; st.startResolve = null; r(); } }
function playPause() {
  if (st.waitingStart) { startNow(); return; }
  if (st.finished) { restart(); startNow(); return; }
  if (!st.playing) return;
  st.paused = !st.paused;
  toast(st.paused ? '⏸ Paused' : '▶ Resumed');
  updateRunState();
}
function restart() {
  cancelAll();
  resetState();
  renderAll();
  updateParseStatus();
  run();
}
document.addEventListener('keydown', e => {
  if (e.key === 'F2') { e.preventDefault(); togglePanel(); return; }
  if (e.key === 'F9') { e.preventDefault(); restart(); toast(S.mode === 'auto' ? '↺ Restarted · Space to start' : '↺ Restarted'); return; }
  if (e.key === 'F8') { e.preventDefault(); playPause(); return; }
  if (panelIsOpen()) { if (e.key === 'Escape') { e.preventDefault(); togglePanel(false); } return; }
  if ((e.ctrlKey || e.metaKey) && (e.key === 'o' || e.key === 'O')) { e.preventDefault(); toggleDetail(); return; }
  if (e.key === 'Tab') { e.preventDefault(); if (e.shiftKey) cycleMode(); return; }
  if (st.dialog) { dialogKey(e); return; }
  if (e.key === 'Escape') { e.preventDefault(); if (turn && !turn.interrupted) turn.interrupted = true; return; }
  if (st.magic) { magicKey(e); return; }
  if (st.free) { freeKey(e); return; }
  if (st.waitingStart && (e.key === ' ' || e.key === 'Enter')) { e.preventDefault(); startNow(); return; }
  if (S.mode === 'auto' && st.playing && e.key === ' ') { e.preventDefault(); playPause(); }
});
document.addEventListener('paste', e => {
  if (panelIsOpen() || !st.free) return;
  e.preventDefault();
  setInput(st.input + (e.clipboardData || window.clipboardData).getData('text'));
});
let mouseT;
document.addEventListener('mousemove', () => {
  document.body.classList.remove('nocursor');
  clearTimeout(mouseT);
  if (S.hideMouse) mouseT = setTimeout(() => { if (!panelIsOpen()) document.body.classList.add('nocursor'); }, 1500);
});
let toastT;
function toast(msg, ms = 1500) {
  if (!S.toasts) return;
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove('show'), ms);
}

/* ════════════════════ Control panel ════════════════════ */
const MODE_HINTS = {
  auto: 'Everything plays by itself, with realistic typing and timing. Press <kbd>Space</kbd> or <kbd>F8</kbd> to start and to pause.',
  magic: 'Go at your own pace: every key you press types the next letter of your scripted line (9 keys = 9 letters). <kbd>Enter</kbd> sends it and Claude answers. In the model picker, each key moves one step.',
  free: 'Type whatever you want for real. When you press <kbd>Enter</kbd>, Claude answers with its next scripted turn. <code>/model</code> opens a real picker.',
};
const panelIsOpen = () => $('#panel').classList.contains('open');
function togglePanel(force) {
  const p = $('#panel');
  const open = force ?? !p.classList.contains('open');
  p.classList.toggle('open', open);
  if (open) { syncPanel(); document.body.classList.remove('nocursor'); }
  else if (document.activeElement && p.contains(document.activeElement)) document.activeElement.blur();
}
function updateRunState() {
  const el = $('#runState');
  if (!el) return;
  let cls = '', txt = 'Ready';
  if (st.waitingStart) { cls = 'wait'; txt = 'Waiting: press Space, Enter or F8 to start'; }
  else if (st.finished) { txt = 'Script finished · F8 or F9 to replay'; }
  else if (st.playing && st.paused) { cls = 'pause'; txt = 'Paused · F8 to resume'; }
  else if (st.playing) { cls = 'play'; txt = S.mode === 'auto' ? 'Playing' : 'Live: type on your keyboard'; }
  el.className = 'state ' + cls;
  el.querySelector('span').textContent = txt;
}
function updateParseStatus() {
  const { steps, warn } = compile(SCRIPT);
  const users = steps.filter(s => s.t === 'user').length;
  const claude = steps.filter(s => s.t === 'claude').length;
  $('#parseStatus').innerHTML = `✓ ${users} ${users === 1 ? 'message' : 'messages'} from you · ${claude} ${claude === 1 ? 'answer' : 'answers'} from Claude`
    + warn.slice(0, 4).map(w => `<span class="w">⚠ ${esc(w)}</span>`).join('');
}
function syncPanel() {
  $$('#modeSeg button').forEach(b => b.classList.toggle('on', b.dataset.mode === S.mode));
  $('#modeHint').innerHTML = MODE_HINTS[S.mode];
  $$('[data-k]').forEach(el => {
    const k = el.dataset.k;
    if (el.type === 'checkbox') el.checked = !!S[k];
    else if (document.activeElement !== el) el.value = S[k];
  });
  $$('output[data-o]').forEach(o => {
    const k = o.dataset.o, v = S[k];
    o.textContent = k === 'speed' ? Number(v).toFixed(2) + '×' : k === 'fontSize' ? v + 'px' : String(v);
  });
  updateRunState();
}
function onSettingChanged(k) {
  if (k === 'models') {
    MODELS = parseModels(S.models);
    st.model = findModel(st.model ? st.model.name : '') || MODELS[0];
  }
  renderAll();
}
function initPanel() {
  const ta = $('#script');
  ta.value = SCRIPT;
  let tmr;
  ta.addEventListener('input', () => {
    SCRIPT = ta.value;
    clearTimeout(tmr);
    tmr = setTimeout(() => { lsSet(LS_SCRIPT, SCRIPT); updateParseStatus(); }, 300);
  });
  ta.addEventListener('keydown', e => {
    if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault();
      const a = ta.selectionStart, b = ta.selectionEnd;
      ta.setRangeText('  ', a, b, 'end');
      ta.dispatchEvent(new Event('input'));
    }
  });
  $$('#panel nav button').forEach(b => b.addEventListener('click', () => {
    $$('#panel nav button').forEach(x => x.classList.toggle('on', x === b));
    $$('#panel section').forEach(s => s.classList.toggle('on', s.dataset.pane === b.dataset.tab));
  }));
  $('#pClose').addEventListener('click', () => togglePanel(false));
  $$('#modeSeg button').forEach(b => b.addEventListener('click', () => { S.mode = b.dataset.mode; saveS(); syncPanel(); restart(); }));
  $('#bPlay').addEventListener('click', () => { lsSet(LS_SCRIPT, SCRIPT); togglePanel(false); restart(); startNow(); });
  $('#bRestart').addEventListener('click', () => { lsSet(LS_SCRIPT, SCRIPT); restart(); toast('↺ Restarted'); });
  $('#bFull').addEventListener('click', () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(() => {});
  });
  $('#bOpen').addEventListener('click', () => $('#fileIn').click());
  $('#fileIn').addEventListener('change', async e => {
    const f = e.target.files[0];
    if (!f) return;
    ta.value = SCRIPT = await f.text();
    lsSet(LS_SCRIPT, SCRIPT);
    updateParseStatus();
    e.target.value = '';
    restart();
  });
  $('#bSave').addEventListener('click', () => {
    const t = compile(SCRIPT).hdr;
    const name = String(t.titulo || t.title || 'script').replace(/[\\/:*?"<>|]+/g, '').trim().replace(/\s+/g, '-') || 'script';
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([SCRIPT], { type: 'text/plain;charset=utf-8' }));
    a.download = name + '.txt';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1500);
  });
  $('#bExample').addEventListener('click', () => {
    if (SCRIPT.trim() && SCRIPT !== EXAMPLE && !confirm('Replace your current script with the example?')) return;
    ta.value = SCRIPT = EXAMPLE;
    lsSet(LS_SCRIPT, SCRIPT);
    updateParseStatus();
    restart();
  });
  $('#bModelsReset').addEventListener('click', () => { S.models = DEFAULT_MODELS; saveS(); syncPanel(); onSettingChanged('models'); });
  $('#bSettingsReset').addEventListener('click', () => {
    if (!confirm('Reset all settings?')) return;
    const mode = S.mode;
    S = Object.assign({}, DEF, { mode });
    saveS(); syncPanel(); MODELS = parseModels(S.models); restart();
  });
  $$('#insRow button').forEach(b => b.addEventListener('click', () => {
    const snip = b.dataset.snip, a = ta.selectionStart, before = ta.value.slice(0, a);
    const pre = before && !before.endsWith('\n') ? '\n' : '';
    ta.setRangeText(pre + snip + '\n', a, ta.selectionEnd, 'end');
    ta.focus();
    ta.dispatchEvent(new Event('input'));
  }));
  $$('[data-k]').forEach(el => {
    const k = el.dataset.k;
    const ev = (el.tagName === 'SELECT' || el.type === 'checkbox') ? 'change' : 'input';
    el.addEventListener(ev, () => {
      let v = el.type === 'checkbox' ? el.checked : (el.type === 'number' || el.type === 'range') ? parseFloat(el.value) : el.value;
      if ((el.type === 'number' || el.type === 'range') && !isFinite(v)) return;
      S[k] = v;
      if (k === 'theme' && THEMES[v]) { S.bg = THEMES[v].bg; S.fg = THEMES[v].fg; }
      if (k === 'bg' || k === 'fg') S.theme = 'custom';
      if (k === 'version') st.hdr.version = String(v).replace(/^v/i, '') || '2.1.98';
      saveS();
      syncPanel();
      onSettingChanged(k);
    });
  });
  syncPanel();
  updateParseStatus();
}

/* ════════════════════ Startup ════════════════════ */
applyTheme();
initPanel();
resetState();
renderAll();
run();
if (firstRun) togglePanel(true);
else toast(S.mode === 'auto' ? 'F2 · script panel · Space to start' : S.mode === 'magic' ? 'F2 · script panel · type to write your line' : 'F2 · script panel', 2600);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { measure(); renderAll(); });
})();
