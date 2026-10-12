# Claude Code Desktop Dummy

**Are you a content creator? This is a Claude Code session so your examples or explainer videos don't cost you tokens!**

▶ **Open it in your browser:** 

[Desktop 🖥️](https://modernwestern.github.io/claude-code-desktop-dummy/)

[Terminal ⬛](https://modernwestern.github.io/claude-code-desktop-dummy/terminal.html)

A pixel-faithful dummy of the Claude Code interface that plays a **script you write**. You decide exactly what you type and what "Claude" answers, so you can record tutorials, demos, sketches and parodies, rehearse them as many times as you want, and never spend a single token. No AI runs here: everything on screen comes from your script.

The interface is based on **Claude Code Desktop version 2.31226.1** (Claude desktop app, Code tab), as of **October 12, 2026**. The terminal version recreates the Claude Code CLI look (v2.x).

## Two interfaces, one script

| File | What it looks like |
|---|---|
| [`index.html`](https://modernwestern.github.io/claude-code-desktop-dummy/) | **Claude Code Desktop**: sidebar with session groups, home screen with usage stats and Clawd, model picker, effort slider (including the animated Ultracode bar), thinking blocks, tool rows, permission cards… |
| [`terminal.html`](https://modernwestern.github.io/claude-code-desktop-dummy/terminal.html) | **Claude Code in a terminal**: welcome box, `>` prompt, ✻ spinner with its verbs, `/model` picker, `⎿` tool output, permission prompts, `ultrathink` in rainbow colors… |

Both read the same script format, and if you open them from the same place in the same browser they share the script.

## How to use it

1. Open the page and press **F2** to open the control panel.
2. Write your script (or start from the built-in example, *"Black holes"*).
3. Pick a playback mode and press **▶ Play**.
4. Press **F11** for full screen and start recording.

### Playback modes

| Mode | What happens |
|---|---|
| **My pace** (default) | Every key you press types the next letter of your scripted line (9 keys = 9 letters). **Enter** sends it and Claude answers. In pickers and permission cards, each key performs one step / one click. |
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
user: /model {opus max}

user: ultrathink explain what a black hole REALLY is in physics
[think 9 Consulting Stephen Hawking]
[tokens 4.2M]
reasoning: [Concluded it is a pothole, just far away] Physics studies things that exist...
tool: Web Search("biggest pothole in the universe")
Did 1 search in 3s

claude: After an exhaustive analysis… it's a pothole, but in `dark mode`.
```

| Directive | Effect |
|---|---|
| `user:` / `claude:` | Your message / Claude's answer (multi-line, Markdown: bold, lists, tables, code…) |
| `user: /model {opus max}` | Animated model picker; effort `low · medium · high · xhigh · max · ultracode` |
| `user: /effort ultracode` | Changes only the effort |
| `[think 5 Phrase]` | Claude thinks for 5 s, optionally showing a custom phrase |
| `[tokens 3.5M]` | Token counter climbs to that number ("Worked for 9s · 3.5M tokens") |
| `reasoning: [title] text` | Collapsible thinking block (`Ctrl+O`) |
| `tool: Name(args)` / `tool-error:` | Tool call (+ output lines below) / failing tool |
| `edit: file` | File edit with a diff (`@@ N`, `-` removed, `+` added) |
| `todos:` | Checklist (`[x]` done · `[>]` in progress · `[ ]` pending) |
| `permission: Bash(cmd) \| description` + `[choose 1-3]` | Permission card: allow once / always / deny |
| `[error]` · `[info text]` · `[interrupt]` | Overloaded error · gray system line · interrupted answer |
| `[pause 2]` · `[title …]` · `/compact` · `/clear` | Wait · rename session · compaction · new session |
| `@greeting`, `@sessions`, `@messages`, `@totaltokens`, `@activedays`, `@peakhour`, `@favoritemodel`, `@moby` | Desktop home screen text and stats |
| `[mode plan]` · `[context 4%]` | Terminal footer only |

The full reference lives in the **Syntax** tab of the panel. Spanish keywords (`yo:`, `[pensar]`, `razonamiento:`…) also work.

## Run it locally

It's two self-contained HTML files with no build step and no dependencies. Download the repo and double-click `index.html`.

## Credits and disclaimer

- **Unofficial fan-made tool.** This project is not affiliated with, endorsed by, or sponsored by Anthropic. *Claude*, *Claude Code* and the Claude logo and mascot are trademarks of Anthropic, PBC, used here only to recreate the look of the product for parody, tutorials and demos.
- **Everything is simulated.** Conversations are scripted by you; no model is called. Please don't present scripted conversations as real Claude output.
- The help icon is the "Question" icon from [Phosphor Icons](https://phosphoricons.com/) (MIT license).
