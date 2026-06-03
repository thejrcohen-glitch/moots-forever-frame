# MootsFrame Repository Governance

## Repository Role

- This repo is the execution layer for MootsFrame.
- ChatGPT Project / Forever Frame Doctrine governs brand voice and campaign doctrine.
- GitHub `main` is the source of truth for code.

## Codex Operating Rules

- Codex may inspect, validate, and propose scoped code changes.
- Before changing files, report intended files and wait for confirmation.
- Do not run broad rewrites.
- Prefer small, scoped branches and pull requests.
- Do not touch `package.json` or `pnpm-lock.yaml` unless explicitly instructed.
- Do not add Playwright, crawlers, workflows, or dependencies without explicit approval.

## Content Boundaries

- No campaign copy, outreach, dealer messaging, or public-facing content should be generated unless the Doctrine layer is referenced first.
- No technical specification language should bleed into vibe-focused marketing content.

## Validation

- After changes, run `pnpm check`.
- Run `pnpm build` only when explicitly allowed because it writes to `dist`.

## Deployment

- Manus deployment is currently blocked by stale deploy cache; do not attempt Manus-related work from this repo.
