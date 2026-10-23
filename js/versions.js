// Interfaces the simulator can replay, newest first. Every page lists them in the "Interface" selector of its F2
// panel, and all of them share the same script, so you can record the same scene in another version.
// When Claude's interface changes, the old replica stays as a frozen copy and a new line goes at the top.
window.CCSIM_VERSIONS = [
  { page: 'index.html', label: 'Claude Code Desktop 3.6556.2 · Oct 23, 2026 (latest)' },
  { page: 'desktop-2.31226.1.html', label: 'Claude Code Desktop 2.31226.1 · Oct 12, 2026' },
  { page: 'terminal.html', label: 'Claude Code in a terminal' },
];

(() => {
  const sel = document.getElementById('versionSel');
  if (!sel) return;
  const here = decodeURIComponent(location.pathname.split('/').pop()) || 'index.html';
  sel.innerHTML = window.CCSIM_VERSIONS.map(v => `<option value="${v.page}"${v.page === here ? ' selected' : ''}>${v.label}</option>`).join('');
  sel.addEventListener('change', () => { location.href = sel.value; });
})();
