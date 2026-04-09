# pi-agent

Personal [pi](https://buildwithpi.ai/) coding agent configuration.

## Install

```bash
pi install git:github.com/river/pi-agent
```

## What's included

### Extensions

- **answer.ts** — Interactive TUI for answering questions one by one
- **btw.ts** — Side-chat popover with optional summary injection
- **files.ts** — File browser with git status and session references
- **multi-edit.ts** — Batch edits and Codex-style patch support with preflight validation
- **todos.ts** — Todo manager with file-backed storage and TUI
- **uv.ts** — Redirects Python tooling to uv equivalents

### Skills

- **commit** — Conventional Commits-style git commits
- **tmux** — Tmux session control via keystrokes and pane scraping
- **uv** — uv for Python dependency management and script execution

### Intercepted Commands

Shell shims that block `pip`, `pip3`, `poetry` and redirect `python`/`python3` through `uv run`:

- `pip` / `pip3` — blocked, suggests `uv add` / `uv run --with`
- `poetry` — blocked, suggests `uv` equivalents
- `python` / `python3` — blocks `-m pip`, `-m venv`, `-m py_compile`; otherwise delegates through `uv run`

## Credits

Most of this setup is derived from [mitsuhiko/agent-stuff](https://github.com/mitsuhiko/agent-stuff).
