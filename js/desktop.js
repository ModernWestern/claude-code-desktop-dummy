(() => {
'use strict';

/* ════════════════════ Utilities ════════════════════ */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const norm = s => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
const num = s => { const m = String(s ?? '').replace(',', '.').match(/-?\d+(\.\d+)?/); return m ? parseFloat(m[0]) : null; };
const h = html => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };

/* ════════════════════ Icons ════════════════════ */
const P = {
  plus: '<path d="M12 5v14M5 12h14"/>',
  chev: '<path d="m6 9 6 6 6-6"/>',
  chevR: '<path d="m9 18 6-6-6-6"/>',
  up: '<path d="m5 12 7-7 7 7M12 19V5"/>',
  stop: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/>',
  copy: '<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
  thumbUp: '<path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/>',
  thumbDown: '<path d="M17 14V2"/><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z"/>',
  retry: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
  sliders: '<path d="M21 4h-7M10 4H3M21 12h-9M8 12H3M21 20h-5M12 20H3M14 2v4M8 10v4M16 18v4"/>',
  clock: '<circle cx="12" cy="12" r="9.5"/><path d="M12 7v5l3 2"/>',
  chats: '<path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z"/><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/>',
  folder: '<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
  shapes: '<path d="M8.3 10a.7.7 0 0 1-.626-1.079L11.4 3a.7.7 0 0 1 1.198-.043L16.3 8.9a.7.7 0 0 1-.572 1.1Z"/><rect x="3" y="14" width="7" height="7" rx="1"/><circle cx="17.5" cy="17.5" r="3.5"/>',
  code: '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20"/>',
  terminal: '<path d="m4 17 6-6-6-6M12 19h8"/>',
  file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4M10 9H8M16 13H8M16 17H8"/>',
  pencil: '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>',
  wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  panel: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  updown: '<path d="m7 15 5 5 5-5M7 9l5-5 5 5"/>',
  pen: '<path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"/>',
  cap: '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
  coffee: '<path d="M10 2v2M14 2v2M6 2v2M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"/>',
  bulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5M9 18h6M10 22h4"/>',
  min: '<path d="M5 12h14"/>', max: '<rect x="5" y="5" width="14" height="14" rx="1.5"/>', x: '<path d="M6 6l12 12M18 6 6 18"/>',
  warn: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4M12 17h.01"/>',
  help: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"/>',
  back: '<path d="M19 12H5M12 19l-7-7 7-7"/>', fwd: '<path d="M5 12h14M12 5l7 7-7 7"/>',
  chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  laptop: '<rect x="4" y="5" width="16" height="11" rx="1.5"/><path d="M2 19h20"/>',
  diff: '<path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2zM9 13h6M12 10v6"/>',
  dots: '<circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/>',
  enter: '<path d="M20 5v7a3 3 0 0 1-3 3H5M9 11l-4 4 4 4"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M19 11a7 7 0 0 1-14 0M12 18v3"/>',
  bug: '<path d="M12 20v-9M14 7a4 4 0 0 1 4 4v3a6 6 0 0 1-12 0v-3a4 4 0 0 1 4-4zM14.12 3.88 16 2M8 2l1.88 1.88M9 7.13v-1a3 3 0 0 1 6 0v1M6 13H2M22 13h-4M3 21c0-2.1 1.7-3.9 3.8-4M20.97 5c0 2.1-1.6 3.8-3.5 4M3 5c0 2.1 1.6 3.8 3.5 4M21 21c0-2.1-1.7-3.9-3.8-4"/>',
};
const VERBS = ['Thinking', 'Pondering', 'Cogitating', 'Clauding', 'Musing', 'Brewing', 'Percolating', 'Ruminating', 'Noodling', 'Mulling', 'Synthesizing', 'Reticulating'];
const pickVerb = () => VERBS[Math.floor(Math.random() * VERBS.length)];
const fmtDur = s => s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`;
const fmtTok = n => { n = Math.round(n); return n >= 1e6 ? `${(n / 1e6).toFixed(n >= 1e7 ? 0 : 1)}M` : n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n); };
// "Question" icon from Phosphor Icons (regular, MIT license), as shipped in @phosphor-icons/core 2.1.1.
const HELP_ICON = '<svg class="help" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M140,180a12,12,0,1,1-12-12A12,12,0,0,1,140,180ZM128,72c-22.06,0-40,16.15-40,36v4a8,8,0,0,0,16,0v-4c0-11,10.77-20,24-20s24,9,24,20-10.77,20-24,20a8,8,0,0,0-8,8v8a8,8,0,0,0,16,0v-.72c18.24-3.35,32-17.9,32-35.28C168,88.15,150.06,72,128,72Zm104,56A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"/></svg>';
const ic = (name, cls = '') => `<svg class="i ${cls}" viewBox="0 0 24 24">${P[name] || ''}</svg>`;
const SPARK_RAYS = [[0,10.6],[29,8.2],[61,10.2],[92,7.6],[121,10.4],[150,8.4],[182,9.8],[211,7.8],[240,10.6],[270,8],[301,10],[331,8.6]];
const spark = (live = false) => `<svg class="spark${live ? ' live' : ''}" viewBox="0 0 24 24">${SPARK_RAYS.map(([a, r], i) => {
  const rad = a * Math.PI / 180, c = Math.cos(rad), s = Math.sin(rad);
  return `<line x1="${(12 + c * 1.3).toFixed(2)}" y1="${(12 + s * 1.3).toFixed(2)}" x2="${(12 + c * r).toFixed(2)}" y2="${(12 + s * r).toFixed(2)}" style="animation-delay:${(-i * 0.11).toFixed(2)}s"/>`;
}).join('')}</svg>`;

/* ════════════════════ Interface texts ════════════════════ */
const L10N = {
  en: {
    newChat: 'New chat', chats: 'Chats', projects: 'Projects', artifacts: 'Artifacts', code: 'Code', recents: 'Recents', share: 'Share',
    phNew: 'Describe a task or ask a question', phReply: 'Reply to Claude...', home: n => `What’s up next, ${n}?`,
    stTabs: ['Overview', 'Models'], stRanges: ['All', '30d', '7d'],
    stLabels: ['Sessions', 'Messages', 'Total tokens', 'Active days', 'Peak hour', 'Favorite model'],
    moby: n => `You've used ~${n}× more tokens than Moby-Dick.`, disclaimer: 'Claude can make mistakes. Please double-check responses.',
    thinking: 'Thinking', thought: 'Thought process', ext: 'Extended thinking', extDesc: 'Think longer for complex tasks', more: 'More models',
    allowQ: n => `Allow Claude to use ${n}?`, deny: 'Deny', once: 'Allow once', always: 'Always allow', denied: 'Denied',
    interrupted: 'Claude’s response was interrupted.',
    capacity: 'Due to unexpected capacity constraints, Claude is unable to respond to your message. Please try again soon.',
    greet: hr => hr < 12 ? 'Good morning' : hr < 18 ? 'Good afternoon' : 'Good evening',
    chips: [['pen', 'Write'], ['cap', 'Learn'], ['code', 'Code'], ['coffee', 'Life stuff'], ['bulb', "Claude's choice"]],
    compacting: 'Compacting our conversation so we can keep chatting…', compacted: 'Conversation compacted',
    web: 'Searched the web', edited: 'Edited', todos: 'To-dos', running: 'Running…', read: 'Read', fetched: 'Fetched',
    plans: { max: 'Max', pro: 'Pro', team: 'Team', free: 'Free' },
    effort: 'Effort', faster: 'Faster', smarter: 'Smarter', recommended: 'Recommended',
    efforts: { low: 'Low', medium: 'Medium', high: 'High', xhigh: 'Extra high', max: 'Max', ultracode: 'Ultracode' },
    maxWarn: 'Claude thinks longer with Max effort and can consume 3.5× or more usage than Medium.',
    fastMode: 'Fast mode', enableFast: 'Enable fast mode',
    search: 'Search', newSession: 'New', customize: 'Customize', moreNav: 'More', noFolder: 'No folder',
    searched: 'Searched the web for', ran: 'Ran', thoughtFor: s => `Thought for ${s}s`,
    worked: (d, t) => `Worked for ${d} · ${t} tokens`,
  },
  es: {
    newChat: 'Nuevo chat', chats: 'Chats', projects: 'Proyectos', artifacts: 'Artefactos', code: 'Código', recents: 'Recientes', share: 'Compartir',
    phNew: 'Describe una tarea o haz una pregunta', phReply: 'Responder a Claude...', home: n => `¿Qué sigue, ${n}?`,
    stTabs: ['Resumen', 'Modelos'], stRanges: ['Todo', '30d', '7d'],
    stLabels: ['Sesiones', 'Mensajes', 'Tokens totales', 'Días activos', 'Hora pico', 'Modelo favorito'],
    moby: n => `Has usado ~${n}× más tokens que Moby-Dick.`, disclaimer: 'Claude puede cometer errores. Verifica las respuestas.',
    thinking: 'Pensando', thought: 'Proceso de pensamiento', ext: 'Pensamiento extendido', extDesc: 'Piensa más en tareas complejas', more: 'Más modelos',
    allowQ: n => `¿Permitir que Claude use ${n}?`, deny: 'Denegar', once: 'Permitir una vez', always: 'Permitir siempre', denied: 'Denegado',
    interrupted: 'Se interrumpió la respuesta de Claude.',
    capacity: 'Debido a limitaciones de capacidad inesperadas, Claude no puede responder a tu mensaje. Inténtalo de nuevo en breve.',
    greet: hr => hr < 12 ? 'Buenos días' : hr < 20 ? 'Buenas tardes' : 'Buenas noches',
    chips: [['pen', 'Escribir'], ['cap', 'Aprender'], ['code', 'Código'], ['coffee', 'Vida diaria'], ['bulb', 'Elección de Claude']],
    compacting: 'Compactando nuestra conversación para que podamos seguir hablando…', compacted: 'Conversación compactada',
    web: 'Buscó en la web', edited: 'Editó', todos: 'Tareas', running: 'Ejecutando…', read: 'Leyó', fetched: 'Consultó',
    plans: { max: 'Max', pro: 'Pro', team: 'Team', free: 'Gratis' },
    effort: 'Esfuerzo', faster: 'Más rápido', smarter: 'Más inteligente', recommended: 'Recomendado',
    efforts: { low: 'Bajo', medium: 'Medio', high: 'Alto', xhigh: 'Muy alto', max: 'Máximo', ultracode: 'Ultracode' },
    maxWarn: 'Claude piensa más con el esfuerzo Máximo y puede consumir 3.5× o más uso que Medio.',
    fastMode: 'Modo rápido', enableFast: 'Activar modo rápido',
    search: 'Buscar', newSession: 'Nuevo', customize: 'Personalizar', moreNav: 'Más', noFolder: 'Sin carpeta',
    searched: 'Buscó en la web', ran: 'Ejecutó', thoughtFor: s => `Pensó durante ${s}s`,
    worked: (d, t) => `Trabajó ${d} · ${t} tokens`,
  },
};
const T = () => L10N[S.lang] || L10N.en;

