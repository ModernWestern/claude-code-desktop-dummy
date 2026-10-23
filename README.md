# Claude Code Desktop Dummy

**Are you a content creator? This is a Claude Code session so your examples or explainer videos don't cost you tokens!**

▶ **Open it in your browser:** 

[Desktop 🖥️](https://modernwestern.github.io/claude-code-desktop-dummy/)

[Terminal ⬛](https://modernwestern.github.io/claude-code-desktop-dummy/terminal.html)

[Desktop, previous version 2.31226.1](https://modernwestern.github.io/claude-code-desktop-dummy/desktop-2.31226.1.html)

A pixel-faithful dummy of the Claude Code interface that plays a **script you write**. You decide exactly what you type and what "Claude" answers, so you can record tutorials, demos, sketches and parodies, rehearse them as many times as you want, and never spend a single token. No AI runs here: everything on screen comes from your script.

The interface is based on **Claude Code Desktop version 3.6556.2** (Claude desktop app, Code tab), as of **October 23, 2026**. Earlier versions stay available, and you choose which one to simulate (see [Versions](#versions)). The terminal version recreates the Claude Code CLI look (v2.x).

## Interfaces and versions

| Page | What it looks like |
|---|---|
| [`index.html`](https://modernwestern.github.io/claude-code-desktop-dummy/) | **Claude Code Desktop 3.6556.2** (Oct 23, 2026, latest): sidebar with nested sessions, branch icons and unread dots; session panel on the right (Environment, Context, Connectors, Outputs); one model button with the Effort and More models submenus; task list, question and suggestion cards; "Needs your input"; a token counter that climbs steadily… |
| [`desktop-2.31226.1.html`](https://modernwestern.github.io/claude-code-desktop-dummy/desktop-2.31226.1.html) | **Claude Code Desktop 2.31226.1** (Oct 12, 2026): the previous interface, with the effort slider and its animated Ultracode bar. |
| [`terminal.html`](https://modernwestern.github.io/claude-code-desktop-dummy/terminal.html) | **Claude Code in a terminal**: welcome box, `>` prompt, ✻ spinner with its verbs, `/model` picker, `⎿` tool output, permission prompts, Ultracode effort in purple… |

All of them read the same script format and, opened from the same place in the same browser, share the script. Switch between them with the **Interface** selector at the top of the F2 panel.

## How to use it

1. Open the page and press **F2** to open the control panel.
2. Write your script (or start from the built-in example, *"Black holes"*).
3. Pick a playback mode and press **▶ Play**.
4. Press **F11** for full screen and start recording.

### Playback modes

| Mode | What happens |
|---|---|
| **My pace** (default) | Every key you press types the next letter of your scripted line (9 keys = 9 letters). **Enter** sends it and Claude answers. In pickers, permission cards and questions, each key performs one step / one click. |
| **Automatic** | Everything plays by itself with human-like typing, a curved animated mouse cursor and realistic timing. **Space** or **F8** to start and pause. |
| **Free** | You type whatever you want for real; Claude answers with its next scripted turn. The model picker and permission buttons work with the real mouse. |

### Keyboard shortcuts

`F2` panel · `F8` play/pause · `F9` restart · `Ctrl+O` expand thinking · `Esc` stop/interrupt · `Shift+Tab` permission mode (terminal) · `F11` full screen

## Script format

```text
// Lines starting with // are comments.
@user: ModernWestern
@model: haiku
@effort: low

user: claude what are black holes

claude: A black hole is most likely one of those **potholes** in the street.

// Text inside { } is never typed: it tells the model picker what to choose.
user: /model {opus ultracode}

user: Claude, explain what a black hole REALLY is in physics
[think 9 Consulting Stephen Hawking]
[tokens 4.2M]
reasoning: [Concluded it is a pothole, just far away] Physics studies things that exist...
tool: Web Search("biggest pothole in the universe")
Did 1 search in 3s

claude: After an exhaustive analysis… it's a pothole, but in `dark mode`.

user: claude please

// One option per line: "- Label | description". [choose N] picks the answer.
question: How should I fix physics?
- Delete it (Recommended) | No physics, no black holes. Problem solved.
- Rename it to "Potholeology" | Same chaos, better name.
[choose 1]
```

| Directive | Effect |
|---|---|
| `user:` / `claude:` | Your message / Claude's answer (multi-line, Markdown: bold, lists, tables, code…) |
| `user: /model {opus ultracode}` | Animated model picker; effort `low · medium · high · xhigh · max · ultracode` |
| `user: /effort ultracode` | Changes only the effort |
| `[think 5 Phrase]` | Claude thinks for 5 s, optionally showing a custom phrase |
| `[tokens 3.5M]` | The token counter climbs steadily to that number while Claude works ("Worked for 9s · 3.5M tokens"). Without it, it climbs to a realistic amount for the answer |
| `reasoning: [title] text` | Collapsible thinking block (`Ctrl+O`) |
| `tool: Name(args)` / `tool-error:` | Tool call (+ output lines below) / failing tool |
| `edit: file` | File edit with a diff (`@@ N`, `-` removed, `+` added) |
| `todos:` | Task list (`[x]` done · `[>]` in progress · `[ ]` pending) |
| `question:` + `- Label \| description` lines + `[choose N]` | Multiple-choice question; several in a row become one card with pages, then a summary of the answers |
| `confirm:` + text + `- Button` lines + `[choose N]` | Suggestion card with buttons; the button pressed is sent as your reply and the next lines are Claude's answer |
| `permission: Bash(cmd) \| description` + `[choose 1-3]` | Permission card: allow once / always / deny |
| `[error]` · `[info text]` · `[interrupt]` | Overloaded error · gray system line · interrupted answer |
| `[pause 2]` · `[title …]` · `/compact` · `/clear` | Wait · session title (set once, never changes during the session) · compaction · new session |
| `@greeting`, `@sessions`, `@messages`, `@totaltokens`, `@activedays`, `@peakhour`, `@favoritemodel`, `@moby` | Desktop home screen text and stats |
| `@branch` · `@connectors` · `@outputs` | Desktop session panel: git branch, connected connectors and files under "Outputs" (every `edit:` adds its file) |
| `[context 4%]` | Context left: terminal footer; the Desktop session panel shows it as used (96%) |
| `[mode plan]` | Terminal footer only |

The full reference lives in the **Syntax** tab of the panel. Spanish keywords (`yo:`, `[pensar]`, `razonamiento:`…) also work.

## Project structure

```text
index.html                 Claude Code Desktop 3.6556.2 page (markup only)
desktop-2.31226.1.html     Claude Code Desktop 2.31226.1 page (frozen)
terminal.html              Claude Code terminal page (markup only)
css/desktop.css            Desktop 3.6556.2 styles
css/desktop-2.31226.1.css  Desktop 2.31226.1 styles (frozen)
css/terminal.css           Terminal styles
js/desktop.js              Desktop 3.6556.2 engine: script parser, playback, model menu, fake cursor…
js/desktop-2.31226.1.js    Desktop 2.31226.1 engine (frozen)
js/terminal.js             Terminal engine
js/versions.js             The list behind the "Interface" selector
js/clawd-frames.js         Pixel frames of Clawd, the mascot on the Desktop home screen
js/example-script.js       The built-in example script ("Black holes"), shared by every page
```

To change the example that loads on the first visit, edit `js/example-script.js`: it's plain script text between backticks.

## Versions

When Claude's interface changes, the replica of the previous version is not overwritten: it is frozen as `desktop-<version>.html` with its own CSS and JS, and the new interface takes over `index.html`. Every version reads the same scripts (an older one simply skips the blocks it doesn't know, such as `question:`), and `js/versions.js` lists them for the **Interface** selector.

| Version | Date | Page |
|---|---|---|
| 3.6556.2 | October 23, 2026 | [`index.html`](https://modernwestern.github.io/claude-code-desktop-dummy/) |
| 2.31226.1 | October 12, 2026 | [`desktop-2.31226.1.html`](https://modernwestern.github.io/claude-code-desktop-dummy/desktop-2.31226.1.html) |

## Run it locally

No build step and no dependencies. Download the repo and double-click `index.html` (or `terminal.html`).

## Credits and disclaimer

- **Unofficial fan-made tool.** This project is not affiliated with, endorsed by, or sponsored by Anthropic. *Claude*, *Claude Code* and the Claude logo and mascot are trademarks of Anthropic, PBC, used here only to recreate the look of the product for parody, tutorials and demos.
- **Everything is simulated.** Conversations are scripted by you; no model is called. Please don't present scripted conversations as real Claude output.
- The help icon is the "Question" icon from [Phosphor Icons](https://phosphoricons.com/) (MIT license).
