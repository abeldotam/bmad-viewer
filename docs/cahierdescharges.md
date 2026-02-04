# BMAD viewer

# 🎯 Vision du projet

**BMAD Viewer** est une application web open-source permettant de visualiser la progression d'un projet utilisant la méthodologie BMAD directement depuis un repository GitHub.

**Problème résolu** : Actuellement, les utilisateurs de BMAD n'ont pas de vue d'ensemble de leur projet au-delà du suivi des fichiers Markdown dans Git. BMAD Viewer comble ce gap en offrant une interface visuelle pour naviguer dans les documents, suivre la roadmap et gérer les stories.

---

# ✅ Décisions validées

| Question | Décision |
| --- | --- |
| Base de données | Supabase (PostgreSQL) |
| Authentification | Supabase Auth |
| Multi-repo | Oui, un utilisateur peut avoir plusieurs repos |
| Édition des stories | Mode lecture seule (voir section dédiée) |
| Instance hébergée | Roadmap v2 (self-host only pour v1) |
| Licence | MIT |
| Nom | BMAD Viewer |
| Real-time/Webhooks | Roadmap v2 |

---

# 📋 Fonctionnalités principales

## 1. Authentification & Gestion des repos

- Authentification via Supabase Auth (email/password ou GitHub OAuth)
- Stockage des GitHub tokens dans Supabase (chiffrés)
- Support multi-repo : un utilisateur peut ajouter plusieurs repos
- Liste des repos avec accès rapide

## 2. Visualisation des documents

- Listing de tous les fichiers `.md` du dossier `_bmad-output/`
- Rendu Markdown avec support des tables, code blocks, etc.
- Navigation arborescente des documents
- Recherche full-text dans les documents

## 3. Vue Roadmap / Progression

- Parsing du fichier `sprint-status.yaml`
- Visualisation du pourcentage d'avancement global
- Timeline des sprints
- Graphiques de progression (burndown chart optionnel)

## 4. Vue Epics & Stories

- Mode Table : DataTable Nuxt UI avec filtres et tri
- Mode Kanban : Colonnes par statut (To Do, In Progress, Done)
- Parsing des fichiers stories dans `epics/`
- Indicateurs de progression par epic

## 5. Détail d'une Story

- Affichage complet du contenu Markdown de la story
- Métadonnées : epic parent, statut, priorité, estimation
- Lien vers les PRs associées (parsing des commits/branches)
- Section commentaires

## 6. Système de commentaires → Issues GitHub

- Formulaire de commentaire sur chaque story
- Création automatique d'une issue GitHub via l'API
- Contenu de l'issue : titre de la story, lien vers le fichier, contexte minimal, commentaire utilisateur
- Affichage des issues existantes liées à la story

---

# 📖 Édition des stories dans BMAD

## Recommandation officielle BMAD

D'après la documentation BMAD, **les stories ne doivent PAS être éditées manuellement**. Le workflow BMAD suit un cycle strict :

1. `/create-story` → Crée le fichier story (via SM agent)
2. `/dev-story` → Implémente la story, met le statut à "READY FOR REVIEW"
3. `/code-review` → Valide et marque comme "done"

Le fichier `sprint-status.yaml` est le fichier central de tracking, mis à jour automatiquement par les workflows.

## Conséquence pour BMAD Viewer

**Mode lecture seule** pour la v1 :

- Visualisation uniquement
- Les commentaires créent des **issues GitHub** (pas de modification des fichiers)
- Pas d'édition du statut (ça casserait le workflow BMAD)

**Roadmap v2** (si demandé par la communauté) :

- Édition légère via commit API GitHub
- Synchronisation avec les workflows BMAD

---

# 🏗️ Architecture technique

## Stack technique

| Composant | Technologie |
| --- | --- |
| Framework | Nuxt 4 (full-stack) |
| UI Components | Nuxt UI (DataTable, Card, Modal, etc.) |
| Styling | Tailwind CSS (via Nuxt UI) |
| State Management | Pinia |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Markdown Rendering | @nuxt/content ou marked.js |
| YAML Parsing | js-yaml |
| GitHub API | Octokit.js |
| Hosting | Vercel / Netlify / Cloudflare Pages |

## Modèle de données Supabase

```sql
-- Users (géré par Supabase Auth)

-- Repositories
CREATE TABLE repositories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  owner VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  github_token_encrypted TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  last_synced_at TIMESTAMP,
  UNIQUE(user_id, owner, name)
);

-- Cache des fichiers (optionnel, pour performance)
CREATE TABLE cached_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repository_id UUID REFERENCES repositories(id) ON DELETE CASCADE,
  path VARCHAR(500) NOT NULL,
  content TEXT,
  sha VARCHAR(40),
  cached_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(repository_id, path)
);
```

## Structure du projet