/* ════════════════════ Settings ════════════════════ */
// Format: alias | name | badge (optional, e.g. "Default")
const DEFAULT_MODELS = {
  en: ['opus | Opus 5.5', 'fable | Fable 5.1', 'sonnet | Sonnet 5.5', 'haiku | Haiku 5.5 | Default'].join('\n'),
  es: ['opus | Opus 5.5', 'fable | Fable 5.1', 'sonnet | Sonnet 5.5', 'haiku | Haiku 5.5 | Predeterminado'].join('\n'),
};
// Groups: one line per group; its sessions below with "- " ("* " = filled dot). A group without sessions is shown collapsed.
const DEFAULT_RECENTS = [
  'Website', 'Mobile app', 'Docs',
  'Backend', '* Fix login redirect loop', '- Add rate limiting to API', '- Migrate database to Postgres 17', '- Write integration tests',
  '- Refactor payment service', '- Investigate slow queries',
  'Design system',
  'Experiments', '* Prototype voice commands', '- Benchmark image pipeline', '- Try new chart library',
  'Research', 'Archive',
  'Ungrouped',
].join('\n');
// CLAWD_DURS, CLAWD_FRAMES and CLAWD_PAL live in js/clawd-frames.js.
function drawClawd(i) {
  const c = $('#clawd');
  if (!c) return;
  const P = 4;
  if (c.width !== 34 * P) { c.width = 34 * P; c.height = 23 * P; }
  const x = c.getContext('2d');
  x.clearRect(0, 0, c.width, c.height);
  CLAWD_FRAMES[i].split('/').forEach((row, r) => {
    for (let k = 0; k < row.length; k++) {
      const ch = row[k];
      if (ch === '.') continue;
      x.fillStyle = CLAWD_PAL[ch];
      x.fillRect((row.length - 1 - k) * P, r * P, P, P); // horizontal mirror: faces the right way
    }
  });
}
// Idle and, every 8-16 s, the full sequence: blink → takes out the laptop → types → puts it away.
let clawdT;
function clawdIdle() {
  drawClawd(0);
  clearTimeout(clawdT);
  clawdT = setTimeout(() => clawdPlay(1), 8000 + Math.random() * 8000);
}
function clawdPlay(i) {
  if (i >= CLAWD_FRAMES.length) { clawdIdle(); return; }
  drawClawd(i);
  clawdT = setTimeout(() => clawdPlay(i + 1), CLAWD_DURS[i]);
}
function parseGroups(txt) {
  const groups = [];
  for (const raw of String(txt || '').split('\n')) {
    const l = raw.trim();
    if (!l) continue;
    const m = raw.match(/^\s*([-*])\s+(.*)$/);
    if (m && groups.length) groups[groups.length - 1].items.push({ t: m[2].trim(), f: m[1] === '*' });
    else groups.push({ name: l, items: [] });
  }
  return groups;
}
function fmtStatsHeat(days, seed) {
  // 26 weeks × 7 days; the last "days" days have activity (like the real app).
  const cols = 26, total = cols * 7, todayIdx = total - 6;
  let x = seed || 7; const rnd = () => (x = (x * 9301 + 49297) % 233280) / 233280;
  const cells = [];
  for (let c = 0; c < cols; c++) for (let r = 0; r < 7; r++) {
    const idx = c * 7 + r;
    if (idx > todayIdx) { cells[r * cols + c] = 'x'; continue; }
    const age = todayIdx - idx;
    cells[r * cols + c] = age < days + 4 && rnd() < 0.9 ? 'l' + (1 + Math.floor(rnd() * 3)) : '';
  }
  return cells.map(k => `<i class="${k}"></i>`).join('');
}
const DEF = {
  mode: 'magic', theme: 'light', lang: 'en', frame: 'none', zoom: 1, serif: 'Segoe UI Variable Text', sans: 'Segoe UI Variable Text',
  sidebar: true, chips: false, fakeCursor: true, mouseSpeed: 1,
  speed: 1, typeCps: 14, reveal: 'stream', streamCps: 170, charsPerKey: 1, startDelay: 1,
  hideMouse: true, toasts: true, recents: DEFAULT_RECENTS, models: '',
};
const LS_S = 'ccsim.desktop.settings.v3', LS_SCRIPT = 'ccsim.script.v1';
const lsGet = k => { try { return localStorage.getItem(k); } catch { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, v); } catch {} };
let S = Object.assign({}, DEF, (() => { try { return JSON.parse(lsGet(LS_S) || '{}'); } catch { return {}; } })());
const saveS = () => lsSet(LS_S, JSON.stringify(S));
const EXAMPLE = (window.EXAMPLE_SCRIPT || '').replace(/^\s*\n/, ''); // js/example-script.js
const storedScript = lsGet(LS_SCRIPT);
const firstRun = lsGet(LS_S) == null;
// An old built-in example saved in the browser is replaced by the current one; a script you wrote is kept.
const isOldExample = t => (/GUION DE EJEMPLO/.test(t || '') && /agujeros negros/i.test(t || '')) || (/CLAUDE SIMULATOR · EXAMPLE SCRIPT/.test(t || '') && /^(@user: Alex|user: ultrathink .*)$/m.test(t || ''));
let SCRIPT = storedScript && storedScript.trim() && !isOldExample(storedScript) ? storedScript : EXAMPLE;
if (storedScript && isOldExample(storedScript)) lsSet(LS_SCRIPT, EXAMPLE);
// Old default sidebar → the new generic one.
if (/Interfaz Claude simulada para videos|MCP Obsidian/.test(S.recents || '')) { S.recents = DEFAULT_RECENTS; saveS(); }

// "Effort" slider levels (left to right). "Recommended" = medium.
const EFFORTS = ['low', 'medium', 'high', 'xhigh', 'max', 'ultracode'];
const REC_EFFORT = 1;
// Position (%) of each level: at Low and Ultracode the thumb sits flush with the ends of the bar.
const EPOS = i => 4.07 + i * (91.86 / 5);
const EFFORT_DELAY = { low: 1300, medium: 2400, high: 3600, xhigh: 4800, max: 6000, ultracode: 8000 };
const EFFORT_ALIAS = { bajo:'low', baja:'low', low:'low', minimo:'low', medio:'medium', media:'medium', medium:'medium', normal:'medium', alto:'high', alta:'high', high:'high', xhigh:'xhigh', extra:'xhigh', muyalto:'xhigh', altisimo:'xhigh', max:'max', maximo:'max', maxima:'max', maximum:'max', ultracode:'ultracode', ultra:'ultracode' };
const normEff = q => norm(q).replace(/muy\s+alt[oa]/g, 'muyalto').replace(/extra\s+high/g, 'xhigh');
let MODELS = [];
function parseModels(txt) {
  const out = String(txt || '').split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('//')).map(l => {
    const p = l.split('|').map(x => x.trim());
    return { alias: norm(p[0]), name: p[1] || p[0], badge: p[2] || '' };
  });
  return out.length ? out : parseModels(DEFAULT_MODELS[S.lang] || DEFAULT_MODELS.en);
}
function findModel(q) {
  q = norm(q).replace(/\s+/g, ' ');
  if (!q) return null;
  if (/^(default|predeterminado)$/.test(q)) return MODELS.find(m => m.badge) || MODELS[0];
  return MODELS.find(m => m.alias === q) || MODELS.find(m => norm(m.name) === q)
    || MODELS.find(m => norm(m.name).includes(q)) || MODELS.find(m => m.alias && m.alias.includes(q)) || null;
}
function parseEffort(q) {
  for (const w of normEff(q).split(/[\s,;]+/)) if (EFFORT_ALIAS[w]) return EFFORT_ALIAS[w];
  return null;
}
function parseTarget(hid) {
  const r = { model: null, effort: null, fast: null };
  const words = normEff(hid).split(/[\s,;]+/).filter(Boolean), rest = [];
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    if (/^(fast|rapido)$/.test(w)) { r.fast = !(i > 0 && /^(sin|no|off)$/.test(words[i - 1])); continue; }
    if (/^(sin|no|off|modo|mode)$/.test(w)) continue;
    if (/^(pensamiento|thinking|extendido|extended)$/.test(w)) { if (!r.effort) r.effort = 'high'; continue; }
    if (EFFORT_ALIAS[w] && !r.effort) r.effort = EFFORT_ALIAS[w]; else rest.push(w);
  }
  if (rest.length) r.model = findModel(rest.join(' ')) || findModel(rest[0]);
  return r;
}

