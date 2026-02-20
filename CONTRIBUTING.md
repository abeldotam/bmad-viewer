# Contributing to BMAD Viewer

Thank you for your interest in contributing! Here's how to get started.

## Development Setup

```bash
git clone https://github.com/abeldotam/bmad-viewer.git
cd bmad-viewer
pnpm install          # pnpm 10.28+ required
cp .env.example .env  # Configure at least NUXT_GITHUB_TOKEN
pnpm dev              # http://localhost:3000
```

## Workflow

1. Fork the repository
2. Create a feature branch from `main` (`git checkout -b feat/my-feature`)
3. Make your changes
4. Run checks before committing:
   ```bash
   pnpm lint        # ESLint with stylistic rules
   pnpm typecheck   # TypeScript via vue-tsc
   ```
5. Commit with a descriptive message following [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `refactor:`, `docs:`, etc.)
6. Push your branch and open a Pull Request against `main`

## Code Style

- **TypeScript** is required — no `any` types without justification
- **ESLint** enforces stylistic rules (comma dangle: `never`, brace style: `1tbs`)
- **Nuxt UI 4** components are preferred over custom HTML for UI elements
- **State management** uses `useState` + `provide/inject` (no Pinia)
- **SSR is disabled** — do not add SSR-dependent code

## Project Structure

- `app/` — Vue pages, components, composables, middleware
- `server/` — Nitro API routes (GitHub proxy, auth, config)
- `shared/` — Types shared between client and server

All GitHub API calls must go through `server/api/github/*` — tokens must never be exposed client-side.

## Reporting Bugs

Open an [issue](https://github.com/abeldotam/bmad-viewer/issues) with:

- Steps to reproduce
- Expected vs actual behavior
- App mode (personal / multi-user) and browser

## Suggesting Features

Open an issue with the `enhancement` label describing your use case and proposed solution.