```jsx
bmad-viewer/
├── app/
│   ├── components/
│   │   ├── DocumentViewer.vue
│   │   ├── EpicCard.vue
│   │   ├── KanbanBoard.vue
│   │   ├── ProgressChart.vue
│   │   ├── StoryDetail.vue
│   │   ├── CommentForm.vue
│   │   └── RepoSelector.vue
│   ├── pages/
│   │   ├── index.vue              # Landing
│   │   ├── login.vue              # Auth Supabase
│   │   ├── dashboard.vue          # Liste des repos
│   │   ├── repos/
│   │   │   └── [owner]/
│   │   │       └── [repo]/
│   │   │           ├── index.vue          # Dashboard repo
│   │   │           ├── documents.vue      # Tous les docs
│   │   │           ├── roadmap.vue        # Vue progression
│   │   │           ├── epics.vue          # Vue epics/stories
│   │   │           └── story/[id].vue     # Détail story
│   ├── layouts/
│   │   └── default.vue
│   ├── middleware/
│   │   └── auth.ts
│   └── composables/
│       ├── useGitHub.ts
│       ├── useBmadParser.ts
│       ├── useStoryStatus.ts
│       └── useSupabase.ts
├── server/
│   ├── api/
│   │   ├── repos/
│   │   │   ├── index.get.ts       # Liste repos user
│   │   │   ├── index.post.ts      # Ajouter un repo
│   │   │   └── [id].delete.ts     # Supprimer un repo
│   │   ├── github/
│   │   │   ├── contents.get.ts    # Fetch fichiers
│   │   │   └── issues.post.ts     # Créer issue
│   └── utils/
│       ├── github.ts
│       ├── supabase.ts
│       └── encryption.ts
├── nuxt.config.ts
└── package.json
```

## Flow de données

1. **Auth** : User se connecte via Supabase Auth
2. **Ajout repo** : User entre owner/repo + GitHub token → stockage chiffré Supabase
3. **Fetch structure** : API GitHub Contents pour lister `_bmad-output/`
4. **Parsing** : Récupération et parsing des fichiers MD/YAML
5. **Affichage** : Transformation en composants Vue
6. **Commentaire** : POST API GitHub Issues avec contexte

## Sécurité

- GitHub tokens chiffrés en base (AES-256)
- Row Level Security (RLS) Supabase : un user ne voit que ses repos
- Validation des tokens avant stockage
- HTTPS obligatoire

---

# 📁 Structure des fichiers BMAD à parser

## Fichiers principaux