/* ════════════════════ Script parser (same as the terminal version) ════════════════════ */
const BLOCKS = {
  yo: 'user', user: 'user', usuario: 'user', humano: 'user', human: 'user',
  claude: 'claude', assistant: 'claude', asistente: 'claude',
  razonamiento: 'reasoning', pensamiento: 'reasoning', thinking: 'reasoning', reasoning: 'reasoning',
  tool: 'tool', herramienta: 'tool', 'tool-error': 'toolerr', 'herramienta-error': 'toolerr', toolerror: 'toolerr',
  editar: 'edit', edit: 'edit', tareas: 'todos', todos: 'todos', todo: 'todos', permiso: 'perm', permission: 'perm',
};
const MODE_ALIAS = { normal:'normal', default:'normal', plan:'plan', edits:'edits', edit:'edits', aceptar:'edits', accept:'edits', bypass:'bypass', yolo:'bypass' };
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
function trimBlank(arr) { let a = 0, b = arr.length; while (a < b && !arr[a].trim()) a++; while (b > a && !arr[b - 1].trim()) b--; return arr.slice(a, b); }
function parseCall(hd) { hd = String(hd || '').trim(); const m = hd.match(/^([^(]+?)\s*\(([\s\S]*)\)\s*$/); return m ? { name: m[1].trim(), args: m[2] } : { name: hd || 'Tool', args: null }; }
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
  for (const d of out) { if (d.s === ' ') { d.n = n; o++; n++; } else if (d.s === '-') { d.n = o; o++; } else { d.n = n; n++; } }
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
      const text = all.join('\n').replace(/\{([^}]*)\}/g, (_, x) => { hidden = (hidden ? hidden + ' ' : '') + x; return ''; }).replace(/[ \t]+$/gm, '').trim();
      return { t: 'user', text, hidden, line: c.line };
    }
    case 'claude': return { t: 'claude', md: all.join('\n'), line: c.line };
    case 'reasoning': {
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
    if ((m = raw.match(/^\[\s*([^\s\]]+)\s*(.*?)\s*\]\s*$/)) && DIR_ALIAS[norm(m[1])]) { flush(); steps.push(Object.assign(DIRS[DIR_ALIAS[norm(m[1])]](m[2]), { line: n + 1 })); continue; }
    if ((m = raw.match(/^([A-Za-zÁÉÍÓÚÜÑáéíóúüñ][A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9_-]*)\s*:(.*)$/)) && BLOCKS[norm(m[1])]) { flush(); cur = { t: BLOCKS[norm(m[1])], head: m[2].replace(/^\s+/, ''), lines: [], line: n + 1 }; continue; }
    if (/^\/(model|effort|clear|compact)\b/i.test(raw) && (!cur || cur.t === 'user')) { flush(); cur = { t: 'user', head: raw.trim(), lines: [], line: n + 1 }; continue; }
    if (cur) cur.lines.push(raw);
    else if (raw.trim()) warn.push(`Line ${n + 1}: text outside a block (missing "user:" or "claude:"?)`);
  }
  flush();
  const out = [];
  for (const s of steps) {
    if (s.t === 'choose') { const p = [...out].reverse().find(x => x.t === 'perm'); if (p) p.choice = s.n; else warn.push(`Line ${s.line}: [choose] without a "permission:" before it`); }
    else out.push(s);
  }
  return { steps: out, hdr, warn };
}

/* ════════════════════ Markdown → HTML (claude.ai style) ════════════════════ */
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
  s = esc(s);
  s = s.replace(/\*\*(?=\S)([\s\S]*?\S)\*\*/g, '<strong>$1</strong>').replace(/__(?=\S)([\s\S]*?\S)__/g, '<strong>$1</strong>');
  s = s.replace(/(^|[^*\w])\*(?=\S)([^*\n]*?\S)\*(?!\*)/g, '$1<em>$2</em>');
  s = s.replace(/(^|[^\w])_(?=\S)([^_\n]*?\S)_(?!\w)/g, '$1<em>$2</em>');
  s = s.replace(/~~(?=\S)([\s\S]*?\S)~~/g, '<s>$1</s>');
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a>$1</a>');
  s = s.replace(/\u0001(\d+)\u0002/g, (_, n) => `<code>${esc(codes[+n])}</code>`);
  return s;
}
const splitRow = l => { let s = l.trim(); if (s.startsWith('|')) s = s.slice(1); if (s.endsWith('|')) s = s.slice(0, -1); return s.split('|').map(x => x.trim()); };
const TABLE_SEP = /^\s*\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)*\|?\s*$/;
const LIST_RE = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/;
const HR_RE = /^\s*([-*_])(\s*\1){2,}\s*$/;
const isTableAt = (lines, i) => lines[i].includes('|') && i + 1 < lines.length && lines[i + 1].includes('|') && TABLE_SEP.test(lines[i + 1]);
const isBlockStart = (lines, i) => /^\s*(```|~~~)/.test(lines[i]) || /^#{1,6}\s/.test(lines[i]) || LIST_RE.test(lines[i]) || /^\s*>/.test(lines[i]) || HR_RE.test(lines[i]) || isTableAt(lines, i);
function listHTML(items) {
  const indents = [];
  for (const it of items) {
    while (indents.length && it.indent < indents[indents.length - 1]) indents.pop();
    if (!indents.length || it.indent > indents[indents.length - 1]) indents.push(it.indent);
    it.depth = indents.length - 1;
  }
  let html = '';
  const stack = [];
  for (const it of items) {
    while (stack.length && stack[stack.length - 1].depth > it.depth) html += `</li></${stack.pop().tag}>`;
    const top = stack[stack.length - 1];
    if (!top || top.depth < it.depth) {
      const tag = it.ordered ? 'ol' : 'ul';
      html += `<${tag}${it.ordered && it.num !== 1 ? ` start="${it.num}"` : ''}>`;
      stack.push({ tag, depth: it.depth });
    } else html += '</li>';
    html += `<li>${inline(it.text)}`;
  }
  while (stack.length) html += `</li></${stack.pop().tag}>`;
  return html;
}
function mdHTML(src) {
  const lines = String(src || '').replace(/\r/g, '').split('\n');
  const out = [];
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
      out.push(`<pre><div class="ch"><span>${esc(lang || 'text')}</span></div><code>${highlight(code.join('\n'), lang)}</code></pre>`);
      continue;
    }
    if ((m = line.match(/^(#{1,6})\s+(.*?)\s*#*\s*$/))) { const d = Math.min(3, m[1].length); out.push(`<h${d}>${inline(m[2])}</h${d}>`); i++; continue; }
    if (HR_RE.test(line)) { out.push('<hr>'); i++; continue; }
    if (isTableAt(lines, i)) {
      const head = splitRow(line);
      const aligns = splitRow(lines[i + 1]).map(c => /^:-+:$/.test(c) ? 'center' : /-:$/.test(c) ? 'right' : 'left');
      const rows = [];
      i += 2;
      while (i < lines.length && lines[i].includes('|') && lines[i].trim()) { rows.push(splitRow(lines[i])); i++; }
      const st = c => aligns[c] && aligns[c] !== 'left' ? ` style="text-align:${aligns[c]}"` : '';
      out.push(`<div class="tbl"><table><thead><tr>${head.map((c, k) => `<th${st(k)}>${inline(c)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${head.map((_, k) => `<td${st(k)}>${inline(r[k] || '')}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);
      continue;
    }
    if (/^\s*>/.test(line)) {
      const q = [];
      while (i < lines.length && /^\s*>/.test(lines[i])) { q.push(lines[i].replace(/^\s*>\s?/, '')); i++; }
      out.push(`<blockquote>${q.map(inline).join('<br>')}</blockquote>`);
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
      out.push(listHTML(items));
      continue;
    }
    const p = [];
    do { p.push(lines[i].replace(/^\s+/, '')); i++; } while (i < lines.length && lines[i].trim() && !isBlockStart(lines, i));
    out.push(`<p>${p.map(inline).join('<br>')}</p>`);
  }
  return out.join('');
}

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
let turn = null;
function cancelAll() { gen++; const ps = [...pendings]; pendings.clear(); ps.forEach(p => p.reject(new Cancel())); turn = null; }
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

/* ════════════════════ State ════════════════════ */
const st = {
  steps: [], warn: [], hdr: {}, input: '', model: null, effort: 'medium', thinking: false, fast: false,
  title: '', titled: false, empty: true, generating: false, menu: null, effortPop: null, micro: null, permWaiter: null,
  magic: null, free: null, paused: false, detailed: false, waitingStart: false, startResolve: null,
  playing: false, finished: false, recents: [], cur: -1,
};
const elThread = $('#thread'), elScroll = $('#scroll'), elMain = $('#main');
const scrollBottom = () => { elScroll.scrollTop = elScroll.scrollHeight; };

