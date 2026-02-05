---
stepsCompleted:
  - step-01-init
  - step-02-discovery
  - step-03-success
  - step-04-journeys
  - step-05-domain
  - step-06-innovation
  - step-07-project-type
  - step-08-scoping
  - step-09-functional
  - step-10-nonfunctional
  - step-11-polish
  - step-12-complete
inputDocuments:
  - docs/cahierdescharges.md
  - CLAUDE.md
documentCounts:
  briefs: 0
  research: 0
  brainstorming: 0
  projectDocs: 2
workflowType: 'prd'
classification:
  projectType: web_app
  domain: general
  complexity: low
  projectContext: brownfield
prdGoal: "Formaliser l'état actuel du produit, stabiliser, corriger les bugs et assurer la cohérence de la v1"
---

# Product Requirements Document — BMAD Viewer

**Author:** Abel
**Date:** 2026-02-04

## Résumé exécutif

**BMAD Viewer** est une application web open-source permettant de visualiser la progression d'un projet utilisant la méthodologie BMAD directement depuis un repository GitHub.

**Problème :** Les utilisateurs BMAD n'ont pas de vue d'ensemble de leur projet au-delà du suivi manuel des fichiers Markdown dans Git. Naviguer entre sprint-status.yaml, les epics et les stories demande d'ouvrir plusieurs fichiers à la main.

**Solution :** BMAD Viewer connecte un repo GitHub, parse les fichiers `_bmad-output/` (YAML + Markdown), et offre une interface visuelle avec roadmap, table/kanban des stories, rendu Markdown, et création d'issues GitHub pour les corrections.

**Différenciateur :** Outil spécialisé pour l'écosystème BMAD. Mode lecture seule qui respecte l'intégrité du workflow BMAD — les corrections passent par des issues GitHub, pas par la modification directe des fichiers.

**Contexte :** Projet brownfield. Le produit est fonctionnel. L'objectif de cette v1 est de formaliser, stabiliser, corriger les bugs et assurer la cohérence UX pour un usage quotidien fiable.

**Utilisateur cible :** Développeur utilisant la méthodologie BMAD pour piloter ses projets (usage personnel v1, adoption communautaire envisagée post-v1).

## Critères de succès

### Succès utilisateur

- L'utilisateur connecte un repo et voit **immédiatement** ses epics, stories et avancement global
- La navigation entre roadmap, epics/stories et documents est fluide, sans rechargement
- L'utilisateur peut relire n'importe quelle story, voir les PRs associées, et soumettre une correction via issue GitHub
- Moment de valeur : vue d'ensemble complète du projet en quelques secondes

### Succès business

- L'outil répond aux besoins personnels de l'auteur pour piloter ses projets BMAD au quotidien sans friction
- Open-source (MIT), documenté pour une adoption future par d'autres utilisateurs BMAD

### Succès technique

- **Chargement instantané** : toutes les données préchargées à l'ouverture du repo, navigation entre onglets sans appel API
- **Zéro données manquantes** : toutes les stories, epics et documents parsés correctement
- **Stabilité de session** : pas de déconnexion au refresh
- **Cohérence UX** : alignements, espacements et composants uniformes sur toutes les vues
- **Pas de crash** : aucune erreur bloquante en navigation normale

### Résultats mesurables

- Données complètes affichées en < 3 secondes après ouverture d'un repo
- 100% des stories de sprint-status.yaml consultables dans l'interface
- PRs correctement liées aux epics
- Création d'issue GitHub en < 5 secondes
- Zéro déconnexion involontaire en session normale

## Parcours utilisateur

### 1. Suivi quotidien du projet

**Situation :** Abel veut savoir où en est son projet avant de commencer sa journée de dev.

**Déroulement :** Il ouvre BMAD Viewer → dashboard → clique son repo. Toutes les données sont déjà là. Il voit d'un coup d'œil : 4 epics, 15 stories, 60% d'avancement. L'onglet Roadmap montre l'Epic 2 avec une PR en review. Il bascule sur Epics & Stories, filtre par "in progress", clique une story, lit le contenu Markdown, vérifie les acceptance criteria.

**Résolution :** En moins d'une minute, Abel sait ce qu'il doit faire aujourd'hui sans ouvrir GitHub.

**Capacités :** Préchargement, progression globale, filtres, navigation par onglets, PRs liées, rendu Markdown.

### 2. Premier ajout de repo

**Situation :** Abel a terminé le planning BMAD d'un nouveau projet et veut le connecter.

**Déroulement :** Login (email ou GitHub OAuth) → dashboard → "Add Repository" → saisie owner/repo + token → validation → le repo apparaît. Il clique dessus : documents, roadmap, stories — tout est là.

**Erreur :** Token invalide ou pas de `_bmad-output/` → message explicite, l'utilisateur corrige.

**Capacités :** Auth Supabase, ajout repo + validation token, détection structure BMAD, gestion d'erreurs.

### 3. Correction d'une story via issue

