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
- **nuxt-auth-utils** — GitHub OAuth for multi-user mode, encrypted session cookies
- **SQLite + Drizzle ORM** — Embedded database (better-sqlite3), no external DB required
- **Octokit** — GitHub API client (proxied through server routes)

## Architecture

### Dual-Mode System

The app supports two modes, auto-detected from environment variables:

- **Personal mode**: `NUXT_GITHUB_TOKEN` set — single user, no login, PAT in env
- **Multi-user mode**: `NUXT_GITHUB_CLIENT_ID` + `NUXT_GITHUB_CLIENT_SECRET` set — GitHub OAuth login
- **Unconfigured**: No env vars set — shows setup page

Mode detection: `server/utils/mode.ts` → exposed to client via `/api/_config` endpoint.

### Structure

```
app/
├── pages/
│   ├── index.vue           # Landing page
│   ├── login.vue           # GitHub OAuth login (multi-user)
│   ├── setup.vue           # Onboarding for unconfigured mode
│   ├── dashboard.vue       # Repository list
│   └── repos/[owner]/[repo]/
│       ├── index.vue       # Repo dashboard
│       ├── documents.vue   # Markdown docs from _bmad-output/
│       ├── roadmap.vue     # Sprint progress from sprint-status.yaml
│       ├── epics.vue       # Table + Kanban views
│       └── story/[id].vue  # Story detail
├── composables/
│   ├── useAuth.ts          # Auth state (dual-mode aware)
│   ├── useAppMode.ts       # App mode detection (client-side)
│   ├── useRepository.ts    # Repository CRUD
│   └── useApi.ts           # $fetch wrapper
├── middleware/
│   └── auth.global.ts      # Route protection (dual-mode)
├── plugins/
│   └── app-mode.ts         # Loads mode on startup
server/
├── api/
│   ├── _config.get.ts      # Exposes app mode to client
│   ├── repos/              # CRUD for repositories (SQLite/Drizzle)
│   └── github/             # GitHub API proxy (contents, tree, issues, pulls)
├── routes/
│   └── auth/github.get.ts  # OAuth handler (nuxt-auth-utils)
├── database/
│   └── schema.ts           # Drizzle ORM schema
└── utils/
    ├── mode.ts             # Dual-mode detection
    ├── auth.ts             # getAuthUser() — session or 'personal'
    ├── github-token.ts     # getGitHubToken() — session or env PAT
    ├── github.ts           # Octokit helpers
    └── database.ts         # SQLite connection singleton
shared/
└── types/
    └── auth.d.ts           # #auth-utils User type augmentation
```

### BMAD File Formats

The app parses these files from a GitHub repo's `_bmad-output/` directory:

- `sprint-status.yaml` — Sprint tracking with story statuses (YAML)
- `epics/*.md` — Epic definitions (Markdown)
- `epics/epic-X/story-Y.md` — Stories with YAML frontmatter (id, title, epic, status, priority, estimate)
- `PRD.md`, `architecture.md` — Project documentation (Markdown)

### Key Design Decisions

- **SSR disabled** (`ssr: false`) — reka-ui crashes in SSR
- **State management**: `useState` + `provide/inject` (no Pinia)
- **Tabs**: `v-show` pattern to preserve component state
- **GitHub tokens never stored in DB** — lives in session cookie (multi-user) or env var (personal)
- **All GitHub API calls proxied** through `server/api/github/*` — token never client-side

## Configuration

- **ESLint**: Uses `@nuxt/eslint` with stylistic rules (`commaDangle: 'never'`, `braceStyle: '1tbs'`)
- **Renovate**: Configured to follow `nuxt/renovate-config-nuxt` preset

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs on every push: lint + typecheck on Node 22 with pnpm.