/* ════════════════════ Interface rendering ════════════════════ */
function planLabel(p) {
  const n = norm(p), L = T().plans;
  if (/max/.test(n)) return L.max;
  if (/pro/.test(n)) return L.pro;
  if (/team|equipo/.test(n)) return L.team;
  if (/free|gratis|gratuito/.test(n)) return L.free;
  return p;
}
function applyTheme() {
  const r = document.documentElement;
  r.classList.toggle('dark', S.theme === 'dark');
  r.style.setProperty('--zoom', S.zoom);
  r.lang = S.lang;
}
// Warns if a chosen font is not available (e.g. Google Fonts offline) and the browser falls back to another.
async function checkFont(name) {
  if (!name || name === 'sans' || name === 'system-ui' || !document.fonts) return;
  try { await document.fonts.load(`20px "${name}"`); } catch {}
  if (!document.fonts.check(`20px "${name}"`)) toast(`The font "${name}" is not available on this computer, so another one is used.`, 4500);
}
function renderStatic() {
  $$('[data-ic]').forEach(el => { if (el.dataset.done !== el.dataset.ic) { el.innerHTML = ic(el.dataset.ic); el.dataset.done = el.dataset.ic; } });
  $$('[data-l]').forEach(el => { el.textContent = T()[el.dataset.l]; });
  $('#side').classList.toggle('hide', !S.sidebar);
  $('#tbLeft').classList.toggle('hide', !S.sidebar);
  const H = st.hdr;
  $('#avatar').innerHTML = spark();
  $('#uname').textContent = H.user || 'User';
  $('#uplan').textContent = ' · ' + planLabel(H.plan || 'Claude Max');
  $('#folderBadge').textContent = H.folder || T().noFolder;
  const hr = new Date().getHours();
  $('#greet').innerHTML = '';
  $('#hgreet').innerHTML = spark() + `<h1>${esc(H.greeting || T().home(H.user || 'there'))}</h1>`;
  const L = T(), SS = H.stats;
  $('#stats').innerHTML = `<div class="st-tabs"><span class="on">${L.stTabs[0]}</span><span>${L.stTabs[1]}</span><span class="sp"></span><span class="on">${L.stRanges[0]}</span><span>${L.stRanges[1]}</span><span>${L.stRanges[2]}</span></div>`
    + `<div class="st-grid">${[SS.sessions, SS.messages, SS.tokens, SS.days, SS.peak, SS.fav].map((v, i) => `<div class="st-tile"><div class="k">${esc(L.stLabels[i])}</div><div class="v${i === 5 ? ' n' : ''}">${esc(v)}</div></div>`).join('')}</div>`
    + `<div class="heat">${fmtStatsHeat(num(SS.days) || 15, 11)}</div>`
    + `<div class="st-note">${esc(L.moby(SS.moby))}</div>`;
  $('#ctxFolder').textContent = H.folder || T().noFolder;

  renderFrame();
  renderRecents();
  renderTitle();
  renderComposer();
}
function renderFrame() {
  $('#stage').className = S.frame === 'none' ? '' : 'framed f-' + S.frame;
}
// Sidebar: groups (collapsed, or expanded with their sessions). The script session lives in "Ungrouped".
function renderRecents(fresh = false) {
  const gs = st.groups, last = gs.length - 1;
  $('#groups').innerHTML = gs.map((g, gi) => {
    const open = g.items.length > 0, isUng = /^(ungrouped|sin grupo)$/i.test(g.name);
    const acts = isUng ? '' : `<span class="ga"><span>${ic('plus')}</span>${gi === 0 ? `<span>${ic('sliders')}</span>` : ''}</span>`;
    const head = `<div class="grp${open ? ' open' : ''}"><span class="gn">${esc(g.name)}</span><span class="gc">${ic('chevR')}</span><span class="sp"></span>${acts}</div>`;
    return head + g.items.map(it => `<div class="ses${it.cur ? ' cur' : ''}${it.cur && fresh ? ' fresh' : ''}"><span class="dot${it.f || it.cur ? ' f' : ''}"></span><span class="tt">${esc(it.t)}</span></div>`).join('');
  }).join('');
  $('.nav-item.new').classList.toggle('on', st.empty);
}function renderTitle() {
  $('#titleText').textContent = st.titled ? st.title : T().newSession;
  document.title = st.titled ? `${st.title} - Claude` : 'Claude';
}
function renderComposer() {
  $('#cText').textContent = st.input;
  $('#cPh').textContent = st.input ? '' : (st.empty ? T().phNew : T().phReply);
  $('#modelName').textContent = st.model ? st.model.name : '';
  $('#effortName').textContent = T().efforts[st.effort] || st.effort;
  $('#effortWarn').innerHTML = st.effort === 'max' ? ic('warn') : '';
  const sb = $('#sendBtn');
  sb.classList.toggle('stop', st.generating);
  sb.innerHTML = ic(st.generating ? 'stop' : 'enter');
  $('#modelBtn').classList.toggle('is-open', !!st.menu);
  $('#effortBtn').classList.toggle('is-open', !!st.effortPop);
  renderBusy();
}
function renderBusy() {
  const b = $('#busy');
  if (!st.generating) { b.innerHTML = '<span class="ring idle"></span>'; return; }
  if (!b.querySelector('.ring:not(.idle)')) b.innerHTML = '<span class="bt"></span><span class="ring"></span>';
  b.querySelector('.bt').textContent = st.tokTarget ? `↓ ${fmtTok(st.tok)} tokens` : '';
}
function setEmpty(v) { st.empty = v; elMain.classList.toggle('empty', v); $('#win').classList.toggle('empty', v); $('.nav-item.new').classList.toggle('on', v); renderTitle(); renderComposer(); }
function setInput(t) { st.input = t; renderComposer(); }

/* Model menu */
function renderMenu() {
  const m = $('#menu');
  if (!st.menu) { m.hidden = true; renderComposer(); return; }
  const L = T();
  m.innerHTML = MODELS.map((x, i) => `<div class="mi" data-i="${i}"><div class="mt"><span class="mn">${esc(x.name)}</span>${x.badge ? `<span class="badge">${esc(x.badge)}</span>` : ''}</div><div class="mc">${x === st.model ? ic('check') : `<span class="num">${i + 1}</span>`}</div></div>`).join('')
    + `<div class="mi more"><div class="mt"><span class="mn">${esc(L.more)}</span></div><div class="mc" style="color:var(--t3)">${ic('chevR')}</div></div>`
    + `<div class="msep"></div><div class="msec">${esc(L.fastMode)}</div>`
    + `<div class="mi" data-act="fast"><div class="mt"><span class="mn">${esc(L.enableFast)}</span></div><div class="sw${st.fast ? ' on' : ''}"><i></i></div></div>`;
  m.hidden = false;
  const r = $('#modelBtn').getBoundingClientRect();
  const mh = m.offsetHeight, mw = m.offsetWidth;
  m.style.left = Math.max(8, Math.min(innerWidth - mw - 8, r.right - mw)) + 'px';
  m.style.top = (r.bottom + 8 + mh < innerHeight - 8 ? r.bottom + 8 : Math.max(8, r.top - 8 - mh)) + 'px';
  renderComposer();
  refreshHover();
}
function openMenu() { closeEffort(); st.menu = {}; renderMenu(); }
function closeMenu() {
  if (!st.menu) return;
  st.menu = null;
  renderMenu();
  // Only in Free mode does a real mouse selection finish the script step.
  if (st.micro && st.micro.manual && st.micro.kind === 'model') finishMicro(st.micro);
}
function selectModel(i) {
  if (MODELS[i]) st.model = MODELS[i];
  closeMenu();
}
function toggleFast() { st.fast = !st.fast; renderMenu(); }
$('#modelBtn').addEventListener('click', e => { e.stopPropagation(); if (st.menu) closeMenu(); else openMenu(); });
$('#menu').addEventListener('click', e => {
  e.stopPropagation();
  const it = e.target.closest('.mi');
  if (!it) return;
  if (it.dataset.act === 'fast') toggleFast();
  else if (it.dataset.i != null) selectModel(+it.dataset.i);
});

