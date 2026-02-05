---
stepsCompleted:
  - step-01-validate-prerequisites
  - step-02-design-epics
  - step-03-create-stories
  - step-04-final-validation
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/architecture.md
workflowType: 'epics'
project_name: 'bmad-viewer'
status: 'complete'
completedAt: '2026-02-05'
lastStep: 4
---

# BMAD Viewer - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for BMAD Viewer, decomposing the requirements from the PRD and Architecture into implementable stories.

## Requirements Inventory

### Functional Requirements

- FR1 : L'utilisateur peut créer un compte via email/mot de passe
- FR2 : L'utilisateur peut se connecter via GitHub OAuth
- FR3 : L'utilisateur peut se déconnecter
- FR4 : L'utilisateur reste authentifié après un refresh de page
- FR5 : L'utilisateur non authentifié est redirigé vers la page de connexion
- FR6 : L'utilisateur peut voir la liste de ses repos connectés sur le dashboard
- FR7 : L'utilisateur peut ajouter un repo GitHub en fournissant owner/name et un token
- FR8 : Le système valide le token GitHub et l'existence du repo avant ajout
- FR9 : L'utilisateur peut supprimer un repo connecté
- FR10 : Le système stocke les tokens GitHub de manière chiffrée
- FR11 : L'utilisateur peut naviguer dans l'arborescence des documents `_bmad-output/`
- FR12 : L'utilisateur peut lire le contenu Markdown d'un document avec rendu formaté
- FR13 : L'utilisateur peut ouvrir un document directement sur GitHub
- FR14 : L'utilisateur peut voir la progression globale du projet (stories, % avancement)
- FR15 : L'utilisateur peut voir les epics avec statut et progression individuelle
- FR16 : L'utilisateur peut voir les PRs liées à chaque epic
- FR17 : L'utilisateur peut cliquer sur une PR pour l'ouvrir sur GitHub
- FR18 : L'utilisateur peut voir les stories en vue table (ID, titre, epic, statut, priorité, estimation)
- FR19 : L'utilisateur peut filtrer les stories par statut, priorité et epic
- FR20 : L'utilisateur peut rechercher une story par texte libre
- FR21 : L'utilisateur peut voir les stories en vue kanban par statut
- FR22 : L'utilisateur peut basculer entre table et kanban
- FR23 : L'utilisateur peut accéder au détail d'une story depuis la table ou le kanban
- FR24 : L'utilisateur peut lire le contenu Markdown complet d'une story
- FR25 : L'utilisateur peut voir les métadonnées (epic, statut, priorité, estimation, assignee)
- FR26 : L'utilisateur peut voir les PRs associées
- FR27 : L'utilisateur peut voir les issues GitHub liées
- FR28 : L'utilisateur peut soumettre un commentaire sur une story → issue GitHub avec contexte complet
- FR29 : Le système applique automatiquement les labels BMAD aux issues créées
- FR30 : L'utilisateur peut créer une nouvelle story/bug/amélioration via formulaire dédié
- FR31 : Le système génère un template d'issue BMAD avec instructions de traitement
- FR32 : Le système précharge toutes les données du repo à l'ouverture
- FR33 : Le système supporte plusieurs formats BMAD (sprint-based, epic-based, avec/sans frontmatter)
- FR34 : Le système affiche un état vide explicite quand une section ne contient pas de données

### NonFunctional Requirements

- NFR1 : Données complètes d'un repo affichées en < 3 secondes après ouverture
- NFR2 : Navigation entre onglets instantanée — aucun appel API
- NFR3 : Rendu Markdown en < 500ms
- NFR4 : Filtres et recherche en temps réel (< 100ms)
- NFR5 : Création d'issue GitHub en < 5 secondes
- NFR6 : Tokens GitHub chiffrés en base (AES-256-GCM)
- NFR7 : Tokens jamais exposés côté client — opérations GitHub via API routes serveur
- NFR8 : RLS Supabase — un utilisateur ne voit que ses repos
- NFR9 : Sessions validées à chaque requête API serveur
- NFR10 : Communications chiffrées en transit (HTTPS)
- NFR11 : Gestion gracieuse des erreurs API (token expiré, rate limit, repo supprimé) avec messages explicites
- NFR12 : Support repos privés et publics
- NFR13 : Fonctionnement dans les limites de rate GitHub (5000 req/h tokens authentifiés)
- NFR14 : Tolérance aux variations de structure `_bmad-output/` (fichiers manquants, formats inattendus)

