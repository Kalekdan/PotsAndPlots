# pots-and-plots

AI coding agent specification. Simple CLI to run the frontend.

## Spec-driven CLI: `potsandplots`

Purpose: Start the frontend development server with pnpm.

Machine-readable spec (YAML)

```yaml
name: potsandplots
description: Start frontend with pnpm
commands:
  - name: start
    description: Install pnpm if missing, then run pnpm start
    behavior:
      - check if pnpm is installed
      - if missing, install pnpm globally via npm
      - run pnpm install
      - run pnpm start
      - stream stdout/stderr
      - return process exit code
```

Behavior

- Check if pnpm is available in PATH
- If missing, run `npm install -g pnpm`
- Run `pnpm install` then `pnpm start` in current directory
- Forward all output to user
- Return the exit code from pnpm start

Examples

- Start frontend: `potsandplots start`

Implementation notes

- Auto-install pnpm if missing using npm
- Only run `pnpm install` and `pnpm start`
- No custom arguments needed


# Features and functionality
## Adding and removing plants
- A button next to each plant should let you remove it with a single click
- A button next to each area/plot should let you add a new plant