/* Effort picker (slider) */
function setEffort(e) {
  st.effort = e;
  st.thinking = EFFORTS.indexOf(e) >= 2;
  renderComposer();
}
function openEffort() {
  if (st.menu) closeMenu();
  st.effortPop = { dragPct: null };
  const L = T();
  const p = $('#effortPop');
  p.innerHTML = `<div class="ep-h"><span class="ep-t">${esc(L.effort)}</span><span class="ep-v" id="epV"></span><span class="ep-q">${HELP_ICON}</span></div>`
    + `<div class="ep-ends"><span>${esc(L.faster)}</span><span>${esc(L.smarter)}</span></div>`
    + `<div class="ep-track" id="epTrack"><div class="ep-fill" id="epFill"></div><canvas id="epCanvas"></canvas>${EFFORTS.map((_, i) => i === REC_EFFORT ? `<i class="ep-tick" style="left:${EPOS(i)}%"></i>` : `<i class="ep-dot" style="left:${EPOS(i)}%"></i>`).join('')}<div class="ep-thumb" id="epThumb"></div></div>`
    + `<div class="ep-rec"><span style="left:${EPOS(REC_EFFORT)}%">${esc(L.recommended)}</span></div>`
    + `<div class="ep-warn" id="epWarn">${ic('warn')}<span>${esc(L.maxWarn)}</span></div>`;
  p.hidden = false;
  syncEffort();
  renderComposer();
}
function syncEffort() {
  if (!st.effortPop) return;
  const ultra = st.effort === 'ultracode';
  const v = $('#epV');
  v.textContent = T().efforts[st.effort];
  v.classList.toggle('ultra', ultra);
  $('#epTrack').classList.toggle('ultra', ultra);
  const pct = st.effortPop.dragPct != null ? st.effortPop.dragPct : EPOS(EFFORTS.indexOf(st.effort));
  $('#epThumb').style.left = pct + '%';
  $('#epFill').style.width = pct + '%';
  $('#epWarn').hidden = st.effort !== 'max';
  if (ultra) startUltra(); else stopUltra();
  // Anchored at the bottom: the "Max" warning makes the popover grow upwards, like the app.
  const p = $('#effortPop'), r = $('#effortBtn').getBoundingClientRect();
  p.style.left = Math.max(8, Math.min(innerWidth - p.offsetWidth - 8, r.right - p.offsetWidth + 6)) + 'px';
  p.style.top = 'auto';
  p.style.bottom = (innerHeight - r.top + 8) + 'px';
}
function closeEffort() {
  if (!st.effortPop) return;
  st.effortPop = null;
  $('#effortPop').hidden = true;
  stopUltra();
  renderComposer();
}
function effortAtX(cx) {
  const r = $('#epTrack').getBoundingClientRect();
  const pct = Math.max(EPOS(0), Math.min(EPOS(EFFORTS.length - 1), (cx - r.left) / r.width * 100));
  let best = 0;
  EFFORTS.forEach((_, i) => { if (Math.abs(EPOS(i) - pct) < Math.abs(EPOS(best) - pct)) best = i; });
  return { pct, idx: best };
}
function dragEffortTo(cx) {
  if (!st.effortPop) return;
  const { pct, idx } = effortAtX(cx);
  st.effortPop.dragPct = EPOS(idx); // the slider moves in steps, not continuously
  if (EFFORTS[idx] !== st.effort) setEffort(EFFORTS[idx]);
  syncEffort();
}
function endEffortDrag() { if (!st.effortPop) return; st.effortPop.dragPct = null; syncEffort(); }
$('#effortBtn').addEventListener('click', e => { e.stopPropagation(); if (st.effortPop) closeEffort(); else openEffort(); });
$('#effortPop').addEventListener('click', e => e.stopPropagation());
$('#effortPop').addEventListener('pointerdown', e => {
  if (!e.target.closest('#epTrack')) return;
  e.preventDefault();
  const sel = window.getSelection && window.getSelection(); if (sel) sel.removeAllRanges();
  st.effortPop.realDrag = true;
  dragEffortTo(e.clientX);
});
document.addEventListener('pointermove', e => { if (st.effortPop && st.effortPop.realDrag) dragEffortTo(e.clientX); });
document.addEventListener('pointerup', () => { if (st.effortPop && st.effortPop.realDrag) { st.effortPop.realDrag = false; endEffortDrag(); } });

/* Ultracode animation: pixels drifting right to left, fading from purple to white */
let ultraRAF = 0;
const cellHash = (a, b) => { let x = Math.imul(a, 374761393) + Math.imul(b, 668265263) | 0; x = Math.imul(x ^ (x >>> 13), 1274126177); return ((x ^ (x >>> 16)) >>> 0) / 4294967295; };
function drawUltra(ts) {
  const c = $('#epCanvas');
  if (!c || !c.offsetWidth) return;
  const dpr = devicePixelRatio || 1, W = c.offsetWidth, H = c.offsetHeight;
  if (c.width !== Math.round(W * dpr) || c.height !== Math.round(H * dpr)) { c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); }
  const ctx = c.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, W, H);
  const dark = document.documentElement.classList.contains('dark');
  const cell = 2.5, step = 4;
  const cols = Math.ceil(W / step), rows = Math.max(3, Math.floor((H - 4) / step));
  const y0 = (H - rows * step + (step - cell)) / 2;
  const off = Math.floor(ts / 85); // one column every 85 ms → the pixels move left
  const P = [112, 76, 236], Wc = dark ? [70, 64, 92] : [255, 255, 255];
  for (let col = 0; col < cols; col++) {
    const ramp = Math.pow((col + 0.5) / cols, 1.15);
    for (let r = 0; r < rows; r++) {
      const n = cellHash(col + off, r * 7 + 3);
      let v = ramp * 1.5 - (1 - n) * 0.58;
      if (v <= 0.04) continue;
      v = Math.min(1, v);
      const flick = 0.8 + 0.2 * cellHash(col + off, r + 99);
      const k = v * flick;
      ctx.fillStyle = `rgba(${Math.round(Wc[0] + (P[0] - Wc[0]) * k)},${Math.round(Wc[1] + (P[1] - Wc[1]) * k)},${Math.round(Wc[2] + (P[2] - Wc[2]) * k)},${(0.45 + 0.55 * v).toFixed(3)})`;
      ctx.fillRect(col * step, y0 + r * step, cell, cell);
    }
  }
}
function startUltra() { if (ultraRAF) return; const loop = ts => { drawUltra(ts); ultraRAF = requestAnimationFrame(loop); }; ultraRAF = requestAnimationFrame(loop); }
function stopUltra() { if (ultraRAF) cancelAnimationFrame(ultraRAF); ultraRAF = 0; }

document.addEventListener('click', e => {
  if (st.menu && !e.target.closest('#menu')) closeMenu();
  if (st.effortPop && !e.target.closest('#effortPop')) closeEffort();
});
document.addEventListener('click', e => {
  const th = e.target.closest('.th-head, .tl-head');
  if (th) th.parentElement.classList.toggle('open');
  const pb = e.target.closest('.pb');
  if (pb && st.permWaiter) choosePerm(+pb.dataset.c);
});

/* Animated cursor: curved path, smooth acceleration, slight jitter and a final correction */
const cur = $('#fakeCursor');
const curPos = { x: innerWidth * 0.68, y: innerHeight * 0.9 };
let curHideT, hovEl = null;
function setCursor(x, y) {
  curPos.x = x; curPos.y = y;
  cur.style.transform = `translate(${(x - 3).toFixed(1)}px,${(y - 2).toFixed(1)}px)`;
  refreshHover();
}
function refreshHover() {
  let t = null;
  if (cur.classList.contains('on')) {
    const el = document.elementFromPoint(curPos.x, curPos.y);
    t = el && el.closest('.mi, .pb, .nav-item, #modelBtn, #effortBtn, .chip, .act, .cb, #sendBtn');
  }
  if (t === hovEl) return;
  if (hovEl) hovEl.classList.remove('hov');
  hovEl = t;
  if (hovEl) hovEl.classList.add('hov');
}
function showCursor() {
  clearTimeout(curHideT);
  if (cur.classList.contains('on')) return;
  cur.style.transition = 'opacity .35s';
  setCursor(curPos.x, curPos.y);
  cur.classList.add('on');
}
function hideCursorSoon() {
  clearTimeout(curHideT);
  curHideT = setTimeout(() => { cur.classList.remove('on'); refreshHover(); }, 2200);
}
const easeInOut = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const bez = (a, b, c, d, t) => { const u = 1 - t; return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d; };
async function humanMove(x1, y1, o = {}) {
  const x0 = curPos.x, y0 = curPos.y, dist = Math.hypot(x1 - x0, y1 - y0);
  if (dist < 1.5) return;
  const pace = (o.fast ? 0.8 : 1) / (S.mouseSpeed || 1);
  const D = Math.min(3200, Math.max(1000, 950 + dist * 1.6)) * pace * (0.88 + Math.random() * 0.24);
  const ux = (x1 - x0) / dist, uy = (y1 - y0) / dist, nx = -uy, ny = ux;
  const bend = (Math.random() < 0.5 ? -1 : 1) * Math.min(170, dist * (0.14 + Math.random() * 0.2)) * (o.bend ?? 1);
  const over = o.noOvershoot ? 0 : Math.min(16, dist * 0.035) * (0.4 + Math.random() * 0.8);
  const tx = x1 + ux * over, ty = y1 + uy * over;
  const c1x = x0 + (tx - x0) * 0.3 + nx * bend, c1y = y0 + (ty - y0) * 0.3 + ny * bend;
  const c2x = x0 + (tx - x0) * 0.75 + nx * bend * 0.45, c2y = y0 + (ty - y0) * 0.75 + ny * bend * 0.45;
  let t = 0;
  while (t < 1) {
    await wait(16);
    t = Math.min(1, t + 16 / D);
    const e = easeInOut(t), j = (1 - e) * 0.9;
    setCursor(bez(x0, c1x, c2x, tx, e) + (Math.random() - 0.5) * j, bez(y0, c1y, c2y, ty, e) + (Math.random() - 0.5) * j);
    if (o.onMove) o.onMove(curPos.x, curPos.y);
  }
  if (over > 0.5) {
    const sx = curPos.x, sy = curPos.y, D2 = 170 + Math.random() * 140;
    let u = 0;
    while (u < 1) {
      await wait(16);
      u = Math.min(1, u + 16 / D2);
      const e = 1 - (1 - u) * (1 - u);
      setCursor(sx + (x1 - sx) * e, sy + (y1 - sy) * e);
      if (o.onMove) o.onMove(curPos.x, curPos.y);
    }
  }
}
function pointIn(el) {
  const r = el.getBoundingClientRect();
  const wx = Math.min(r.width * 0.3, 60), wy = r.height * 0.18;
  return { x: r.left + r.width * 0.5 + (Math.random() - 0.5) * 2 * wx, y: r.top + r.height * 0.52 + (Math.random() - 0.5) * 2 * wy };
}
async function clickCursor() { cur.classList.add('click'); await wait(95 + Math.random() * 50); cur.classList.remove('click'); }

