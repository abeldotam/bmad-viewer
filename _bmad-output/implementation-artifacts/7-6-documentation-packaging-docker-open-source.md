# Story 7.6: Documentation, packaging Docker & open-source

Status: done

## Story

As a **nouveau contributeur ou self-hoster**,
I want **clear documentation and a Docker setup to install bmad-viewer in under 5 minutes**,
So that **I can get started without understanding the internals**.

## Acceptance Criteria

1. Given je clone le repo, When je lis le README, Then je trouve un Quick Start pour le mode Personal (3 étapes) et Multi-user (5 étapes) (AC:1)
2. Given je copie `.env.example`, When je lis les commentaires, Then chaque variable est documentée avec son rôle et le mode concerné (AC:2)
3. Given je lance `docker compose up`, When le build est terminé, Then l'application est accessible sur `http://localhost:3000` (AC:3)
4. Given je veux contribuer, When je lis le README, Then je trouve la licence, les guidelines de contribution, et comment lancer en dev (AC:4)
5. Given je veux créer une GitHub OAuth App, When je lis la documentation, Then je trouve un guide pas-à-pas avec les URLs de callback à configurer (AC:5)
6. Given je déploie en production, When je lis la documentation, Then je trouve les recommandations de sécurité (HTTPS, secrets, reverse proxy) (AC:6)

## Tasks / Subtasks

- [x] Task 1 — Réécrire le README.md (AC: #1, #4)
- [x] Task 2 — `.env.example` déjà complet (Story 7.1, nettoyé en 7.5)
- [x] Task 3 — Créer `Dockerfile` (AC: #3)
- [x] Task 4 — Créer `docker-compose.yml` (AC: #3)
- [x] Task 5 — Documenter la création d'une GitHub OAuth App (AC: #5)
- [x] Task 6 — Recommandations de production (AC: #6)
- [x] Task 7 — Licence MIT ajoutée (AC: #4)
- [x] Task 8 — `.gitignore` mis à jour (AC: #3)

## Dev Notes

### Dépendances

- Dépend de Story 7.5 (nettoyage terminé — le code est dans son état final)
- Dernière story de l'epic

### Structure Docker

```dockerfile
# Dockerfile
FROM node:22-alpine AS builder
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/.output .output
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
```

```yaml
# docker-compose.yml
services:
  bmad-viewer:
    build: .
    ports:
      - "3000:3000"
    env_file: .env
    volumes:
      - ./data:/app/data
```

### Implémentation (2026-02-20)

- README.md inclut Quick Start Personal (3 étapes) et Multi-user (5 étapes avec guide OAuth)
- Dockerfile multi-stage : builder (pnpm install + build) → runtime Node 22 alpine minimal
- docker-compose.yml avec volume pour data/ et env_file
- Guide OAuth pas-à-pas dans le README (pas de screenshots, instructions textuelles claires)
- Section Production Deployment avec HTTPS, backup, updating, reverse proxy Caddy
- CLAUDE.md déjà mis à jour en Story 7.5 avec la nouvelle architecture

### File List

- `README.md` — Nouveau
- `Dockerfile` — Nouveau
- `docker-compose.yml` — Nouveau
- `LICENSE` — Nouveau (MIT)
- `.gitignore` — Modifié (data/, *.db, *.sqlite)
- `CLAUDE.md` — Mis à jour (Story 7.5)
