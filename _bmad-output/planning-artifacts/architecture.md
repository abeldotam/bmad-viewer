---
stepsCompleted:
  - step-01-init
  - step-02-context
  - step-03-starter
  - step-04-decisions
  - step-05-patterns
  - step-06-structure
  - step-07-validation
  - step-08-complete
lastStep: 8
status: 'complete'
completedAt: '2026-02-05'
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - docs/cahierdescharges.md
  - CLAUDE.md
  - _bmad-output/planning-artifacts/prd-validation-report.md
workflowType: 'architecture'
project_name: 'bmad-viewer'
user_name: 'Abel'
date: '2026-02-05'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements :**
34 FRs en 8 groupes : Auth & session (FR1-FR5), Gestion repos (FR6-FR10), Documents (FR11-FR13), Suivi progression (FR14-FR17), Epics & Stories (FR18-FR23), Détail story (FR24-FR27), Commentaires & issues GitHub (FR28-FR31), Données & résilience (FR32-FR34).

Implications architecturales : architecture à deux couches (client SPA + API Nitro), proxy GitHub côté serveur pour protéger les tokens, parseurs BMAD tolérants aux variations de format.

**Non-Functional Requirements :**
- **Performance :** < 3s chargement repo, navigation inter-onglets instantanée (0 appel API), filtres < 100ms, rendu Markdown < 500ms
- **Sécurité :** AES-256-GCM pour tokens, RLS Supabase, tokens jamais côté client, sessions validées par requête
- **Intégration GitHub :** Gestion gracieuse erreurs API, support repos privés/publics, tolérance rate limit 5000 req/h

**Scale & Complexity :**
- Primary domain : full-stack web (SPA + API server)
- Complexity level : low
- Estimated architectural components : ~15 (8 pages, 4 API groups, 3 server utils)

### Technical Constraints & Dependencies

- **SSR désactivé** : reka-ui (couche headless Nuxt UI v4) crash en SSR (UHeader drawer, Label, ConfigProvider). App derrière auth, SEO non requis.
- **Nuxt 4 + Nuxt UI v4** : Stack imposée, conventions Nuxt standard (auto-imports, file-based routing, Nitro server)
- **Supabase obligatoire** : Auth, PostgreSQL, RLS — pas d'alternative envisagée pour v1
- **GitHub API REST** : Rate limit 5000 req/h, pagination pour gros repos, tokens PAT classiques
- **@nuxtjs/mdc** : Rendu Markdown dans les composants Vue, pas de SSR

### Cross-Cutting Concerns Identified

1. **Flux d'authentification** : Supabase Auth (email/OAuth) → session client → validation session sur chaque API route → GitHub token déchiffré côté serveur → Octokit
2. **Gestion d'erreurs GitHub** : Token expiré, rate limit, repo supprimé, fichiers manquants — chaque cas avec message utilisateur explicite
3. **Stratégie de cache** : `cached_files` Supabase (SHA-based), préchargement complet à l'ouverture repo, données potentiellement stales (trade-off accepté)
4. **Sécurité des tokens** : AES-256-GCM encrypt/decrypt dans `server/utils/encryption.ts`, jamais transmis au client, RLS pour isolation utilisateur

## Starter Template Evaluation

### Primary Technology Domain

Full-stack web application (SPA + API server). Domaine identifié depuis l'analyse des exigences : client SPA Nuxt avec couche API Nitro pour proxy GitHub et intégration Supabase.

### Starter Options Considered

**Projet brownfield** — Le starter a été sélectionné en amont du développement. Pas d'évaluation comparative nécessaire.

### Selected Starter: Nuxt UI Starter

**Rationale :**
- Nuxt UI v4 est la couche composants de référence pour Nuxt 4 (UTable, UCard, UModal, UTabs, UProgress, UBadge)
- Tailwind CSS 4 intégré (CSS-first, design tokens via `app.config.ts`)
- TypeScript configuré par défaut
- ESLint avec règles stylistic Nuxt
- Structure `app/` directory (Nuxt 4 convention)