/* Mouse actions: automatic, or one per key press */
async function doAct(a, fast) {
  const el = a.el();
  if (!S.fakeCursor || !el) {
    await wait(fast ? 150 : 400);
    if (a.drag) { setEffort(a.target); syncEffort(); } else a.run();
    await wait(fast ? 150 : 350);
    return;
  }
  showCursor();
  if (a.drag) {
    const r = el.getBoundingClientRect();
    await humanMove(r.left + r.width / 2 + (Math.random() - 0.5) * 4, r.top + r.height / 2 + (Math.random() - 0.5) * 6, { fast });
    await wait((fast ? 120 : 220) + Math.random() * 120);
    cur.classList.add('click');
    await wait(80);
    await humanMove(a.toX(), curPos.y + (Math.random() - 0.5) * 3, { fast, noOvershoot: true, bend: 0.06, onMove: x => dragEffortTo(x) });
    dragEffortTo(a.toX());
    await wait(fast ? 110 : 200);
    cur.classList.remove('click');
    endEffortDrag();
    await wait((fast ? 180 : 380) + Math.random() * 160);
    return;
  }
  const p = pointIn(el);
  await humanMove(p.x, p.y, { fast });
  await wait((fast ? 110 : 200) + Math.random() * (fast ? 100 : 240));
  await clickCursor();
  a.run();
  refreshHover();
  await wait((fast ? 180 : 330) + Math.random() * 200);
}
function finishMicro(M) { if (st.micro === M) st.micro = null; M.resolve(); }
async function runActions(kind, acts, driver) {
  if (driver === 'auto') {
    await wait(350);
    for (const a of acts) await doAct(a, false);
    hideCursorSoon();
    return;
  }
  await track(resolve => { st.micro = { kind, acts, i: 0, resolve, busy: false, manual: driver === 'manual' }; });
  hideCursorSoon();
}
async function microKey(e) {
  const M = st.micro;
  if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Dead'].includes(e.key)) return;
  e.preventDefault();
  if (M.manual) return;
  // Keys pressed during an animation are queued: none get lost.
  if (e.key === 'Enter') M.all = true; else M.queued = (M.queued || 0) + 1;
  if (M.busy) return;
  M.busy = true;
  try {
    while (st.micro === M && M.i < M.acts.length && (M.all || M.queued > 0)) {
      if (!M.all) M.queued--;
      await doAct(M.acts[M.i++], true);
    }
  } catch { return; }
  M.busy = false;
  if (st.micro === M && M.i >= M.acts.length) finishMicro(M);
}

/* ════════════════════ Message thread ════════════════════ */
function addUser(text) {
  setEmpty(false);
  elThread.appendChild(h(`<div class="m-user"><div class="bubble">${esc(text)}</div></div>`));
  scrollBottom();
}
function startTurnEl() {
  const el = h(`<div class="turn"><div class="blocks"></div><div class="status"></div></div>`);
  elThread.appendChild(el);
  setStatus(el, null);
  scrollBottom();
  return el;
}
// Live line at the end of the turn while Claude works (animated dots + timer).
const DOTS = { wave: 3, pinch: 3, fold: 4 };
const dotsHTML = kind => `<span class="dots ${kind}">${'<i></i>'.repeat(DOTS[kind])}</span>`;
const pickDots = () => ['wave', 'pinch', 'fold'][Math.floor(Math.random() * 3)];
// "··· 19m 55s · 2.9k tokens · Thinking" — updates itself every 250 ms.
function setStatus(turnEl, verb) {
  const s = turnEl.querySelector('.status');
  if (!s) return;
  s.dataset.t0 = performance.now();
  s.innerHTML = dotsHTML(Math.random() < 0.5 ? 'wave' : 'pinch') + (verb ? `<span class="sl">${esc(verb)}</span>` : '') + '<span class="sm"></span>';
  s.dataset.verb = verb ? '1' : '';
  tickLive();
}
const elapsedOf = el => Math.max(0, Math.floor((performance.now() - +el.dataset.t0) / 1000 * (S.speed || 1)));
function tickLive() {
  $$('.status', elThread).forEach(s => {
    const m = s.querySelector('.sm');
    if (!m) return;
    const parts = [fmtDur(elapsedOf(s))];
    if (st.tokTarget) parts.push(`${fmtTok(st.tok)} tokens`);
    if (!s.dataset.verb) parts.push(T().thinking);
    m.textContent = parts.join(' · ');
  });
  $$('.b-think.live .th-time', elThread).forEach(t => { t.textContent = fmtDur(elapsedOf(t)); });
}
setInterval(tickLive, 250);
function finishTurnEl(el, secs) {
  const s = el.querySelector('.status');
  if (s) s.remove();
  if (st.tokTarget) addBlock(el, `<div class="usage">${esc(T().worked(fmtDur(secs), fmtTok(st.tokTarget)))}</div>`);
}
const blocksOf = el => el.querySelector('.blocks');
function addBlock(turnEl, html) { const b = h(html); blocksOf(turnEl).appendChild(b); scrollBottom(); return b; }