### Additional Requirements

**Depuis l'Architecture :**

- SSR désactivé (`ssr: false`) — reka-ui crashes, config Nuxt obligatoire
- Schéma Supabase : tables `repositories` + `cached_files` + policies RLS
- Server utils : `encryption.ts` (AES-256-GCM), `github.ts` (Octokit), `supabase.ts` (service role), `auth.ts` (session validation)
- State management : `useState` + `provide/inject` (pas Pinia)
- Préchargement complet via `useRepoData` (provide au niveau repo)
- Pattern tabs `v-show` (ADR-4) pour préserver l'état des composants
- `@nuxtjs/mdc` pour le rendu Markdown dans les composants Vue
- Composable `useApi` wrapper obligatoire côté client (auth + error handling)
- Retour standardisé `data/loading/error` pour les composables de fetch
- Error handling : `createError()` server-side, `useErrorHandler` + UToast client-side
- TypeScript `strict: true`, `any` interdit, `unknown` pour données externes
- Limites de taille : 150 lignes template, 200 lignes composable, 80 lignes API route
- Hosting Netlify, CI GitHub Actions (lint + typecheck)
- Tests Vitest prévus (non bloquant v1)
- Skeleton components par type de vue pour loading states
- Starter template Nuxt UI (brownfield, déjà en place)

### FR Coverage Map

| FR | Epic | Description |
|----|------|-------------|
| FR1 | Epic 1 | Inscription email/mot de passe |
| FR2 | Epic 1 | Connexion GitHub OAuth |
| FR3 | Epic 1 | Déconnexion |
| FR4 | Epic 1 | Session persistante au refresh |
| FR5 | Epic 1 | Redirection si non authentifié |
| FR6 | Epic 1 | Liste repos sur dashboard |
| FR7 | Epic 1 | Ajout repo (owner/name + token) |
| FR8 | Epic 1 | Validation token + existence repo |
| FR9 | Epic 1 | Suppression repo |
| FR10 | Epic 1 | Stockage tokens chiffrés |
| FR11 | Epic 2 | Navigation arborescence documents |
| FR12 | Epic 2 | Rendu Markdown formaté |
| FR13 | Epic 2 | Ouvrir document sur GitHub |
| FR14 | Epic 3 | Progression globale |
| FR15 | Epic 3 | Epics avec statut et progression |
| FR16 | Epic 3 | PRs liées aux epics |
| FR17 | Epic 3 | Clic PR → GitHub |
| FR18 | Epic 4 | Vue table stories |
| FR19 | Epic 4 | Filtres statut/priorité/epic |
| FR20 | Epic 4 | Recherche texte libre |
| FR21 | Epic 4 | Vue kanban par statut |
| FR22 | Epic 4 | Toggle table/kanban |
| FR23 | Epic 4 | Accès détail depuis table/kanban |
| FR24 | Epic 5 | Contenu Markdown complet |
| FR25 | Epic 5 | Métadonnées story |
| FR26 | Epic 5 | PRs associées |
| FR27 | Epic 5 | Issues GitHub liées |
| FR28 | Epic 6 | Commentaire → issue GitHub |
| FR29 | Epic 6 | Labels BMAD automatiques |
| FR30 | Epic 6 | Formulaire nouvelle story/bug |
| FR31 | Epic 6 | Template issue BMAD |
| FR32 | Epic 1 | Préchargement données repo |
| FR33 | Epic 2 | Support multi-format BMAD |
| FR34 | Epic 2 | États vides explicites |

## Epic List

### Epic 1 : Authentification & accès projet
L'utilisateur peut s'inscrire, se connecter, connecter ses repos GitHub et voir ses données préchargées.
**FRs couverts :** FR1, FR2, FR3, FR4, FR5, FR6, FR7, FR8, FR9, FR10, FR32

### Epic 2 : Navigation documentaire
L'utilisateur peut parcourir l'arborescence des documents BMAD, lire leur contenu Markdown formaté et les ouvrir sur GitHub.
**FRs couverts :** FR11, FR12, FR13, FR33, FR34

### Epic 3 : Suivi de progression (Roadmap)
L'utilisateur peut voir la progression globale du projet, le statut de chaque epic, les PRs liées et naviguer vers GitHub.
**FRs couverts :** FR14, FR15, FR16, FR17