**Situation :** Abel relit ses stories et repère une incohérence dans les acceptance criteria.

**Déroulement :** Onglet Epics & Stories → clique la story → page détail (Markdown + métadonnées + PR) → "Add Comment" → écrit sa correction → soumet. Une issue GitHub est créée avec le contexte complet (story, epic, statut, label `bmad-comment`).

**Alternative :** "New Story / Report Bug" pour signaler un bug ou proposer une feature avec template BMAD.

**Résolution :** L'issue est visible dans "Linked Issues". Le fichier source n'est pas modifié — le workflow BMAD reste intègre.

**Capacités :** Détail story, création issue contextuelle, templates BMAD, labels auto, issues liées.

### Matrice parcours → capacités

| Capacité | Quotidien | Premier repo | Correction |
|----------|:-:|:-:|:-:|
| Préchargement données | x | x | |
| Progression globale | x | | |
| Filtres et recherche | x | | x |
| Rendu Markdown | x | | x |
| PRs liées | x | | x |
| Auth Supabase | | x | |
| Ajout/validation repo | | x | |
| Gestion d'erreurs | | x | |
| Création issue GitHub | | | x |
| Templates BMAD | | | x |

## Architecture & exigences techniques

### Vue d'ensemble

SPA Nuxt 4 en mode client (`ssr: false`). Stack : Nuxt UI v4, Tailwind CSS 4, TypeScript, Supabase (PostgreSQL + Auth), Octokit.js, js-yaml, @nuxtjs/mdc.

### Décisions d'architecture (ADR)

**ADR-1 : SSR désactivé** — `ssr: false` global. Reka-ui (couche headless de Nuxt UI v4) crash en SSR : `UHeader` en mode drawer via `vaul-vue` tente des opérations DOM côté serveur, `Label`/`ConfigProvider` crashent également. Les deux autres bugs SSR connus (hydration ID mismatch, build crash tree-shake) sont corrigés dans Vue 3.5.27 / Nuxt 4.3.0. App derrière auth, SEO non requis. Réversible si corrigé upstream.

**ADR-2 : Préchargement complet** — Toutes les données (documents, sprint-status, stories, PRs) chargées en parallèle à l'ouverture du repo via `useRepoData` + `provide/inject`. Volume faible, navigation instantanée entre onglets. Trade-off : ouverture initiale ~2-3s, données potentiellement stales.

**ADR-3 : Lecture seule + issues GitHub** — Pas de modification directe des fichiers BMAD. Commentaires et corrections créent des issues GitHub avec contexte complet. Respecte l'intégrité du workflow BMAD. Édition via commit API envisageable post-v1.

**ADR-4 : Page unique à onglets (`v-show`)** — Roadmap, Epics et Documents sur une seule page avec `v-show` pour préserver l'état des composants (filtres, scroll). Pas de re-render entre onglets. Trade-off : pas de deep-link par onglet.

### Compatibilité

- Navigateurs modernes (Chrome, Firefox, Safari, Edge, dernières versions)
- JavaScript obligatoire (SPA)
- Responsive : desktop (1280px+), tablette (768px+), mobile (360px+)

### SEO & accessibilité

- SEO non requis (app derrière auth). Landing page : meta tags basiques.
- Accessibilité basique via Nuxt UI / Reka UI (ARIA intégré). Pas d'audit WCAG formel v1.

## Scoping & développement par phases

### Stratégie

MVP de stabilisation (brownfield). Le produit est fonctionnel, l'objectif est la fiabilité et la cohérence pour un usage quotidien. Développeur solo + assistants IA.

### Phase 1 — v1 stable (MVP)

**Parcours supportés :** Suivi quotidien, premier repo, correction via issue.

**Existant à stabiliser :**
- Auth Supabase (email + GitHub OAuth) — session persistante
- Dashboard multi-repo — ajout, suppression, validation token
- Vue documents — arbre navigable + rendu Markdown
- Vue roadmap — timeline des epics, barres de progression, PRs liées
- Vue epics & stories — table + kanban, filtres statut/priorité/epic, recherche
- Détail story — contenu Markdown, métadonnées, PR associée
- Préchargement complet des données à l'ouverture du repo
- Page unique à onglets (`v-show`)

**À implémenter :**
- Commentaires sur story → issue GitHub `[BMAD Comment]` avec labels automatiques
- Bouton "New Story / Report Bug" → issue GitHub avec template BMAD (Feature, Bug, Improvement)
- Affichage des issues liées à une story