**Initialization Command (historique) :**

```bash
pnpm dlx nuxi@latest init -t ui bmad-viewer
```

### Architectural Decisions Provided by Starter

**Language & Runtime :** TypeScript 5.9, Node.js 22 (CI), mode strict

**Styling Solution :** Tailwind CSS 4 (CSS-first config dans `app/assets/css/main.css`), palette custom via `app.config.ts` (primary: green, neutral: slate)

**Build Tooling :** Vite (via Nuxt), Nitro server, optimisation automatique

**Testing Framework :** Non inclus dans le starter — pas de tests formels v1

**Code Organization :** `app/` directory (pages, components, composables, utils, middleware, assets), `server/` (api, utils), `shared/` (types)

**Development Experience :** HMR Vite, auto-imports, DevTools Nuxt, ESLint watch

**Modules ajoutés post-init :**
- `@nuxtjs/supabase` — Auth + DB
- `@nuxtjs/mdc` — Rendu Markdown
- `js-yaml` — Parsing YAML
- `octokit` — GitHub API

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation) :**
Toutes prises — aucune décision bloquante restante.

**Important Decisions (Shape Architecture) :**
- State management : `useState` + `provide/inject` (pas Pinia)
- Préchargement complet via `useRepoData`
- Tabs `v-show` pour préserver l'état
- Proxy serveur pour GitHub API

**Deferred Decisions (Post-MVP) :**
- Framework de test (prévu, non bloquant v1)
- Monitoring/logging (usage personnel, pas critique v1)
- Instance hébergée publique (v2)
- Webhooks GitHub pour sync auto (v2)

### Data Architecture

| Décision | Choix | Rationale |
|----------|-------|-----------|
| Base de données | Supabase PostgreSQL | Hébergé, RLS natif, Auth intégrée |
| Schéma | `repositories` + `cached_files` | 2 tables suffisent pour le périmètre v1 |
| Tokens | Chiffrement AES-256-GCM (`@noble/ciphers`) | Jamais en clair en base, déchiffrement serveur uniquement |
| Cache | `cached_files` avec SHA Git | Invalidation par comparaison SHA, réduit les appels GitHub |
| Préchargement | Complet à l'ouverture du repo | Toutes les données en parallèle via `useRepoData`, navigation instantanée |
| Validation | Côté serveur (API routes Nitro) | Validation token GitHub + existence repo avant stockage |

### Authentication & Security

| Décision | Choix | Rationale |
|----------|-------|-----------|
| Auth provider | Supabase Auth | Email/password + GitHub OAuth, sessions gérées |
| Session persistence | Cookie Supabase client-side | Refresh auto, pas de déconnexion au reload |
| Route protection | Middleware global `auth.global.ts` | Redirige vers `/login` si non authentifié |
| API protection | Validation session par requête serveur | `server/utils/auth.ts` vérifie le token Supabase |
| Isolation données | RLS Supabase | `user_id = auth.uid()` sur `repositories` |
| Token GitHub | Server-side only | Jamais transmis au client, déchiffré dans les API routes |

### API & Communication Patterns

| Décision | Choix | Rationale |
|----------|-------|-----------|
| API style | REST (Nitro server routes) | Convention Nuxt, file-based (`server/api/`) |
| GitHub proxy | API routes dédiées (`/api/github/*`) | Token jamais côté client, gestion centralisée erreurs |
| Error handling | Messages explicites par type d'erreur | Token expiré, rate limit, repo supprimé, fichier manquant |
| Client API | Composable `useApi` | Wrapper fetch avec auth headers et error handling |
| Format parsing | `useBmadParser` (composable) | Tolérant aux variations : sprint-based, epic-based, avec/sans frontmatter |

### Frontend Architecture