### Epic 4 : Exploration des stories
L'utilisateur peut consulter les stories en table ou kanban, filtrer par statut/priorité/epic, et rechercher par texte.
**FRs couverts :** FR18, FR19, FR20, FR21, FR22, FR23

### Epic 5 : Détail story
L'utilisateur peut lire le contenu complet d'une story, voir ses métadonnées, les PRs associées et les issues liées.
**FRs couverts :** FR24, FR25, FR26, FR27

### Epic 6 : Feedback via issues GitHub
L'utilisateur peut soumettre un commentaire sur une story ou créer une nouvelle story/bug via un formulaire dédié, avec issues GitHub créées automatiquement.
**FRs couverts :** FR28, FR29, FR30, FR31

## Epic 1 : Authentification & accès projet

L'utilisateur peut s'inscrire, se connecter, connecter ses repos GitHub et voir ses données préchargées.

### Story 1.1 : Fondations projet & application shell

As a **visitor**,
I want **to see BMAD Viewer's landing page with a clear call-to-action**,
So that **I understand the product and can proceed to register or log in**.

**Acceptance Criteria:**

**Given** I visit the root URL
**When** the page loads
**Then** I see the BMAD Viewer branding, a description of the product, and links to register/login

**Given** I am on any page
**When** I look at the header
**Then** I see the BMAD Viewer logo and navigation consistent with the app design

**Implementation scope :** Nettoyage starter boilerplate, types TypeScript (`shared/types/bmad.ts`), `BmadLogo.vue`, `app.config.ts` (palette), `main.css`, landing page, app layout.

### Story 1.2 : Inscription, connexion & gestion de session

As a **logged-out visitor**,
I want **to create an account via email or connect via GitHub OAuth, and stay logged in after refresh**,
So that **I can securely access the application without re-authenticating**.

**Acceptance Criteria:**

**Given** I am on the register page
**When** I submit a valid email and password
**Then** my account is created and I am redirected to the dashboard
**And** a confirmation email is sent (Supabase default)

**Given** I am on the login page
**When** I click "Sign in with GitHub"
**Then** I am redirected to GitHub OAuth, and upon authorization, redirected back to the dashboard

**Given** I am logged in
**When** I refresh the page
**Then** my session persists and I remain authenticated (FR4)

**Given** I am logged in
**When** I click "Logout"
**Then** my session is destroyed and I am redirected to the login page (FR3)

**Given** I am not authenticated
**When** I try to access any protected page
**Then** I am redirected to the login page (FR5)

**Implementation scope :** `@nuxtjs/supabase`, migration Supabase (table `repositories` + RLS), pages login/register/auth-callback, `useAuth.ts`, `auth.global.ts`, `server/utils/auth.ts`.

### Story 1.3 : Dashboard & gestion des repos

As a **logged-in user**,
I want **to see my connected repositories on a dashboard and add or remove repos**,
So that **I can manage which BMAD projects I track**.

**Acceptance Criteria:**

**Given** I am on the dashboard
**When** the page loads
**Then** I see a list of my connected repositories with owner/name and last sync date (FR6)
**And** if I have no repos, I see an empty state with a prompt to add one

**Given** I click "Add Repository"
**When** I provide owner, name, and a GitHub token
**Then** the system validates the token and repo existence before adding (FR8)
**And** the token is stored encrypted with AES-256-GCM (FR10, NFR6)
**And** the new repo appears in my list

**Given** I provide an invalid token or non-existent repo
**When** I submit the form
**Then** I see an explicit error message (NFR11)

**Given** I click the delete button on a repo
**When** I confirm the action
**Then** the repo is removed from my list (FR9)

**Implementation scope :** `dashboard.vue`, `RepoCard.vue`, `AddRepoModal.vue`, `useRepository.ts`, `server/api/repos/*`, `server/utils/encryption.ts`, `server/utils/supabase.ts`, table `cached_files` + RLS.

### Story 1.4 : Proxy GitHub & préchargement des données

As a **user**,
I want **all repository data to be loaded when I open a repo, so that tab navigation is instant**,
So that **I can browse documents, roadmap, and stories without waiting for API calls**.

**Acceptance Criteria:**

