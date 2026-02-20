# BMAD Viewer

[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

A web app to visualize [BMAD methodology](https://github.com/bmadcode/BMAD-METHOD) projects from GitHub repositories. Track sprints, epics, stories, and browse project documentation — all from your repo's `_bmad-output/` directory.

## Features

- Browse project documents (PRD, architecture, etc.) rendered as Markdown
- Sprint roadmap with progress bars per epic
- Story explorer with table and Kanban views
- Story detail with metadata, related PRs, and GitHub issue comments
- Dual-mode: single-user self-host or multi-user with GitHub OAuth

## Quick Start — Personal Mode

For a single user. No OAuth App needed — just a GitHub Personal Access Token.

```bash
# 1. Clone and configure
git clone https://github.com/abeldotam/bmad-viewer.git
cd bmad-viewer
cp .env.example .env

# 2. Set your GitHub token in .env
# NUXT_GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx

# 3. Run with Docker
docker compose up -d
```

Open [http://localhost:3000](http://localhost:3000). No login required.

> **Without Docker:** `pnpm install && pnpm build && node .output/server/index.mjs`

## Quick Start — Multi-user Mode

For hosting a shared instance (e.g., for a team). Requires a GitHub OAuth App.

### 1. Create a GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in:
   - **Application name:** BMAD Viewer (or anything you like)
   - **Homepage URL:** `http://localhost:3000` (or your domain)
   - **Authorization callback URL:** `http://localhost:3000/auth/github`
4. Click **Register application**
5. Copy the **Client ID**
6. Click **Generate a new client secret** and copy it

### 2. Configure and run

```bash
git clone https://github.com/abeldotam/bmad-viewer.git
cd bmad-viewer
cp .env.example .env
```

Edit `.env`:

```env
NUXT_OAUTH_GITHUB_CLIENT_ID=your_client_id
NUXT_OAUTH_GITHUB_CLIENT_SECRET=your_client_secret
NUXT_SESSION_PASSWORD=$(openssl rand -base64 32)
```

```bash
docker compose up -d
```

Open [http://localhost:3000](http://localhost:3000) and sign in with GitHub.

## Development

```bash
pnpm install       # Install dependencies (pnpm 10.28+ required)
pnpm dev           # Dev server on http://localhost:3000
pnpm lint          # ESLint
pnpm typecheck     # TypeScript type checking
pnpm build         # Production build
```

## Tech Stack

- **Nuxt 4** — Full-stack Vue framework
- **Nuxt UI 4** — Component library (Tailwind CSS 4)
- **SQLite** — Embedded database via better-sqlite3 + Drizzle ORM
- **nuxt-auth-utils** — GitHub OAuth with encrypted session cookies
- **Octokit** — GitHub API client (server-side proxy)

## Production Deployment

### Security recommendations

- Always use **HTTPS** (reverse proxy with nginx, Caddy, or Traefik)
- Generate a strong `NUXT_SESSION_PASSWORD`: `openssl rand -base64 32`
- Keep the SQLite database backed up (`data/bmad-viewer.db`)
- For multi-user: set the OAuth callback URL to your production domain

### Updating

```bash
git pull
docker compose up -d --build
```

### Reverse proxy (Caddy example)

```
bmad.example.com {
    reverse_proxy localhost:3000
}
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/my-feature`)
3. Commit your changes
4. Push to the branch and open a Pull Request

Please run `pnpm lint && pnpm typecheck` before submitting.

## License

[MIT](LICENSE)
