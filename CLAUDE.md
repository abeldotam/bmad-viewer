# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BMAD Viewer is a Nuxt 4 web app for visualizing BMAD methodology projects from GitHub repositories. It provides read-only views of project documents, roadmap/sprint progress, epics, and stories parsed from a repo's `_bmad-output/` directory. Comments create GitHub issues rather than modifying files directly. See `docs/cahierdescharges.md` for the full specification (in French).

## Commands

```bash
pnpm install          # Install dependencies
pnpm dev              # Dev server on http://localhost:3000
pnpm build            # Production build
pnpm preview          # Preview production build
pnpm lint             # ESLint (includes stylistic rules)
pnpm typecheck        # TypeScript type checking via vue-tsc
```

Package manager is **pnpm 10.28.2** (enforced via `packageManager` field). Do not use npm or yarn.

## Tech Stack

- **Nuxt 4** (full-stack Vue framework with Nitro server)
- **Nuxt UI 4** (component library: UTable, UCard, UModal, UTabs, UBadge, UProgress, etc.)
- **Tailwind CSS 4** with custom green color palette defined in `app/assets/css/main.css`
- **TypeScript 5.9**
- **Iconify** icon sets: `lucide` (UI icons) and `simple-icons` (brand icons)

Planned additions (per spec): Supabase (PostgreSQL + Auth), Pinia, Octokit.js, js-yaml, marked.js or @nuxt/content.

## Architecture

### Current Structure

The app follows standard Nuxt 4 conventions with the `app/` directory:

- `app/app.vue` — Root layout using `UApp`, `UHeader`, `UMain`, `UFooter`
- `app/pages/` — File-based routing (currently only `index.vue`)
- `app/components/` — Auto-imported Vue components
- `app/app.config.ts` — UI theme config (primary: green, neutral: slate)
- `app/assets/css/main.css` — Tailwind imports + custom theme variables

### Planned Structure (from spec)

```
app/
├── pages/
│   ├── login.vue
│   ├── dashboard.vue
│   └── repos/[owner]/[repo]/
│       ├── index.vue        # Repo dashboard
│       ├── documents.vue    # Markdown docs from _bmad-output/
│       ├── roadmap.vue      # Sprint progress from sprint-status.yaml
│       ├── epics.vue        # Table + Kanban views
│       └── story/[id].vue   # Story detail
├── composables/
│   ├── useGitHub.ts         # Octokit wrapper
│   ├── useBmadParser.ts     # YAML/Markdown parsing
│   ├── useStoryStatus.ts    # Story status logic
│   └── useSupabase.ts       # DB interactions
├── middleware/
│   └── auth.ts
server/
├── api/
│   ├── repos/               # CRUD for repositories
│   └── github/              # GitHub API proxy (contents, issues)
└── utils/
    ├── github.ts
    ├── supabase.ts
    └── encryption.ts        # AES-256 for GitHub tokens
```

### BMAD File Formats

The app parses these files from a GitHub repo's `_bmad-output/` directory:

- `sprint-status.yaml` — Sprint tracking with story statuses (YAML)
- `epics/*.md` — Epic definitions (Markdown)
- `epics/epic-X/story-Y.md` — Stories with YAML frontmatter (id, title, epic, status, priority, estimate)
- `PRD.md`, `architecture.md` — Project documentation (Markdown)

## Configuration

- **ESLint**: Uses `@nuxt/eslint` with stylistic rules (`commaDangle: 'never'`, `braceStyle: '1tbs'`)
- **Route rules**: Homepage is prerendered (`routeRules: { '/': { prerender: true } }`)
- **Renovate**: Configured to follow `nuxt/renovate-config-nuxt` preset

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs on every push: lint + typecheck on Node 22 with pnpm.