**Given** I click a repo on the dashboard
**When** the repo page loads
**Then** all data (documents tree, sprint-status, stories, PRs) is fetched in parallel in < 3 seconds (FR32, NFR1)
**And** a loading indicator is shown during preloading

**Given** data is preloaded
**When** I switch between tabs (Documents, Roadmap, Epics)
**Then** the content appears instantly without any API call (NFR2)

**Given** the GitHub API returns an error (token expired, rate limit, 404)
**When** the preloading encounters the error
**Then** an explicit error message is displayed to the user (NFR11)

**Given** the repo is private
**When** the system fetches data
**Then** the GitHub token is used server-side only, never exposed to the client (NFR7)

**Implementation scope :** `server/api/github/*` (tree, contents, pulls), `server/utils/github.ts` (Octokit), `useRepoData.ts` (provide/inject), `useGitHub.ts`, `useBmadParser.ts`, `useStoryStatus.ts`, `repos/[owner]/[repo]/index.vue` (tabs layout avec `v-show`), `RepoNavigation.vue`.

## Epic 2 : Navigation documentaire

L'utilisateur peut parcourir l'arborescence des documents BMAD, lire leur contenu Markdown formaté et les ouvrir sur GitHub.

### Story 2.1 : Arbre documentaire navigable

As a **user viewing a repo**,
I want **to browse the document tree of `_bmad-output/` with expandable folders**,
So that **I can find and select any project document quickly**.

**Acceptance Criteria:**

**Given** I am on the Documents tab of a repo
**When** the tab is displayed
**Then** I see a sidebar with the complete tree structure of `_bmad-output/`
**And** folders are expandable/collapsible
**And** files show appropriate icons

**Given** the `_bmad-output/` directory has missing or unexpected files
**When** the tree is built
**Then** available files are shown gracefully, missing files do not cause errors (NFR14)

**Given** a section has no documents
**When** I view the Documents tab
**Then** I see an explicit empty state message (FR34)

**Implementation scope :** `DocumentTree.vue` (arbre récursif), `DocumentBreadcrumb.vue`, page documents (sidebar + contenu), gestion multi-format dans le parsing de l'arbre (FR33).

### Story 2.2 : Rendu Markdown & lien GitHub

As a **user browsing documents**,
I want **to read a document with formatted Markdown rendering and open it directly on GitHub**,
So that **I can review project documentation in a readable format and access the source**.

**Acceptance Criteria:**

**Given** I click a document in the tree
**When** the document is selected
**Then** its Markdown content is rendered with proper formatting (headings, code blocks, tables, lists) in < 500ms (FR12, NFR3)
**And** the breadcrumb updates to show the current document path

**Given** I am viewing a document
**When** I click "Open in GitHub"
**Then** a new tab opens with the file on the GitHub repository (FR13)

**Given** the document contains YAML frontmatter
**When** the document is rendered
**Then** the frontmatter is parsed and either hidden or displayed as metadata, not raw YAML (FR33)

**Given** I select a document that has no content or fails to load
**When** the viewer attempts to display it
**Then** I see an explicit error or empty state message (FR34)

**Implementation scope :** `DocumentViewer.vue` (`<MDC>` via `@nuxtjs/mdc`), bouton "Open in GitHub", gestion frontmatter, états vides.

## Epic 3 : Suivi de progression (Roadmap)

L'utilisateur peut voir la progression globale du projet, le statut de chaque epic, les PRs liées et naviguer vers GitHub.

### Story 3.1 : Statistiques globales & timeline des sprints

As a **user viewing a repo**,
I want **to see overall project progress and a timeline of sprints with their status and completion rates**,
So that **I know at a glance where my project stands**.

**Acceptance Criteria:**

**Given** I am on the Roadmap tab
**When** the tab is displayed
**Then** I see global statistics: total stories, completed stories, overall % progress, current sprint (FR14)

**Given** the roadmap data is loaded
**When** I scroll the timeline
**Then** I see each sprint/epic as a card with: number, goal, status badge, progress bar, and story breakdown (FR15)

**Given** an epic has no stories
**When** it is displayed in the timeline
**Then** the progress bar shows 0% and the card clearly indicates no stories

**Implementation scope :** `GlobalStats.vue` (cards stats), `SprintTimeline.vue` (timeline verticale), `SprintCard.vue` (card sprint avec `UProgress`, `UBadge`).

### Story 3.2 : PRs liées aux epics