| Décision | Choix | Rationale |
|----------|-------|-----------|
| State management | `useState` + `provide/inject` | Léger, suffisant pour le périmètre. Pas de Pinia. |
| Data flow | `useRepoData` (provide au niveau repo) | Précharge tout, inject dans les composants enfants |
| Navigation repo | `v-show` tabs (ADR-4) | Préserve état filtres/scroll, pas de re-render |
| Rendering | SPA client-only (`ssr: false`) | Crashes reka-ui en SSR, SEO non requis |
| Markdown | `@nuxtjs/mdc` composant `<MDC>` | Rendu dans les composants Vue, support frontmatter |
| Components | Nuxt UI v4 (UTable, UCard, UTabs, etc.) | Design system cohérent, accessibilité intégrée |
| Routing | File-based (`app/pages/`) | Convention Nuxt, routes dynamiques `[owner]/[repo]` |

### Infrastructure & Deployment

| Décision | Choix | Rationale |
|----------|-------|-----------|
| Hosting | Netlify (actuel) | Pas de préférence forte, facilement portable |
| CI/CD | GitHub Actions | Lint + typecheck sur chaque push (Node 22, pnpm) |
| Tests | À prévoir (non bloquant v1) | Vitest + @vue/test-utils recommandés pour l'écosystème Nuxt |
| Monitoring | Aucun v1 | Usage personnel, acceptable. À envisager v2 |
| Environnement | `.env` (SUPABASE_URL, SUPABASE_KEY, ENCRYPTION_KEY) | Variables sensibles, jamais commitées |

### Decision Impact Analysis

**Séquence d'implémentation :**
1. Supabase (schema + RLS) → Auth → Middleware
2. Server utils (encryption, github, supabase) → API routes
3. Composables (useRepoData, useBmadParser) → Pages
4. Composants UI → Polish

**Dépendances inter-composants :**
- `useRepoData` dépend de toutes les API routes GitHub
- Les pages repo dépendent du `provide/inject` de `useRepoData`
- La création d'issues dépend de l'auth + token déchiffré
- Le cache `cached_files` dépend du schéma Supabase

## Implementation Patterns & Consistency Rules

### Naming Patterns

**Database :**
- Tables : `snake_case` pluriel (`repositories`, `cached_files`)
- Colonnes : `snake_case` (`user_id`, `github_token_encrypted`, `last_synced_at`)
- Foreign keys : `{table_singulier}_id` (`repository_id`, `user_id`)

**API Routes (Nitro) :**
- `index.{method}.ts` = opération sur la collection (`GET /api/repos`, `POST /api/repos`)
- `[param].{method}.ts` = opération sur une ressource (`DELETE /api/repos/[id]`)
- `{nom}.{method}.ts` = sous-ressource nommée (`GET /api/github/tree`, `GET /api/github/contents`)
- Organisation : par ressource (`server/api/repos/`, `server/api/github/`)
- Query params : `camelCase` (`repoId`, `filePath`)

**Code TypeScript :**
- Variables/fonctions : `camelCase` (`fetchRepos`, `parseSprintStatus`)
- Types/interfaces : `PascalCase` — suffixes par catégorie :
  - Entités domaine : nom simple (`Story`, `Epic`, `Sprint`, `Repository`)
  - Statuts/enums : suffixe `Status` ou `Type` (`StoryStatus`, `Priority`)
  - Payloads API : suffixe `Payload` (input) / `Response` (output) (`CommentPayload`, `RepoResponse`)
- Composables : `use` + `PascalCase` (`useRepoData`, `useBmadParser`, `useAuth`)
- Utils : `camelCase` fonctions exportées (`getStatusColor`, `encrypt`, `decrypt`)
- Props/emits : syntaxe TypeScript pure uniquement :
  - `defineProps<{ story: Story }>()`
  - `defineEmits<{ select: [story: Story] }>()`

**Composants Vue :**
- Fichiers : `PascalCase.vue` (`StoryHeader.vue`, `KanbanBoard.vue`)
- Organisation : par domaine fonctionnel (`epics/`, `kanban/`, `story/`, `roadmap/`, `documents/`, `loading/`, `dashboard/`)

### Structure Patterns

**Organisation projet :**