| Fichier | Contenu | Usage |
| --- | --- | --- |
| [`PRD.md`](http://PRD.md) | Product Requirements Document | Vue documents |
| [`architecture.md`](http://architecture.md) | Décisions techniques | Vue documents |
| `sprint-status.yaml` | État des sprints | Vue roadmap |
| `epics/*.md` | Définition des epics | Vue epics |
| `epics/epic-X/[story-Y.md](http://story-Y.md)` | Stories détaillées | Vue stories |
| `bmm-workflow-status.yaml` | Statut des phases 1-3 | Vue progression |

## Format sprint-status.yaml (exemple)

```yaml
current_sprint: 1
sprints:
  - number: 1
    goal: "MVP core features"
    status: in_progress
    stories:
      - id: STORY-001
        status: done
      - id: STORY-002
        status: in_progress
```

## Format story (frontmatter YAML)

```markdown
---
id: STORY-001
title: "Implement user authentication"
epic: EPIC-01
status: done
priority: high
estimate: 5
assignee: null
---

# Story content...
```

---

# 🎨 UI/UX avec Nuxt UI

## Composants Nuxt UI à utiliser

| Composant | Usage |
| --- | --- |
| `UTable` / `UDataTable` | Liste des stories, documents |
| `UCard` | Cards pour epics, stories, repos |
| `UModal` | Détail story, formulaire commentaire |
| `UTabs` | Navigation Table/Kanban |
| `UBreadcrumb` | Navigation dans les docs |
| `UProgress` | Barre de progression |
| `UBadge` | Statuts (done, in progress, todo) |
| `UInput` / `UTextarea` | Formulaires |
| `UDropdown` | Sélection repo, filtres |
| `USkeleton` | Loading states |
| `UAvatar` | User avatar |
| `UNavigationMenu` | Sidebar navigation |

## Pages principales

### 1. Landing Page

- Présentation du produit
- CTA "Get Started" → Login

### 2. Login/Register

- Formulaire Supabase Auth
- Option "Login with GitHub"

### 3. Dashboard (multi-repo)

- Liste des repos connectés (cards)
- Bouton "Add Repository"
- Stats par repo (nb stories, % completion)

### 4. Repo Dashboard

- Stats globales : nb epics, nb stories, % completion
- Dernières stories modifiées
- Accès rapide aux vues

### 5. Documents

- Sidebar avec arborescence des fichiers
- Zone principale avec rendu Markdown
- Bouton "Open in GitHub"

### 6. Roadmap

- Timeline verticale des sprints
- Barres de progression par sprint
- Statistiques globales

### 7. Epics & Stories

- Toggle Table / Kanban
- Filtres : par epic, par statut, par priorité
- Recherche
- Click → ouvre modal ou page détail

### 8. Story Detail

- Header : titre, statut, epic, priorité
- Body : contenu Markdown
- Footer : PRs liées, issues existantes
- Action : Ajouter un commentaire

---

# 💬 Système de commentaires → Issues

## Flow utilisateur (commentaire sur story)

1. Ouvre une story
2. Clique "Add Comment"
3. Écrit son commentaire
4. Clique "Submit"
5. Une issue est créée sur GitHub
6. Lien vers l'issue affiché

## Format de l'issue créée (commentaire)

**Titre** : `[BMAD Comment] STORY-001: Implement user authentication`

**Body** :

```markdown
## 📍 Context

**Story**: STORY-001 - Implement user authentication
**Epic**: EPIC-01 - User Management
**File**: [`epics/epic-01/story-001.md`](link-to-file)
**Status**: In Progress

---

## 💬 Comment

[User's comment here]

---

*This issue was created via [BMAD Viewer](https://github.com/...)*
```

## Labels automatiques (commentaire)

- `bmad-comment`
- `story: STORY-001`
- `epic: EPIC-01`

---

# 🆕 Bouton "Nouvelle Story" / "Remonter un bug"

## Concept

Un bouton global dans l'app permettant de créer une issue GitHub avec un **pré-prompt pour BMAD**. L'utilisateur décrit ce qu'il veut (nouvelle feature, bug, amélioration), et l'issue créée contient toutes les instructions pour que BMAD puisse la traiter automatiquement.

## Flow utilisateur

1. Clique sur "+ New Story" ou "Report Bug" (bouton flottant ou dans la navbar)
2. Modal avec :
    - **Type** : Feature / Bug / Improvement (select)
    - **Titre** : Titre court
    - **Description** : Champ libre (textarea)
    - **Epic** (optionnel) : Sélection parmi les epics existants
    - **Priorité** (optionnel) : High / Medium / Low
3. Clique "Create Issue"
4. Issue créée sur GitHub avec le template BMAD

## Format de l'issue créée (nouvelle story)

**Titre** : `[NEW STORY] Titre fourni par l'utilisateur`

**Body** :

```markdown
## 🎯 Request

**Type**: Feature / Bug / Improvement
**Suggested Epic**: EPIC-XX (si sélectionné)
**Priority**: High / Medium / Low

---

## 📝 Description

[Description fournie par l'utilisateur]

---

## 🤖 Instructions for BMAD

This issue was created via BMAD Viewer and requires processing with BMAD workflows.

### To process this request:

1. **Load the SM agent** (`/bmad-agent-bmm-sm`)
2. **Run create-story workflow** (`/bmad-bmm-create-story`)
3. **Use this context** to create the story:
   - Title: [Issue title]
   - Description: [See description above]
   - Epic: [Suggested epic or determine appropriate epic]
   - Priority: [As specified]

### Story creation checklist:
- [ ] Story file created in appropriate epic folder
- [ ] Acceptance criteria defined
- [ ] Story added to sprint-status.yaml
- [ ] This issue linked in the story file
- [ ] This issue closed with reference to the story file

---

*This issue was created via [BMAD Viewer](https://github.com/...) and is ready for BMAD processing.*
```

## Labels automatiques (nouvelle story)

- `bmad-new-story` (pour feature)
- `bmad-bug` (pour bug)
- `bmad-improvement` (pour amélioration)
- `bmad-pending` (en attente de traitement)
- `priority: high/medium/low`

## Workflow BMAD pour traiter les issues

L'utilisateur pourra ensuite demander à BMAD de traiter toutes les issues `[NEW STORY]` :

```
/bmad-help Process all GitHub issues labeled 'bmad-pending' and create stories for them
```

Ou manuellement pour chaque issue :

1. Ouvrir l'issue GitHub
2. Copier le contexte
3. Lancer `/bmad-bmm-create-story` avec ce contexte
4. Fermer l'issue en référençant la story créée

---

# 🚀 Plan d'implémentation

## Phase 1 : MVP (2-3 semaines)

### Epic 1 : Setup & Auth

- [ ]  Initialiser projet Nuxt 4 + Nuxt UI
- [ ]  Configurer Supabase (projet, tables, RLS)
- [ ]  Implémenter auth Supabase (login/register)
- [ ]  Middleware de protection des routes

### Epic 2 : Gestion des repos

- [ ]  Page dashboard avec liste des repos
- [ ]  Modal "Add Repository" (owner/repo + token)
- [ ]  Stockage chiffré du token
- [ ]  Validation du token via API GitHub
- [ ]  Suppression d'un repo

### Epic 3 : Visualisation des documents

- [ ]  Fetch arborescence `_bmad-output/`
- [ ]  Sidebar navigation
- [ ]  Rendu Markdown
- [ ]  Lien "Open in GitHub"

### Epic 4 : Vue Roadmap

- [ ]  Parser `sprint-status.yaml`
- [ ]  Composant timeline
- [ ]  Barres de progression
- [ ]  Stats globales

### Epic 5 : Vue Epics & Stories (Table)

- [ ]  Parser tous les fichiers stories
- [ ]  DataTable avec colonnes : ID, Title, Epic, Status, Priority
- [ ]  Filtres et recherche
- [ ]  Lien vers détail

## Phase 2 : Enrichissement (2 semaines)

### Epic 6 : Vue Kanban

- [ ]  Composant Kanban board
- [ ]  Colonnes par statut
- [ ]  Drag & drop visuel (lecture seule, pas de modification)

### Epic 7 : Story Detail & Commentaires

- [ ]  Page détail story
- [ ]  Affichage PRs liées (parsing branches/commits)
- [ ]  Formulaire de commentaire
- [ ]  Création issue GitHub `[BMAD Comment]`
- [ ]  Affichage issues existantes liées
- [ ]  **Bouton "New Story" / "Report Bug"**
- [ ]  Modal de création avec champs (type, titre, description, epic, priorité)
- [ ]  Template d'issue `[NEW STORY]` avec pré-prompt BMAD
- [ ]  Labels automatiques selon le type

### Epic 8 : Polish & UX

- [ ]  Loading states (skeletons)
- [ ]  Error handling
- [ ]  Responsive design
- [ ]  Dark mode

## Phase 3 : Open-source ready (1-2 semaines)

### Epic 9 : Documentation & Release

- [ ]  README complet
- [ ]  Guide d'installation (self-host)
- [ ]  Guide de contribution
- [ ]  Démo vidéo
- [ ]  Release v1.0

---

# 🗺️ Roadmap v2+ (idées futures)

| Feature | Priorité | Description |
| --- | --- | --- |
| Instance hébergée | Haute | [bmad-viewer.app](http://bmad-viewer.app) avec free tier |
| GitHub OAuth | Haute | Login sans token manuel |
| Webhooks GitHub | Moyenne | Sync automatique à chaque push |
| Édition stories | Basse | Commit via API (avec prudence) |
| Notifications | Moyenne | Email/push sur changement de statut |
| Export PDF | Basse | Export des documents |
| Analytics | Moyenne | Métriques de vélocité, burndown |

---

# 🔗 Ressources

- **GitHub REST API** : [https://docs.github.com/en/rest](https://docs.github.com/en/rest)
- **Octokit.js** : [https://github.com/octokit/octokit.js](https://github.com/octokit/octokit.js)
- **Nuxt UI** : [https://ui.nuxt.com](https://ui.nuxt.com)
- **Supabase** : [https://supabase.com/docs](https://supabase.com/docs)
- **BMAD Method** : [https://github.com/bmad-code-org/BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD)
- **BMAD Docs** : [https://docs.bmad-method.org](https://docs.bmad-method.org)

---

# ✅ Prochaines étapes

1. ✅ Plan de conception validé
2. ✅ PRD créé (voir `_bmad-output/planning-artifacts/[PRD.md](http://PRD.md)`)
3. ✅ Architecture créée (voir `_bmad-output/planning-artifacts/[architecture.md](http://architecture.md)`)
4. ✅ Epics & Stories définis (35 stories, 5 sprints)
5. ✅ Sprint Status initialisé (voir `_bmad-output/implementation-artifacts/sprint-status.yaml`)
6. ⏳ **Initialiser le repo GitHub** `bmad-viewer`
7. ⏳ Créer projet Supabase
8. ⏳ Commencer Sprint 1 (Epic E01 + E02)

---

# 📦 Fichiers générés

Une archive complète du projet a été générée avec :

- [`README.md`](http://README.md) - Documentation du projet
- `LICENSE` - Licence MIT
- `_bmad-output/planning-artifacts/[PRD.md](http://PRD.md)` - Product Requirements Document complet
- `_bmad-output/planning-artifacts/[architecture.md](http://architecture.md)` - Document d'architecture avec ADRs
- `_bmad-output/planning-artifacts/[epics.md](http://epics.md)` - Liste de tous les epics
- `_bmad-output/planning-artifacts/epics/epic-01/` - Stories du Sprint 1
- `_bmad-output/implementation-artifacts/sprint-status.yaml` - Tracking BMAD

**Structure BMAD complète, prête à être pushée sur GitHub !**