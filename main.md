# pots-and-plots

AI coding agent specification. Human documentation is in README.md. Read https://github.blog/ai-and-ml/generative-ai/spec-driven-development-using-markdown-as-a-programming-language-when-building-with-ai/ to understand the approach.

If the Pots&Plots home directory doesn't exist, create it.

## Spec-driven CLI: `potsandplots`

Purpose

- Provide a reproducible developer workflow to create a local Pots&Plots home directory and start the frontend.
- Be explicit about subcommands, argument names, and return codes so automated agents can implement the CLI deterministically.

Machine-readable spec (YAML)

```yaml
name: potsandplots
description: CLI for Pots&Plots developer tasks
commands:
  - name: init
    description: Create the Pots&Plots home directory if it does not exist
    args:
      - name: --home
        var: homeDir
        type: path
        required: false
        default: "~/.potsandplots"
    behavior:
      - expand homeDir to absolute path
      - create directory if missing
      - create <homeDir>/README.md with one line: "PotsAndPlots home directory" if missing
      - return 0 on success
      - return 1 on failure
  - name: start
    description: Start the frontend development server (pnpm)
    args:
      - name: --cwd
        var: cwd
        type: path
        required: false
        default: "."
    behavior:
      - verify pnpm installed; if missing print: "pnpm not found: install pnpm to continue" and exit 2
      - run: pnpm install then pnpm start in cwd
      - stream stdout/stderr
      - return frontend process exit code
```

Exact names (must be used)

- Subcommands: `init`, `start`
- Arguments: `--home` (homeDir), `--cwd` (cwd)

All arguments use long form (double-dash) and accept a single value immediately following the flag.

Behavior details

- init
  - Expand `homeDir` (support `~` on POSIX and Windows).
  - Create directory with normal user permissions if missing.
  - Ensure file `<homeDir>/README.md` exists with one line: "PotsAndPlots home directory".
  - On any failure print a short message to stderr and exit 1.

- start
  - If pnpm missing, print exact message and exit 2.
  - Run `pnpm install` then `pnpm start` in `cwd`, forwarding stdout/stderr.

Logging and output

- Success: normal process output; return 0 (or the child process exit code for long-running commands).
- Errors: print a single short line to stderr and set non-zero exit code. Avoid stack traces for expected errors.

Contracts

- idempotent: `init` must succeed if directory already exists.
- explicit-errors: commands must print a single-line error to stderr and return non-zero on failure.

Examples

- Create default home dir: `potsandplots init`
- Create custom home dir: `potsandplots init --home C:\\PotsAndPlotsHome`
- Start frontend: `potsandplots start --cwd .`

Implementation notes

- Only run documented commands: `pnpm install` and `pnpm start`. Do not execute arbitrary user-provided commands.