// Live: "⁘ Analyzing slow LLM calls… 20m 27s ›" (four dots folding into the center).
function addThinking(turnEl, label) {
  const b = addBlock(turnEl, `<div class="b-think live${st.detailed ? ' open' : ''}"><button class="th-head" tabindex="-1">${dotsHTML('fold')}<span class="th-label">${esc(label)}</span><span class="th-time" data-t0="${performance.now()}"></span>${ic('chevR', 'chev')}</button><div class="th-body"></div></div>`);
  tickLive();
  return b;
}
function finishThinking(b, title, text, secs) {
  const lab = b.querySelector('.th-label');
  b.classList.remove('live');
  const d = b.querySelector('.dots');
  if (d) d.remove();
  lab.textContent = title || T().thoughtFor(secs);
  b.querySelector('.th-time').textContent = title ? fmtDur(secs) : '';
  b.querySelector('.th-body').textContent = text || '';
  if (!text) b.querySelector('.th-body').remove();
}
function toolInfo(name, args) {
  const n = norm(name), a = String(args ?? '').trim().replace(/^["'](.*)["']$/, '$1'), L = T();
  if (/search|busca/.test(n)) return { icon: 'globe', label: `${L.searched} “${a}”` };
  if (/fetch/.test(n)) return { icon: 'globe', label: `${L.fetched} ${a}` };
  if (n === 'bash' || /terminal|shell|command/.test(n)) return { icon: 'terminal', label: `${L.ran} ${a}` };
  if (/read|leer/.test(n)) return { icon: 'file', label: `${L.read} ${a}` };
  if (/write|edit|update/.test(n)) return { icon: 'pencil', label: `${L.edited} ${a}` };
  return { icon: 'wrench', label: a ? `${name}: ${a}` : name };
}
function addTool(turnEl, info) {
  return addBlock(turnEl, `<div class="b-tool${st.detailed ? ' open' : ''}"><button class="tl-head" tabindex="-1"><span class="tl-label shimmer">${esc(info.label)}</span><span class="tl-meta"></span>${ic('chevR', 'chev')}</button><div class="tl-body"></div></div>`);
}
function finishTool(b, meta, bodyHTML, isErr) {
  b.querySelector('.tl-label').classList.remove('shimmer');
  const m = b.querySelector('.tl-meta');
  m.textContent = meta ? ` · ${meta}` : '';
  m.classList.toggle('err', !!isErr);
  const body = b.querySelector('.tl-body');
  if (bodyHTML) body.innerHTML = bodyHTML; else body.remove();
}

/* ════════════════════ Playback engine ════════════════════ */
const driverFor = () => S.mode === 'auto' ? 'auto' : S.mode === 'magic' ? 'magic' : 'manual';
const isUiSlash = t => /^\/(model|effort|clear|compact)\b/i.test(String(t).trim());
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
const freeInput = () => track(resolve => { st.free = { resolve }; });
async function sendMessage(text) {
  const sb = $('#sendBtn');
  sb.classList.add('press');
  setTimeout(() => sb.classList.remove('press'), 120);
  setInput('');
  addUser(text);
}
const effortDelay = () => (EFFORT_DELAY[st.effort] || 2400) * (st.thinking ? 1 : 0.6) * (0.85 + Math.random() * 0.3);
function continuesTurn(steps, pc) {
  for (let j = pc; j < steps.length; j++) { if (TURN.has(steps[j].t)) return true; if (!INTURN.has(steps[j].t)) return false; }
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
        if (isUiSlash(s.text)) { await runSlash(s.text, s.hidden, driverFor()); continue; }
        await typeInput(s.text);
        await sendMessage(s.text);
        pc = await runTurn(steps, pc);
      } else if (TURN.has(s.t)) pc = await runTurn(steps, pc);
      else { await runMeta(s); pc++; }
    }
    st.playing = false; st.finished = true; updateRunState();
    if (S.mode === 'free') {
      for (;;) {
        const t = (await freeInput()).trim();
        if (isUiSlash(t)) await runSlash(t, null, 'manual'); else await sendMessage(t);
      }
    }
  } catch (e) { if (!(e instanceof Cancel)) console.error(e); }
}
async function freeStep(steps, pc) {
  const t = (await freeInput()).trim();
  if (isUiSlash(t)) {
    const cmd = t.split(/\s+/)[0].toLowerCase();
    if (steps[pc].text.split(/\s+/)[0].toLowerCase() === cmd) pc++;
    await runSlash(t, null, 'manual');
    return pc;
  }
  while (pc < steps.length && steps[pc].t === 'user' && isUiSlash(steps[pc].text)) pc++;
  if (pc < steps.length && steps[pc].t === 'user') pc++;
  await sendMessage(t);
  return runTurn(steps, pc);
}
async function runTurn(steps, pc) {
  const Tn = { interrupted: false, t0: performance.now() };
  turn = Tn;
  st.generating = true;
  // [tokens X]: the counter climbs during the turn until it reaches X.
  st.tokTarget = turnTokens(steps, pc);
  st.tok = 0;
  const tokTimer = st.tokTarget ? setInterval(() => {
    if (turn !== Tn) { clearInterval(tokTimer); return; }
    if (st.paused) return;
    st.tok += Math.max(st.tokTarget * 0.004, (st.tokTarget - st.tok) * 0.035);
    if (st.tok > st.tokTarget * 0.97) st.tok = st.tokTarget * 0.97;
    renderBusy();
  }, 60) : 0;
  renderComposer();
  const turnEl = startTurnEl();
  Tn.el = turnEl;
  let first = true, pendingThink = null, verb = null;
  while (pc < steps.length) {
    const s = steps[pc];
    if (!TURN.has(s.t) && !(INTURN.has(s.t) && continuesTurn(steps, pc))) break;
    pc++;
    if (Tn.interrupted) continue;
    if (s.t === 'think') { if (s.secs != null) pendingThink = s.secs; if (s.verb) verb = s.verb; continue; }
    if (s.t === 'pause') { await wait(s.secs * 1000, true); continue; }
    if (INTURN.has(s.t)) { await runMeta(s); continue; }
    if (s.t === 'interrupt') { if (pendingThink != null) await wait(pendingThink * 1000, true); Tn.interrupted = true; continue; }
    const ms = pendingThink != null ? pendingThink * 1000 : first ? effortDelay() : 600 + Math.random() * 700;
    pendingThink = null;
    const showThink = s.t === 'reasoning' || !!verb || (first && st.thinking);
    const tb = showThink ? addThinking(turnEl, verb || T().thinking) : null;
    // While the thinking block is live, the status line hides so the phrase is not shown twice.
    const stEl = turnEl.querySelector('.status');
    if (stEl) stEl.hidden = !!tb;
    await wait(ms, true);
    const secs = Math.max(1, Math.round(ms / 1000));
    if (tb) {
      const rs = s.t === 'reasoning' ? s : null;
      finishThinking(tb, (rs && rs.title) || verb || null, rs ? rs.text : '', secs);
    }
    if (stEl) stEl.hidden = false;
    verb = null;
    if (Tn.interrupted) continue;
    first = false;
    if (s.t === 'reasoning') continue;
    await runVisible(s, Tn, turnEl);
  }
  st.generating = false;
  clearInterval(tokTimer);
  st.tok = st.tokTarget;
  if (Tn.interrupted) addBlock(turnEl, `<div class="note">${esc(T().interrupted)}</div>`);
  finishTurnEl(turnEl, Math.max(1, Math.round((performance.now() - Tn.t0) / 1000 * (S.speed || 1))));
  st.tokTarget = 0;
  renderComposer();
  turn = null;
  if (!st.titled) applyTitle();
  scrollBottom();
  return pc;
}
async function runVisible(s, Tn, turnEl) {
  switch (s.t) {
    case 'claude': {
      const b = addBlock(turnEl, '<div class="b-text"></div>');
      if (S.reveal === 'stream') {
        const words = s.md.split(/(\s+)/);
        let shown = '';
        for (let i = 0; i < words.length && !Tn.interrupted;) {
          const n = 1 + Math.floor(Math.random() * 3);
          let chunk = '';
          for (let k = 0; k < n * 2 && i < words.length; k++) chunk += words[i++];
          shown += chunk;
          b.innerHTML = mdHTML(shown);
          scrollBottom();
          await wait(Math.max(12, chunk.length * 1000 / S.streamCps), true);
        }
      } else b.innerHTML = mdHTML(s.md);
      scrollBottom();
      break;
    }
    case 'tool': case 'toolerr': {
      const b = addTool(turnEl, toolInfo(s.name, s.args));
      await wait(900 + Math.random() * 900, true);
      const body = s.out.length ? s.out.map(esc).join('\n') : '';
      finishTool(b, Tn.interrupted ? '' : (s.out[0] || ''), Tn.interrupted ? '' : body, s.t === 'toolerr');
      break;
    }
    case 'edit': {
      const b = addTool(turnEl, { icon: 'pencil', label: `${T().edited} ${s.file}` });
      await wait(700 + Math.random() * 500, true);
      const add = s.diff.filter(d => d.s === '+').length, del = s.diff.filter(d => d.s === '-').length;
      const body = s.diff.map(d => `<span class="dl ${d.s === '+' ? 'add' : d.s === '-' ? 'del' : ''}">${d.s === ' ' ? ' ' : d.s} ${esc(d.text)}</span>`).join('');
      finishTool(b, `+${add} −${del}`, body, false);
      break;
    }
    case 'todos':
      addBlock(turnEl, `<div class="todo-card"><div class="tt">${esc(T().todos)}</div>${s.items.map(x => `<div class="todo ${x.s === 'done' ? 'done' : x.s === 'progress' ? 'prog' : ''}"><span class="bx">${x.s === 'done' ? ic('check') : ''}</span><span>${inline(x.text)}</span></div>`).join('')}</div>`);
      break;
    case 'perm': {
      const info = toolInfo(s.name, s.args), L = T();
      const card = addBlock(turnEl, `<div class="perm"><div class="perm-h">${ic(info.icon)}<span>${esc(L.allowQ(s.name))}</span></div>${s.args != null ? `<div class="perm-cmd">${esc(s.args)}</div>` : ''}${s.desc ? `<div class="perm-d">${esc(s.desc)}</div>` : ''}<div class="perm-b"><button class="pb" data-c="3" tabindex="-1">${esc(L.deny)}</button><button class="pb" data-c="2" tabindex="-1">${esc(L.always)}</button><button class="pb pri" data-c="1" tabindex="-1">${esc(L.once)}</button></div></div>`);
      const target = s.choice || 1;
      const p = track(resolve => { st.permWaiter = { resolve, card }; });
      const driver = driverFor();
      if (driver !== 'manual') runActions('perm', [{ el: () => card.querySelector(`.pb[data-c="${target}"]`), run: () => choosePerm(target) }], driver).catch(() => {});
      const choice = await p;
      if (choice === 3) {
        const b = addTool(turnEl, info);
        finishTool(b, L.denied, '', true);
        Tn.interrupted = true;
      } else {
        const b = addTool(turnEl, info);
        await wait(800 + Math.random() * 700, true);
        finishTool(b, Tn.interrupted ? '' : (s.out[0] || ''), s.out.length && !Tn.interrupted ? s.out.map(esc).join('\n') : '', false);
      }
      break;
    }
    case 'error':
      addBlock(turnEl, `<div class="err-box">${esc(s.text && !/^API Error/i.test(s.text) ? s.text : T().capacity)}</div>`);
      break;
  }
}
function choosePerm(c) {
  const W = st.permWaiter;
  if (!W) return;
  st.permWaiter = null;
  W.card.remove();
  if (st.micro && st.micro.kind === 'perm') finishMicro(st.micro);
  W.resolve(c);
}
async function runMeta(s) {
  switch (s.t) {
    case 'pause': await wait(s.secs * 1000); break;
    case 'title': st.title = s.text; if (st.titled && st.curItem) { st.curItem.t = s.text; renderRecents(); } renderTitle(); break;
    case 'info': {
      // Inside a turn it goes in place (before whatever comes next), not at the end of the thread.
      const el = h(`<div class="info">${inline(s.text)}</div>`);
      if (turn && turn.el) blocksOf(turn.el).appendChild(el); else elThread.appendChild(el);
      scrollBottom();
      break;
    }
    case 'clear': await newChatFlow(driverFor()); break;
    case 'compact': await compactFlow(); break;
    case 'detail': toggleDetail(); break;
  }
}
function applyTitle() {
  if (st.empty) return;
  const first = elThread.querySelector('.bubble');
  st.title = st.title || (first ? first.textContent.trim().replace(/\s+/g, ' ').slice(0, 42) : 'New chat');
  st.titled = true;
  let ung = st.groups.find(g => /^(ungrouped|sin grupo)$/i.test(g.name));
  if (!ung) { ung = { name: 'Ungrouped', items: [] }; st.groups.push(ung); }
  st.groups.forEach(g => g.items.forEach(i => { i.cur = false; }));
  st.curItem = { t: st.title, cur: true };
  ung.items.unshift(st.curItem);
  renderRecents(true);
  renderTitle();
}
async function modelFlow(tg, driver) {
  if (driver === 'manual') { openMenu(); await runActions('model', [], 'manual'); return; }
  const tModel = tg.model || st.model, tIdx = MODELS.indexOf(tModel);
  const tEffort = tg.effort || st.effort;
  const tFast = tg.fast != null ? tg.fast : st.fast;
  const acts = [];
  if (tModel !== st.model || tFast !== st.fast) {
    acts.push({ el: () => $('#modelBtn'), run: () => openMenu() });
    if (tFast !== st.fast) acts.push({ el: () => $('#menu [data-act="fast"] .sw'), run: () => toggleFast() });
    acts.push({ el: () => $(`#menu [data-i="${tIdx}"]`), run: () => selectModel(tIdx) });
  }
  if (tEffort !== st.effort) {
    acts.push({ el: () => $('#effortBtn'), run: () => openEffort() });
    acts.push({
      drag: true, target: tEffort, el: () => $('#epThumb'),
      toX: () => { const r = $('#epTrack').getBoundingClientRect(); return r.left + r.width * EPOS(EFFORTS.indexOf(tEffort)) / 100; },
    });
    acts.push({ el: () => $('#cInput'), run: () => closeEffort() });
  }
  if (acts.length) await runActions('model', acts, driver);
}
async function newChatFlow(driver) {
  const go = () => {
    elThread.innerHTML = '';
    st.titled = false; st.title = ''; st.cur = -1;
    if (st.curItem) { st.curItem.cur = false; st.curItem = null; }
    renderRecents();
    setEmpty(true);
  };
  if (driver === 'manual' || !S.sidebar) { go(); return; }
  await runActions('new', [{ el: () => $('.nav-item.new'), run: go }], driver);
}
async function compactFlow() {
  const card = h(`<div class="compact-card"><span class="mini-spin"></span><span class="shimmer">${esc(T().compacting)}</span></div>`);
  elThread.appendChild(card);
  scrollBottom();
  await wait(3200);
  card.replaceWith(h(`<div class="divider">${esc(T().compacted)}</div>`));
  scrollBottom();
}
async function runSlash(text, hidden, driver) {
  const parts = text.trim().split(/\s+/), cmd = parts[0].toLowerCase(), arg = parts.slice(1).join(' ');
  setInput('');
  if (cmd === '/model' || cmd === '/effort') await modelFlow(parseTarget(`${arg} ${hidden || ''}`), driver);
  else if (cmd === '/clear') await newChatFlow(driver);
  else if (cmd === '/compact') await compactFlow();
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
        await wait(120);
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
    if (!st.input.trim()) return;
    const F = st.free, t = st.input;
    st.free = null;
    F.resolve(t);
    return;
  }
  if (e.key === 'Backspace') { e.preventDefault(); setInput([...st.input].slice(0, -1).join('')); return; }
  if (e.key.length === 1) { e.preventDefault(); setInput(st.input + e.key); }
}
function toggleDetail() {
  st.detailed = !st.detailed;
  $$('.b-think, .b-tool', elThread).forEach(b => b.classList.toggle('open', st.detailed));
  scrollBottom();
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
document.addEventListener('keydown', e => {
  if (e.key === 'F2') { e.preventDefault(); togglePanel(); return; }
  if (e.key === 'F9') { e.preventDefault(); restart(); toast(S.mode === 'auto' ? '↺ Restarted · Space to start' : '↺ Restarted'); return; }
  if (e.key === 'F8') { e.preventDefault(); playPause(); return; }
  if (panelIsOpen()) { if (e.key === 'Escape') { e.preventDefault(); togglePanel(false); } return; }
  if ((e.ctrlKey || e.metaKey) && (e.key === 'o' || e.key === 'O')) { e.preventDefault(); toggleDetail(); return; }
  if (e.key === 'Tab') { e.preventDefault(); return; }
  if (st.micro) { microKey(e); return; }
  if (e.key === 'Escape') { e.preventDefault(); if (st.menu) closeMenu(); else if (st.effortPop) closeEffort(); else if (turn && !turn.interrupted) turn.interrupted = true; return; }
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
$('#sendBtn').addEventListener('click', () => {
  if (st.generating && turn) { turn.interrupted = true; return; }
  if (st.free && st.input.trim()) { const F = st.free; st.free = null; F.resolve(st.input); }
});
let mouseT;
document.addEventListener('pointermove', () => {
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

/* ════════════════════ Restart ════════════════════ */
function resetState() {
  MODELS = parseModels(S.models);
  const { steps, hdr, warn } = compile(SCRIPT);
  const H = keys => { for (const k of keys) if (hdr[k] != null && hdr[k] !== '') return hdr[k]; return null; };
  st.steps = steps; st.warn = warn;
  const cwd = H(['carpeta', 'cwd', 'directorio', 'dir', 'ruta']);
  st.hdr = {
    user: H(['usuario', 'user', 'nombre', 'name']) ?? '', plan: H(['plan', 'cuenta']) ?? 'Claude Max', greeting: H(['saludo', 'greeting']),
    folder: cwd ? cwd.split(/[\\/]/).filter(Boolean).pop() : '',
  };
  st.model = findModel(H(['modelo', 'model']) || '') || MODELS[0];
  st.effort = parseEffort(H(['esfuerzo', 'effort']) || '') || 'medium';
  st.thinking = EFFORTS.indexOf(st.effort) >= 2;
  st.fast = /^(si|sí|yes|on|true|1)$/.test(norm(H(['rapido', 'fast']) || ''));
  const tg = H(['titulo', 'title']) || '';
  st.groups = parseGroups(S.recents || DEFAULT_RECENTS);
  st.curItem = null;
  st.hdr.stats = {
    sessions: H(['sesiones', 'sessions']) || '41', messages: H(['mensajes', 'messages']) || '36,990',
    tokens: H(['tokenstotales', 'tokens_totales', 'totaltokens']) || '13.2B', days: H(['diasactivos', 'dias_activos', 'activedays']) || '15',
    peak: H(['horapico', 'hora_pico', 'peakhour']) || '11 PM', fav: H(['modelofavorito', 'modelo_favorito', 'favoritemodel']) || 'Opus 5.5',
    moby: H(['moby', 'mobydick']) || '49142',
  };
  closeEffort();
  Object.assign(st, { tok: 0, tokTarget: 0, title: tg, titled: false, cur: -1, input: '', generating: false, menu: null, effortPop: null, micro: null, permWaiter: null, magic: null, free: null, paused: false, waitingStart: false, startResolve: null, playing: false, finished: false });
  turn = null;
  elThread.innerHTML = '';
  $('#menu').hidden = true;
  cur.classList.remove('on');
  setEmpty(true);
}
function restart() {
  cancelAll();
  applyTheme();
  resetState();
  renderStatic();
  updateParseStatus();
  run();
}

/* ════════════════════ Control panel ════════════════════ */
const MODE_HINTS = {
  magic: 'Go at your own pace: every key you press types the next letter of your scripted line (9 keys = 9 letters). <kbd>Enter</kbd> sends it and Claude answers. In the model picker and permission cards, each key is one cursor click.',
  auto: 'Everything plays by itself: typing, cursor and answers. Press <kbd>Space</kbd> or <kbd>F8</kbd> to start and to pause.',
  free: 'Type whatever you want for real. When you press <kbd>Enter</kbd>, Claude answers with its next scripted turn. Switch models with the real mouse.',
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
  let cls = '', txt = 'Ready';
  if (st.waitingStart) { cls = 'wait'; txt = 'Waiting: press Space, Enter or F8 to start'; }
  else if (st.finished) txt = 'Script finished · F9 to replay';
  else if (st.playing && st.paused) { cls = 'pause'; txt = 'Paused · F8 to resume'; }
  else if (st.playing) { cls = 'play'; txt = S.mode === 'auto' ? 'Playing' : 'Live: type on your keyboard'; }
  el.className = 'state ' + cls;
  el.querySelector('span').textContent = txt;
}
function updateParseStatus() {
  const { steps, warn } = compile(SCRIPT);
  const users = steps.filter(s => s.t === 'user').length, claude = steps.filter(s => s.t === 'claude').length;
  $('#parseStatus').innerHTML = `✓ ${users} ${users === 1 ? 'message' : 'messages'} from you · ${claude} ${claude === 1 ? 'answer' : 'answers'} from Claude`
    + warn.slice(0, 4).map(w => `<span class="w">⚠ ${esc(w)}</span>`).join('');
}
function syncPanel() {
  $$('#modeSeg button').forEach(b => b.classList.toggle('on', b.dataset.mode === S.mode));
  $('#modeHint').innerHTML = MODE_HINTS[S.mode];
  $$('[data-k]').forEach(el => {
    const k = el.dataset.k;
    if (el.type === 'checkbox') el.checked = !!S[k];
    else if (document.activeElement !== el) el.value = k === 'models' && !S.models ? (DEFAULT_MODELS[S.lang] || DEFAULT_MODELS.en) : S[k];
  });
  $$('output[data-o]').forEach(o => {
    const k = o.dataset.o, v = S[k];
    o.textContent = (k === 'speed' || k === 'mouseSpeed') ? Number(v).toFixed(2) + '×' : k === 'zoom' ? Math.round(v * 100) + '%' : String(v);
  });
  updateRunState();
}
function initPanel() {
  const ta = $('#script');
  ta.value = SCRIPT;
  let tmr;
  ta.addEventListener('input', () => { SCRIPT = ta.value; clearTimeout(tmr); tmr = setTimeout(() => { lsSet(LS_SCRIPT, SCRIPT); updateParseStatus(); }, 300); });
  ta.addEventListener('keydown', e => { if (e.key === 'Tab' && !e.shiftKey) { e.preventDefault(); ta.setRangeText('  ', ta.selectionStart, ta.selectionEnd, 'end'); ta.dispatchEvent(new Event('input')); } });
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
    restart();
  });
  $('#bModelsReset').addEventListener('click', () => { S.models = ''; saveS(); syncPanel(); restart(); });
  $('#bSettingsReset').addEventListener('click', () => {
    if (!confirm('Reset all settings?')) return;
    S = Object.assign({}, DEF, { mode: S.mode });
    saveS(); syncPanel(); restart();
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
      saveS();
      syncPanel();
      applyTheme();
      if (k === 'models') { MODELS = parseModels(S.models); st.model = findModel(st.model ? st.model.name : '') || MODELS[0]; }
      if (k === 'lang' && !S.models) { const name = st.model && st.model.name; MODELS = parseModels(''); st.model = findModel(name || '') || MODELS[0]; }
      if (k === 'recents') { st.groups = parseGroups(S.recents); if (st.curItem) { let u = st.groups.find(g => /^(ungrouped|sin grupo)$/i.test(g.name)); if (!u) { u = { name: 'Ungrouped', items: [] }; st.groups.push(u); } u.items.unshift(st.curItem); } }
      renderStatic();
      if (st.menu) renderMenu();
    });
  });
  syncPanel();
  updateParseStatus();
}

/* ════════════════════ Startup ════════════════════ */
applyTheme();
clawdIdle();
initPanel();
resetState();
renderStatic();
run();
if (firstRun) togglePanel(true);
else toast(S.mode === 'auto' ? 'F2 · script panel · Space to start' : S.mode === 'magic' ? 'F2 · script panel · type to write your line' : 'F2 · script panel', 2600);
})();
