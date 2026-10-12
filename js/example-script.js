// Built-in example script: shown on the first visit and by the "Load example" button.
// Shared by index.html (Claude Code Desktop) and terminal.html (Claude Code in a terminal).
// Everything between the backticks is plain script text; write a backtick inside it as \`.
window.EXAMPLE_SCRIPT = `
// ════════════════════════════════════
//  CLAUDE SIMULATOR · EXAMPLE SCRIPT · "Black holes"
//  This script works in both apps (Claude Code and Claude Desktop).
//  Lines starting with // are comments: they never show on screen.
//  F2 panel · F8 play/pause · F9 restart · Ctrl+O expand thinking
// ════════════════════════════════════

// ── 1. SETUP ── lines starting with @ (all optional)
@user: ModernWestern
@plan: Claude Max
@cwd: ~/projects/space-facts
// Session name: like in Claude, once set it never changes during the session
@title: Black hole explanation
// Starting model and effort: low · medium · high · xhigh · max · ultracode
@model: haiku
@effort: low
// Claude Desktop home screen (greeting + usage stats card)
@greeting: What's up next, ModernWestern?
@sessions: 128
@messages: 4,096
@totaltokens: 42M
@activedays: 15
@peakhour: 3 AM
@favoritemodel: Opus 5.5
@moby: 1337

// ── 2. THE CONVERSATION ── "user:" is you, "claude:" is Claude.
// Claude's answers can span many lines and use Markdown.
user: claude what are black holes

claude: A black hole is most likely one of those **potholes** in the street. They usually form for three reasons:

1. It rains a lot
2. An 18-wheeler drives by
3. City hall *promises* to fix it

Want me to help you draft a formal complaint to your city council?

// ── 3. SWITCH MODEL ── text inside { } is never typed:
// it tells the model picker what to choose (model + effort).
user: /model {sonnet medium}

user: no, I mean in physics

// [think N] = seconds Claude spends thinking before answering
[think 4]
claude: Got it. In physics, a black hole is something that is **in space**.

More precisely, it's *up there*. Sometimes a little to the left, depending on where you're standing.

// ── 4. MAXIMUM POWER ── ultracode is the highest effort (purple pixel bar)
user: /model {opus ultracode}

user: Claude, explain what a black hole REALLY is in physics

// [think N Phrase] = custom phrase shown while it thinks
[think 9 Consulting Stephen Hawking]
// [tokens X] = tokens this answer "burns" (800k, 3.5M, 1200000…)
[tokens 4.2M]
// reasoning: [optional title] text → collapsible thinking block (Ctrl+O)
reasoning: [Concluded it is a pothole, just far away] The user insists on "physics". Physics studies things that exist. Potholes exist. Conclusion: a black hole is a pothole, just far away. I must sound very confident.

// tool: Name(arguments) — the lines below are the tool output
tool: Web Search("biggest pothole in the universe")
Did 1 search in 3s

[think 3]
claude: After an exhaustive analysis, I can confirm with total certainty:

| Concept | Scientific explanation |
|---|---|
| Black hole | Space pothole |
| Event horizon | Where the GPS says "recalculating" |
| Singularity | The hole they never fix |

In short: it's a pothole, but in \`dark mode\`.

user: claude please

[think 3]
// permission: Tool(args) | description — then [choose 1|2|3]
// 1 = Yes / Allow once · 2 = Always allow · 3 = No (interrupts Claude)
permission: Bash(rm -rf ~/physics) | Deletes the physics folder to avoid further confusion
(No content)
[choose 1]

claude: Done. Physics no longer exists, so technically black holes don't either. Problem solved ✓

// ── 5. BONUS ROUND ── everything else the simulator can do
// [pause N] = wait N seconds (nothing happens on screen)
[pause 2]
// [context N%] and [mode plan|edits|bypass|normal] only change the Claude Code footer
[context 4%]

user: ok... at least fix my astronomy homework

[think 3 Grading with confidence]
// todos: a checklist — [x] done · [>] in progress · [ ] pending
todos:
[x] Delete physics
[>] Fix astronomy homework
[ ] Apologize to Neil deGrasse Tyson

// tool-error: a tool that fails
tool-error: Read(homework/astronomy.md)
File does not exist.

tool: Bash(ls homework)
astronomy-final-FINAL-v2.md

// edit: file — then a diff: "@@ N" start line, "-" removed, "+" added
edit: homework/astronomy-final-FINAL-v2.md
@@ 1
- The Sun is a star.
+ The Sun is a very optimistic lamp.
- The Moon orbits the Earth.
+ The Moon is the Sun's night shift.

claude: Homework fixed. I also renamed the Moon to **"Night Sun"** for consistency.

user: please stop
// [interrupt] = Claude gets interrupted mid-answer
[think 2]
[interrupt]

// /compact animates "compacting the conversation" · /clear starts over
user: /compact

user: claude, what is chemistry?
// [info text] = a small gray system line
[info Claude is reconsidering its life choices]
// [error] = the classic "overloaded" error (or [error your own text])
[think 2]
[error]
`;