**Corrections :**
- Temps de chargement (préchargement parallèle, pas d'appel redondant)
- Données qui ne chargent pas dans certains cas
- Cohérence UX (alignements, espacements, uniformité)
- Responsive (360px et 1280px)
- Dark mode cohérent

### Phase 2 — Croissance

- Instance hébergée (bmad-viewer.app) avec free tier
- Webhooks GitHub pour sync automatique au push
- Édition légère des stories via commit API GitHub
- Recherche full-text dans les documents

### Phase 3 — Expansion

- Analytics (vélocité, burndown charts)
- Notifications (email/push sur changement de statut)
- Export PDF
- Collaboration multi-utilisateur
- Intégration native workflows BMAD (traitement auto des issues `bmad-pending`)

### Risques & mitigations

| Risque | Mitigation |
|--------|------------|
| Rate limiting API GitHub | Cache Supabase (`cached_files`), regroupement des appels |
| Crashes reka-ui SSR | SSR désactivé ; surveiller les mises à jour upstream |
| Formats BMAD variés | Parseurs adaptés aux 2 formats connus, gestion d'erreur gracieuse |
| Développeur solo | Code simple, bien typé, architecture Nuxt standard, open-source |
| Audience niche | Usage personnel validé d'abord, expansion communautaire en phase 2 |

## Exigences fonctionnelles

### Authentification & session

- FR1 : L'utilisateur peut créer un compte via email/mot de passe
- FR2 : L'utilisateur peut se connecter via GitHub OAuth
- FR3 : L'utilisateur peut se déconnecter
- FR4 : L'utilisateur reste authentifié après un refresh de page
- FR5 : L'utilisateur non authentifié est redirigé vers la page de connexion

### Gestion des repos

- FR6 : L'utilisateur peut voir la liste de ses repos connectés sur le dashboard
- FR7 : L'utilisateur peut ajouter un repo GitHub en fournissant owner/name et un token
- FR8 : Le système valide le token GitHub et l'existence du repo avant ajout
- FR9 : L'utilisateur peut supprimer un repo connecté
- FR10 : Le système stocke les tokens GitHub de manière chiffrée

### Consultation des documents

- FR11 : L'utilisateur peut naviguer dans l'arborescence des documents `_bmad-output/`
- FR12 : L'utilisateur peut lire le contenu Markdown d'un document avec rendu formaté
- FR13 : L'utilisateur peut ouvrir un document directement sur GitHub

### Suivi de progression

- FR14 : L'utilisateur peut voir la progression globale du projet (stories, % avancement)
- FR15 : L'utilisateur peut voir les epics avec statut et progression individuelle
- FR16 : L'utilisateur peut voir les PRs liées à chaque epic
- FR17 : L'utilisateur peut cliquer sur une PR pour l'ouvrir sur GitHub

### Gestion des epics & stories

- FR18 : L'utilisateur peut voir les stories en vue table (ID, titre, epic, statut, priorité, estimation)
- FR19 : L'utilisateur peut filtrer les stories par statut, priorité et epic
- FR20 : L'utilisateur peut rechercher une story par texte libre
- FR21 : L'utilisateur peut voir les stories en vue kanban par statut
- FR22 : L'utilisateur peut basculer entre table et kanban
- FR23 : L'utilisateur peut accéder au détail d'une story depuis la table ou le kanban

### Détail story

- FR24 : L'utilisateur peut lire le contenu Markdown complet d'une story
- FR25 : L'utilisateur peut voir les métadonnées (epic, statut, priorité, estimation, assignee)
- FR26 : L'utilisateur peut voir les PRs associées
- FR27 : L'utilisateur peut voir les issues GitHub liées

### Commentaires & issues GitHub

- FR28 : L'utilisateur peut soumettre un commentaire sur une story → issue GitHub avec contexte complet
- FR29 : Le système applique automatiquement les labels BMAD aux issues créées
- FR30 : L'utilisateur peut créer une nouvelle story/bug/amélioration via formulaire dédié
- FR31 : Le système génère un template d'issue BMAD avec instructions de traitement

### Données & résilience

- FR32 : Le système précharge toutes les données du repo à l'ouverture
- FR33 : Le système supporte plusieurs formats BMAD (sprint-based, epic-based, avec/sans frontmatter)
- FR34 : Le système affiche un état vide explicite quand une section ne contient pas de données

## Exigences non-fonctionnelles

### Performance

- NFR1 : Données complètes d'un repo affichées en < 3 secondes après ouverture
- NFR2 : Navigation entre onglets instantanée — aucun appel API
- NFR3 : Rendu Markdown en < 500ms
- NFR4 : Filtres et recherche en temps réel (< 100ms)
- NFR5 : Création d'issue GitHub en < 5 secondes

### Sécurité

- NFR6 : Tokens GitHub chiffrés en base (AES-256-GCM)
- NFR7 : Tokens jamais exposés côté client — opérations GitHub via API routes serveur
- NFR8 : RLS Supabase — un utilisateur ne voit que ses repos
- NFR9 : Sessions validées à chaque requête API serveur
- NFR10 : Communications chiffrées en transit (HTTPS)

### Intégration GitHub

- NFR11 : Gestion gracieuse des erreurs API (token expiré, rate limit, repo supprimé) avec messages explicites
- NFR12 : Support repos privés et publics
- NFR13 : Fonctionnement dans les limites de rate GitHub (5000 req/h tokens authentifiés)
- NFR14 : Tolérance aux variations de structure `_bmad-output/` (fichiers manquants, formats inattendus)