```
app/
├── pages/                    # Routes (file-based)
├── components/
│   ├── {domain}/             # Groupés par domaine fonctionnel
│   └── loading/              # Skeletons (transverse)
├── composables/              # Flat (pas de sous-dossiers)
├── utils/                    # Helpers purs (pas de state)
├── middleware/                # Auth global
└── assets/css/               # Tailwind + custom
server/
├── api/{resource}/           # REST routes par ressource
└── utils/                    # Flat (auth, encryption, github, supabase)
shared/
└── types/                    # Types partagés client/serveur
```

**Conventions fichiers :**
- 1 composable = 1 fichier, 1 API route = 1 fichier, 1 composant = 1 SFC
- Pas de fichiers barrel sauf `shared/types/index.ts`
- Auto-import côté client (jamais d'import explicite pour composables/utils)
- Import explicite côté serveur pour librairies tierces (`js-yaml`, `octokit`)

**Types partagés vs locaux :**
- `shared/types/` : types utilisés dans 2+ fichiers (domaine, API payloads)
- Type local : uniquement interne à un composable/composant, jamais réutilisé
- Règle : si utilisé 2+ fichiers → `shared/types/`

**Limites de taille :**
- Template composant > 150 lignes → décomposer en sous-composants
- Composable > 200 lignes → splitter en composables spécialisés
- API route > 80 lignes → extraire la logique dans `server/utils/`

### Format Patterns

**API Responses :**
- Succès : retour direct de la donnée (convention Nitro, pas de wrapper)
- Erreur : `throw createError({ statusCode, statusMessage })` (Nitro standard)

**Valeurs par défaut (cas limites) :**
- Collections absentes : `[]` (tableau vide, jamais `null`)
- Entité absente : `null` (jamais `undefined`)
- String absente : `null` (jamais `""`)
- État vide UI : `v-if="!data.length"` → composant état vide explicite

**Types de données :**
- Dates : ISO 8601 strings (`2026-02-05T10:30:00Z`)
- Booleans : `true/false` (jamais `1/0`)
- JSON client-side : `camelCase`, JSON DB-side : `snake_case`

### Communication Patterns

**State management :**
- `useState` pour état global simple (user, repos list)
- `provide/inject` pour état scoped (données repo)
- Pas de Pinia — pas de store centralisé
- Mise à jour immutable (`ref.value = newValue`)

**Composables de fetch vs utilitaires :**
- Composables de fetch (`useRepoData`, `useRepository`, `useGitHub`, `useGitHubIssues`) : retour standardisé `data/loading/error`
- Composables utilitaires (`useBmadParser`, `useStoryStatus`, `useErrorHandler`) : retour libre

**Client API :**
- Pages/composables : toujours `useApi` (wrapper avec auth + error handling)
- Server-side (API routes) : `$fetch` interne ou appel direct Octokit
- Jamais de `useFetch` ou `useAsyncData` directement dans les composants

**Data flow repo :**
```
useRepoData (provide au niveau [owner]/[repo].vue)
  ├── documents → inject dans DocumentTree, DocumentViewer
  ├── sprints → inject dans SprintTimeline, GlobalStats
  ├── stories → inject dans StoriesTable, KanbanBoard
  └── pulls → inject dans RelatedPRs, SprintCard
```

### Process Patterns

**Error handling :**
- API routes : `throw createError()` avec `statusCode` + `statusMessage`
- Client : `useErrorHandler` + UToast pour feedback utilisateur
- GitHub errors : messages spécifiques par type (token expiré, rate limit, 404)
- Jamais de `console.error` silencieux

**Loading states :**
- Skeleton components par type de vue (`TableSkeleton`, `CardSkeleton`, `DocumentSkeleton`, `TimelineSkeleton`)
- Loading global au niveau `useRepoData`, pas de loading par onglet après préchargement

**Auth flow :**
- `auth.global.ts` middleware global
- Pages publiques : `/`, `/login`, `/register`, `/auth/callback`
- `definePageMeta` uniquement si comportement spécifique (pas de redéclaration du middleware global)

### Enforcement Guidelines

**Tout agent IA DOIT :**
- Suivre les conventions de nommage (vérifiable par ESLint + review)
- Utiliser les composants Nuxt UI (jamais de HTML brut pour UI standard)
- Passer par `useApi` côté client (jamais `useFetch` direct)
- Passer par les API routes serveur pour GitHub (jamais Octokit côté client)
- Utiliser `createError()` pour les erreurs API (jamais `return { error }`)
- Documenter les types dans `shared/types/` si utilisés 2+ fichiers
- `strict: true` TypeScript, `any` interdit, `unknown` pour données externes
- `as` casts à éviter, préférer type guards
- Respecter les limites de taille (150/200/80 lignes)

**Anti-patterns :**
- Créer un store Pinia
- Appeler l'API GitHub côté client
- Utiliser `useFetch`/`useAsyncData` directement
- `any` dans le code TypeScript
- Composants monolithiques > 150 lignes de template
- `console.log` en production
- Barrel files (`index.ts`) hors `shared/types/`

## Project Structure & Boundaries

### Complete Project Directory Structure

```
bmad-viewer/
├── .env.example                          # Variables d'environnement
├── .github/workflows/ci.yml             # CI: lint + typecheck (Node 22, pnpm)
├── nuxt.config.ts                        # Config Nuxt (ssr: false, modules, supabase)
├── app.config.ts                         # Theme UI (primary: green, neutral: slate)
├── package.json                          # Dépendances (pnpm 10.28.2)
├── tsconfig.json                         # TypeScript (strict via Nuxt)
├── eslint.config.mjs                     # ESLint stylistic rules
│
├── app/
│   ├── app.vue                           # Root layout (UApp, UHeader, UMain)
│   ├── error.vue                         # Page erreur globale (404, 401, 500)
│   ├── assets/css/main.css               # Tailwind CSS 4 + custom palette
│   ├── middleware/
│   │   └── auth.global.ts                # Protection routes (→ /login si non auth)
│   ├── pages/
│   │   ├── index.vue                     # Landing page + CTA
│   │   ├── login.vue                     # Auth email + GitHub OAuth
│   │   ├── register.vue                  # Inscription email
│   │   ├── dashboard.vue                 # Dashboard multi-repo
│   │   ├── auth/callback.vue             # Callback OAuth GitHub
│   │   └── repos/[owner]/[repo]/
│   │       ├── index.vue                 # Page repo (tabs v-show)
│   │       └── story/[id].vue            # Détail story
│   ├── components/
│   │   ├── BmadLogo.vue                  # Logo BMAD Viewer
│   │   ├── RepoNavigation.vue            # Navigation onglets repo
│   │   ├── NewStoryModal.vue             # Modal création issue [NEW STORY]
│   │   ├── dashboard/
│   │   │   ├── RepoCard.vue              # Card repo
│   │   │   └── AddRepoModal.vue          # Modal ajout repo
│   │   ├── documents/
│   │   │   ├── DocumentTree.vue          # Arbre navigable
│   │   │   ├── DocumentViewer.vue        # Rendu Markdown (MDC)
│   │   │   └── DocumentBreadcrumb.vue    # Fil d'Ariane
│   │   ├── roadmap/
│   │   │   ├── GlobalStats.vue           # Stats globales
│   │   │   ├── SprintTimeline.vue        # Timeline verticale
│   │   │   └── SprintCard.vue            # Card sprint
│   │   ├── epics/
│   │   │   ├── EpicProgressCards.vue     # Cards progression par epic
│   │   │   ├── StoriesTable.vue          # UTable stories
│   │   │   ├── StoryFilters.vue          # Filtres + recherche
│   │   │   ├── StatusBadge.vue           # Badge statut
│   │   │   └── PriorityBadge.vue         # Badge priorité
│   │   ├── kanban/
│   │   │   ├── KanbanBoard.vue           # Board 3 colonnes
│   │   │   ├── KanbanColumn.vue          # Colonne par statut
│   │   │   └── KanbanCard.vue            # Card story
│   │   ├── story/
│   │   │   ├── StoryHeader.vue           # Titre, badges, breadcrumb
│   │   │   ├── StoryContent.vue          # Rendu Markdown
│   │   │   ├── StoryMetadata.vue         # Sidebar métadonnées
│   │   │   ├── CommentForm.vue           # Commentaire → issue
│   │   │   ├── LinkedIssues.vue          # Issues liées
│   │   │   └── RelatedPRs.vue            # PRs associées
│   │   └── loading/
│   │       ├── TableSkeleton.vue
│   │       ├── CardSkeleton.vue
│   │       ├── DocumentSkeleton.vue
│   │       └── TimelineSkeleton.vue
│   ├── composables/
│   │   ├── useApi.ts                     # Wrapper fetch (auth + error)
│   │   ├── useAuth.ts                    # Login, register, logout, OAuth
│   │   ├── useRepoData.ts               # Préchargement complet (provide)
│   │   ├── useRepository.ts             # CRUD repos
│   │   ├── useGitHub.ts                 # Fetch GitHub (tree, contents, pulls)
│   │   ├── useGitHubIssues.ts           # Issues (create, fetch)
│   │   ├── useBmadParser.ts             # Parsing YAML/Markdown
│   │   ├── useStoryStatus.ts            # Calculs progression
│   │   └── useErrorHandler.ts           # Erreurs centralisées + toasts
│   └── utils/
│       └── status.ts                     # getStatusColor, getPriorityIcon
│
├── server/
│   ├── api/
│   │   ├── repos/
│   │   │   ├── index.get.ts             # GET liste repos user
│   │   │   ├── index.post.ts            # POST ajout repo
│   │   │   └── [id].delete.ts           # DELETE suppression repo
│   │   └── github/
│   │       ├── tree.get.ts              # GET arbre _bmad-output/
│   │       ├── contents.get.ts          # GET contenu fichier
│   │       ├── pulls.get.ts             # GET PRs repo
│   │       ├── issues.get.ts            # GET issues liées
│   │       └── issues.post.ts           # POST créer issue
│   └── utils/
│       ├── auth.ts                       # Validation session Supabase
│       ├── encryption.ts                 # AES-256-GCM
│       ├── github.ts                     # Octokit wrapper
│       └── supabase.ts                   # Client Supabase server-side
│
├── shared/types/
│   ├── bmad.ts                           # Story, Epic, Sprint, Repository, etc.
│   └── index.ts                          # Barrel export
│
├── supabase/migrations/
│   └── 001_initial_schema.sql            # repositories + cached_files + RLS
│
└── tests/                                # À créer (Vitest)
    ├── composables/
    ├── components/
    └── server/
```

### Architectural Boundaries

**API Boundaries :**
- `/api/repos/*` — CRUD repos Supabase, auth requise
- `/api/github/*` — Proxy GitHub, token déchiffré server-side, auth requise
- Toutes les routes valident la session via `server/utils/auth.ts`

**Component Boundaries :**
- `app.vue` → layout global
- `repos/[owner]/[repo]/index.vue` → `provide(repoData)` point d'injection
- Composants enfants → `inject(repoData)` consommation
- `loading/*` → transversaux

**Data Boundaries :**
- Supabase : stockage persistant (repos, cache)
- GitHub API : lecture seule (_bmad-output/, PRs, issues)
- Client state : `useState` (global), `provide/inject` (scoped)

### Requirements to Structure Mapping

| FRs | Fichiers |
|-----|----------|
| FR1-FR5 (Auth) | `login.vue`, `register.vue`, `auth/callback.vue`, `useAuth.ts`, `auth.global.ts`, `server/utils/auth.ts` |
| FR6-FR10 (Repos) | `dashboard.vue`, `RepoCard.vue`, `AddRepoModal.vue`, `useRepository.ts`, `server/api/repos/*`, `encryption.ts` |
| FR11-FR13 (Documents) | `DocumentTree.vue`, `DocumentViewer.vue`, `DocumentBreadcrumb.vue`, `tree.get.ts`, `contents.get.ts` |
| FR14-FR17 (Progression) | `GlobalStats.vue`, `SprintTimeline.vue`, `SprintCard.vue`, `useStoryStatus.ts` |
| FR18-FR23 (Epics/Stories) | `StoriesTable.vue`, `StoryFilters.vue`, `KanbanBoard.vue`, `EpicProgressCards.vue` |
| FR24-FR27 (Détail) | `story/[id].vue`, `StoryHeader.vue`, `StoryContent.vue`, `StoryMetadata.vue`, `RelatedPRs.vue`, `LinkedIssues.vue` |
| FR28-FR31 (Issues) | `CommentForm.vue`, `NewStoryModal.vue`, `useGitHubIssues.ts`, `issues.post.ts` |
| FR32-FR34 (Données) | `useRepoData.ts`, `useBmadParser.ts`, `server/api/github/*` |

### Integration Points

**Flux de données :**
```
User → Supabase Auth → Session
  → dashboard → useRepository → /api/repos (Supabase)
    → repo page → useRepoData
      → /api/github/tree + contents + pulls (Octokit)
      → useBmadParser (YAML/MD)
      → provide(documents, sprints, stories, pulls)
        → tabs Documents / Roadmap / Epics (inject)
```

**Intégrations externes :**
- Supabase : Auth, PostgreSQL, RLS
- GitHub API : Contents, Pulls, Issues
- Netlify : Hosting, deploy auto

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility :** Toutes les technologies sont compatibles. Nuxt 4 + Nuxt UI v4 + Tailwind CSS 4 + Supabase + MDC forment un stack cohérent sans conflit de version.

**Pattern Consistency :** Les patterns d'implémentation sont alignés avec le stack technique. 12 règles ajoutées via Advanced Elicitation comblent les zones d'ambiguïté.

**Structure Alignment :** Le tree projet reflète exactement les décisions architecturales.

### Requirements Coverage ✅

**Functional Requirements :** 34/34 FRs couverts. Chaque FR trace vers au moins un fichier.

**Non-Functional Requirements :** 14/14 NFRs supportés. Performance par préchargement, sécurité par encryption + RLS + proxy, intégration par error handling.

### Implementation Readiness ✅

**Decision Completeness :** Toutes les décisions critiques et importantes documentées.

**Pattern Completeness :** 5 catégories de patterns + enforcement guidelines + anti-patterns.

**Structure Completeness :** Tree complet avec 40+ fichiers, mapping FR → fichiers explicite.

### Gap Analysis

| Priorité | Gap | Impact |
|----------|-----|--------|
| Important | Framework de test non configuré | Non bloquant v1, Vitest prévu |
| Minor | Pas de diagramme de séquence | Flux textuel suffit (complexité low) |
| Minor | Pas de stratégie migration DB | 2 tables, pas de migration prévue v1 |

### Architecture Completeness Checklist

- [x] Contexte projet analysé
- [x] Scale et complexité évalués
- [x] Contraintes techniques identifiées
- [x] Concerns transversaux mappés
- [x] Décisions critiques documentées avec versions
- [x] Stack technique spécifié
- [x] Patterns d'intégration définis
- [x] Performance adressée
- [x] Conventions de nommage établies
- [x] Patterns de structure définis
- [x] Patterns de communication spécifiés
- [x] Patterns de process documentés
- [x] Structure répertoire complète
- [x] Boundaries composants établies
- [x] Points d'intégration mappés
- [x] Mapping requirements → structure complet

### Architecture Readiness Assessment

**Overall Status :** READY FOR IMPLEMENTATION

**Confidence Level :** High

**Forces :**
- Architecture brownfield fidèle au code existant
- Patterns enrichis par 2 sessions d'élicitation avancée (12 règles)
- Mapping complet FRs → fichiers
- Enforcement guidelines + anti-patterns clairs

**Améliorations futures :**
- Ajouter Vitest + @vue/test-utils
- Monitoring (Sentry) en v2
- Diagrammes de séquence si complexité augmente