As a **user viewing the roadmap**,
I want **to see pull requests linked to each epic and click them to open on GitHub**,
So that **I can track code progress alongside project planning**.

**Acceptance Criteria:**

**Given** an epic has associated pull requests
**When** I view the epic card on the roadmap
**Then** I see the list of PRs with their title, status (open/merged/closed), and number (FR16)

**Given** I see a PR on an epic card
**When** I click the PR link
**Then** a new tab opens with the PR on GitHub (FR17)

**Given** an epic has no associated PRs
**When** I view the epic card
**Then** no PR section is displayed (clean, no empty placeholder)

**Implementation scope :** Section PRs dans `SprintCard.vue`, liens cliquables vers GitHub, mapping PRs → epics depuis les données préchargées.

## Epic 4 : Exploration des stories

L'utilisateur peut consulter les stories en table ou kanban, filtrer par statut/priorité/epic, et rechercher par texte.

### Story 4.1 : Vue table des stories

As a **user viewing a repo**,
I want **to see all stories in a sortable data table with key information**,
So that **I can quickly scan project work items and their status**.

**Acceptance Criteria:**

**Given** I am on the Epics & Stories tab
**When** the tab is displayed
**Then** I see a data table with columns: ID, Title, Epic, Status, Priority, Estimate (FR18)
**And** each row is clickable to navigate to the story detail (FR23)

**Given** I view the top of the page
**When** the epic data is loaded
**Then** I see progress cards for each epic with their completion percentage
**And** clicking an epic card filters the table to that epic's stories

**Given** there are no stories
**When** the table is displayed
**Then** I see an explicit empty state message

**Implementation scope :** `EpicProgressCards.vue`, `StoriesTable.vue` (`UTable`), `StatusBadge.vue`, `PriorityBadge.vue`, navigation vers `story/[id]`.

### Story 4.2 : Filtres & recherche

As a **user browsing stories**,
I want **to filter stories by status, priority, and epic, and search by text**,
So that **I can find specific stories quickly without scrolling through all items**.

**Acceptance Criteria:**

**Given** I am on the Epics & Stories tab
**When** I select a status filter (e.g. "In Progress")
**Then** the table updates in real-time (< 100ms) to show only matching stories (FR19, NFR4)

**Given** I select multiple filters (status + priority + epic)
**When** the filters are applied
**Then** the table shows stories matching ALL selected criteria

**Given** I type in the search field
**When** the text matches a story title or ID
**Then** the table updates in real-time to show matching stories (FR20, NFR4)

**Given** I have active filters
**When** I clear all filters
**Then** the full story list is restored

**Implementation scope :** `StoryFilters.vue` (`UInput` recherche, `USelectMenu` statut/priorité/epic), intégration avec `StoriesTable`.

### Story 4.3 : Vue kanban & toggle

As a **user browsing stories**,
I want **to switch to a kanban board view grouped by status**,
So that **I can visualize story progress in a spatial layout**.

**Acceptance Criteria:**

**Given** I am on the Epics & Stories tab
**When** I click the "Kanban" tab
**Then** I see stories organized in columns by status: To Do, In Progress, Done (FR21, FR22)
**And** the active filters from the table view are preserved

**Given** I am on the kanban view
**When** I view a story card
**Then** I see the story ID, title, epic badge, and priority badge

**Given** I click a story card on the kanban
**When** the card is clicked
**Then** I navigate to the story detail page (FR23)

**Given** I switch back to the table view
**When** I click the "Table" tab
**Then** the table is displayed with filters and scroll position preserved (ADR-4 `v-show`)

**Implementation scope :** `KanbanBoard.vue`, `KanbanColumn.vue`, `KanbanCard.vue`, `UTabs` toggle dans la page epics. Pas de drag & drop (lecture seule v1).

## Epic 5 : Détail story

L'utilisateur peut lire le contenu complet d'une story, voir ses métadonnées, les PRs associées et les issues liées.

### Story 5.1 : Contenu Markdown & métadonnées

As a **user**,
I want **to view a story's full Markdown content alongside its metadata (epic, status, priority, estimate, assignee)**,
So that **I can understand the complete scope and context of a work item**.

**Acceptance Criteria:**

**Given** I navigate to a story detail page (from table, kanban, or direct URL)
**When** the page loads
**Then** I see the story title with ID badge, status badge, and a breadcrumb back to epics

**Given** the story has Markdown content
**When** the content is rendered
**Then** it displays with full formatting (headings, lists, code blocks, tables) in < 500ms (FR24, NFR3)

**Given** the story has metadata
**When** I look at the sidebar
**Then** I see epic, status, priority, estimation, and assignee in a structured card (FR25)

**Given** the story content is empty or missing
**When** the page loads
**Then** I see an explicit message indicating no content is available

**Implementation scope :** `story/[id].vue` (layout deux colonnes), `StoryHeader.vue`, `StoryContent.vue` (`<MDC>`), `StoryMetadata.vue`.

### Story 5.2 : PRs associées & issues liées

As a **user viewing a story**,
I want **to see pull requests and GitHub issues linked to this story**,
So that **I can track implementation progress and related discussions**.

**Acceptance Criteria:**

**Given** a story has associated pull requests
**When** I view the story detail
**Then** I see a list of PRs with title, number, status (open/merged/closed), and a clickable link to GitHub (FR26)

**Given** a story has linked GitHub issues
**When** I view the story detail
**Then** I see a list of issues with title, number, state, and labels (FR27)

**Given** a story has no PRs or issues
**When** I view the story detail
**Then** the PR/issues sections are hidden (clean layout, no empty placeholders)

**Implementation scope :** `RelatedPRs.vue`, `LinkedIssues.vue`, données depuis le préchargement (PRs) et `GET /api/github/issues` (issues).

## Epic 6 : Feedback via issues GitHub

L'utilisateur peut soumettre un commentaire sur une story ou créer une nouvelle story/bug via un formulaire dédié, avec issues GitHub créées automatiquement.

### Story 6.1 : Commentaire sur story → issue GitHub

As a **user viewing a story**,
I want **to submit a comment that creates a GitHub issue with full story context and automatic BMAD labels**,
So that **I can report corrections or feedback without leaving the app, while keeping the BMAD workflow intact**.

**Acceptance Criteria:**

**Given** I am on a story detail page
**When** I type a comment and click "Submit"
**Then** a GitHub issue is created in < 5 seconds with title `[BMAD Comment] Story {id}: {title}` (FR28, NFR5)
**And** the issue body contains the full story context (epic, status, priority, content excerpt)

**Given** an issue is created from a comment
**When** the issue is submitted
**Then** labels `bmad-comment`, `story: {id}`, `epic: {epicId}` are automatically applied (FR29)

**Given** the issue creation fails (token expired, rate limit)
**When** the error occurs
**Then** I see an explicit error message and my comment text is preserved (NFR11)

**Given** I have submitted a comment
**When** the issue is created successfully
**Then** I see a success toast with a link to the created issue on GitHub

**Implementation scope :** `CommentForm.vue` (`UTextarea` + submit), `POST /api/github/issues`, `useGitHubIssues.ts` (`createComment()`), `app/utils/issueTemplates.ts` (body generation), mise à jour de `LinkedIssues.vue` pour afficher la nouvelle issue.

### Story 6.2 : Nouvelle story/bug via formulaire dédié

As a **user**,
I want **to create a new story, bug report, or improvement request via a dedicated form that generates a GitHub issue with a BMAD template**,
So that **I can propose changes following the BMAD methodology without modifying files directly**.

**Acceptance Criteria:**

**Given** I am in a repo context
**When** I click the "New Story / Report Bug" button
**Then** I see a modal with fields: type (Feature/Bug/Improvement), title, description, epic, priority (FR30)

**Given** I fill and submit the form
**When** the issue is created
**Then** a GitHub issue is created with title `[NEW STORY] {title}` or `[BUG] {title}` (FR31)
**And** the body follows the BMAD template with processing instructions
**And** labels are applied: `bmad-new-story`/`bmad-bug`/`bmad-improvement`, `bmad-pending`, `priority: {p}` (FR29)

**Given** I submit a feature request
**When** the issue is created
**Then** the body includes BMAD processing instructions for the maintainer

**Given** the creation succeeds
**When** the issue is confirmed
**Then** I see a success toast with a link to the created issue

**Implementation scope :** `NewStoryModal.vue` (formulaire type/titre/description/epic/priorité), `useGitHubIssues.ts` (`createNewStory()`), templates dans `issueTemplates.ts`, bouton flottant dans `app.vue` (visible en contexte repo).
