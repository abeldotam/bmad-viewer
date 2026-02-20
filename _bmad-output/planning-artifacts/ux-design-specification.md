---
stepsCompleted:
  - step-01-init
  - step-brownfield-audit
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/prd-validation-report.md
  - _bmad-output/planning-artifacts/architecture.md
  - docs/cahierdescharges.md
workflowType: 'ux-design'
project_name: 'bmad-viewer'
status: 'complete'
completedAt: '2026-02-20'
context: 'brownfield — document basé sur l analyse du code existant'
---

# UX Design Specification — BMAD Viewer

**Author:** Abel
**Date:** 2026-02-20
**Contexte:** Projet brownfield. Ce document formalise les patterns UX existants dans le code plutôt qu'un design from-scratch.

---

## 1. Vision & expérience cible

### 1.1 Philosophie UX

BMAD Viewer est un outil de **visualisation read-only** pour les projets utilisant la méthodologie BMAD. L'expérience cible est celle d'un **tableau de bord de projet** : l'utilisateur se connecte, sélectionne un repo, et obtient une vue d'ensemble complète en quelques secondes.

**Principes directeurs :**

- **Clarté avant tout** — Chaque vue répond à une question précise (où en est mon projet ? quelles stories restent ? quel document dit quoi ?)
- **Navigation instantanée** — Préchargement complet au lancement, zéro appel API entre les onglets
- **Lecture seule respectueuse** — Les corrections passent par des issues GitHub, pas par la modification des fichiers BMAD
- **Dual-mode transparent** — L'interface s'adapte silencieusement au mode (Personal/Multi-user) sans surcharge visuelle

### 1.2 Utilisateur cible

**Persona principal :** Développeur utilisant la méthodologie BMAD pour piloter ses projets.

- Familier avec GitHub, Markdown, YAML
- Utilise BMAD Viewer quotidiennement pour le suivi de projet
- Préfère un outil simple et rapide à un outil riche mais complexe
- Navigue principalement sur desktop (1280px+), occasionnellement tablette/mobile

### 1.3 Moments de valeur

1. **Vue d'ensemble immédiate** — En < 3 secondes après l'ouverture d'un repo, l'utilisateur voit tous ses epics, stories et l'avancement global
2. **Navigation fluide** — Basculer entre roadmap, stories et documents sans aucun temps de chargement
3. **Feedback sans friction** — Soumettre un commentaire ou signaler un bug crée une issue GitHub avec tout le contexte nécessaire

---

## 2. Design system

### 2.1 Palette de couleurs

**Couleurs de marque :**

| Rôle | Couleur | Usage |
|------|---------|-------|
| Primary | **Indigo** | Liens, boutons, accents, états actifs |
| Neutral | **Slate** | Bordures, arrière-plans, texte secondaire |

**Couleurs sémantiques (via Nuxt UI) :**

| Rôle | Couleur | Usage |
|------|---------|-------|
| Success | Vert | Statut done, actions positives, toasts de succès |
| Warning | Ambre | En cours, alertes non bloquantes |
| Error | Rouge | Erreurs, suppression, statut bloqué |
| Info | Bleu | Information, statuts actifs/draft |
| Muted | Gris | Texte secondaire, états désactivés |

### 2.2 Typographie

- **Police principale :** Public Sans (sans-serif)
- **Source :** Google Fonts, importée via `@theme static` dans Tailwind CSS 4
- **Hiérarchie :** Tailles Tailwind standard (text-sm, text-base, text-lg, text-xl, text-2xl)

### 2.3 Iconographie

**Bibliothèque :** Iconify via Nuxt UI

- **lucide** — Icônes d'interface (40+ icônes utilisées) : navigation, actions, statuts, fichiers, Git
- **simple-icons** — Icônes de marque : `i-simple-icons-github`

**Conventions :**
- Taille standard : `size-4` (16px) pour inline, `size-5` (20px) pour boutons, `size-6` (24px) pour emphasis
- Icônes de statut : toujours accompagnées d'un label texte (accessibilité)
- Boutons icon-only : `aria-label` obligatoire

### 2.4 Espacement & layout

**Échelle Tailwind utilisée :**
- Gaps : `gap-2` (8px), `gap-3` (12px), `gap-4` (16px), `gap-6` (24px)
- Padding : `p-4` (16px) pour les cards, `p-6` (24px) pour les sections
- Border radius : `rounded` (standard), `rounded-lg` (cards), `rounded-full` (avatars, badges)

**Grilles responsives :**
- Dashboard : `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Stats : `grid-cols-2 md:grid-cols-4`
- Story detail : `grid-cols-1 lg:grid-cols-3` (2/3 contenu + 1/3 sidebar)
- Documents : `grid-cols-1 md:grid-cols-4` (1 sidebar + 3 contenu)

---

## 3. Composants Nuxt UI utilisés

### 3.1 Inventaire

| Composant | Occurrences | Usage principal |
|-----------|------------|-----------------|
| `UButton` | 50+ | Actions, navigation, submit |
| `UCard` | 30+ | Conteneurs de contenu (sidebar, stats, détails) |
| `UIcon` | 50+ | Icônes inline et décoratives |
| `UBadge` | 20+ | Statuts, priorités, états PR |
| `UTable` | 1 | Vue table des stories |
| `UInput` | 10+ | Champs texte (recherche, formulaires) |
| `UTextarea` | 2 | Commentaires, description story |
| `USelectMenu` | 5+ | Filtres (statut, priorité, repos) |
| `UModal` | 2 | Ajout repo, nouvelle story |
| `USlideover` | 1 | Sidebar documents (mobile) |
| `UAlert` | 5+ | Alertes info/warning/error |
| `UProgress` | 10+ | Barres de progression (sprint, epic) |
| `UBreadcrumb` | 2 | Navigation contextuelle (story, documents) |
| `UDropdownMenu` | 1 | Menu utilisateur (header) |
| `UAvatar` | 2 | Avatar utilisateur |
| `UColorModeButton` | 2 | Toggle dark/light mode |
| `USkeleton` | 15+ | Placeholders de chargement |
| `UPageHero` | 1 | Hero landing page |
| `UPageSection` | 2 | Sections landing page |

### 3.2 Composants custom par domaine

**Brand & navigation :**
- `BmadLogo.vue` — Texte "BMAD" (primary) + " Viewer" (muted)
- `RepoNavigation.vue` — Menu desktop / select mobile

**Dashboard :**
- `RepoCard.vue` — Card repo avec titre, branche, suppression
- `AddRepoModal.vue` — Modal d'ajout avec select searchable

**Documents :**
- `DocumentTree.vue` — Arbre de fichiers récursif et cliquable
- `DocumentViewer.vue` — Rendu Markdown via `<MDC>`
- `DocumentBreadcrumb.vue` — Fil d'Ariane

**Roadmap :**
- `GlobalStats.vue` — Grille de stats (4 colonnes + breakdown)
- `SprintTimeline.vue` — Timeline verticale avec ligne et cercles
- `SprintCard.vue` — Card sprint/epic avec progression et PRs

**Epics & stories :**
- `EpicProgressCards.vue` — Cards filtrantes par epic (sélection avec ring)
- `StoryFilters.vue` — Recherche + filtres dropdown
- `StoriesTable.vue` — `UTable` avec renderers custom (badges)
- `StatusBadge.vue` — Badge coloré par statut
- `PriorityBadge.vue` — Badge icône + label par priorité

**Kanban :**
- `KanbanBoard.vue` — Board 5 colonnes
- `KanbanColumn.vue` — Colonne scrollable avec titre et count
- `KanbanCard.vue` — Card story avec ID, titre, epic, priorité

**Détail story :**
- `StoryHeader.vue` — Breadcrumb + ID badge + titre + actions
- `StoryContent.vue` — Rendu Markdown en card
- `StoryMetadata.vue` — Sidebar avec détails structurés
- `CommentForm.vue` — Éditeur Markdown write/preview + submit
- `RelatedPRs.vue` — Liste PRs avec états (stub — à implémenter)
- `LinkedIssues.vue` — Liste issues avec états et liens

**Skeletons :**
- `TableSkeleton.vue` — Header + 5 lignes
- `CardSkeleton.vue` — Grille 3 colonnes de cards
- `DocumentSkeleton.vue` — Sidebar + main content
- `TimelineSkeleton.vue` — Stats + timeline
- `StoryDetailSkeleton.vue` — Header + grille 2 colonnes

---

## 4. Layout & structure des pages

### 4.1 Layout global (`app.vue`)

```
┌─────────────────────────────────────────────────┐
│ Header (sticky, z-50, backdrop-blur)            │
│ [Logo]                    [Mode] [GitHub] [Auth] │
├─────────────────────────────────────────────────┤
│                                                 │
│  Main Content (flex-1)                          │
│  ┌───────────────────────────────────────────┐  │
│  │        <NuxtPage />                       │  │
│  │                                           │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  [Floating: NewStoryModal] (repos/* seulement)  │
│                                                 │
├─────────────────────────────────────────────────┤
│ Footer (border-top, copyright, color mode)      │
└─────────────────────────────────────────────────┘
```

**Header :** hauteur 56px, logo à gauche, contrôles à droite (color mode, lien GitHub, menu auth avec avatar).

**Bouton flottant :** "New Story / Report Bug" en bas à droite, visible uniquement dans le contexte `/repos/*`.

### 4.2 Landing page (`/`)

```
┌─────────────────────────────────────────────────┐
│                                                 │
│               BMAD Viewer                       │
│         [description du produit]                │
│                                                 │
│   [Go to Dashboard]    [View on GitHub]         │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────┐  ┌──────┐  ┌──────┐                  │
│  │ Doc  │  │Sprint│  │Epics │                  │
│  │Browse│  │Road  │  │Story │                  │
│  └──────┘  └──────┘  └──────┘                  │
│  ┌──────┐  ┌──────┐  ┌──────┐                  │
│  │Issue │  │GitHub│  │Multi │                  │
│  │Comm. │  │Integ │  │Repo  │                  │
│  └──────┘  └──────┘  └──────┘                  │
│                                                 │
└─────────────────────────────────────────────────┘
```

Pattern hero + grille de features (1→2→3 colonnes responsive). Layout propre, pas de header/footer standard.

### 4.3 Login (`/login`)

```
┌─────────────────────────────────────────────────┐
│                                                 │
│              [Logo BMAD Viewer]                  │
│          Sign in to your account                │
│                                                 │
│       [⚠️ Error OAuth si présent]               │
│                                                 │
│    [🔗 Sign in with GitHub] (pleine largeur)    │
│                                                 │
│       Texte disclaimer OAuth                    │
│                                                 │
└─────────────────────────────────────────────────┘
```

Design minimal centré. Aucune distraction.

### 4.4 Setup (`/setup`)

```
┌─────────────────────────────────────────────────┐
│  ⚙️ Configuration Required                     │
│  ⚠️ Banner orange "No env vars detected"       │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │ 👤 Personal Mode    [Fastest ✓]        │    │
│  │ Description + code block env vars       │    │
│  │ Lien → GitHub token settings            │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │ 👥 Multi-user Mode  [OAuth ℹ️]         │    │
│  │ Description + code block 3 env vars     │    │
│  │ Lien → GitHub OAuth app settings        │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  Instructions de redémarrage                    │
└─────────────────────────────────────────────────┘
```

Deux modes clairement séparés avec badges colorés et code blocks pour copier/coller.

### 4.5 Dashboard (`/dashboard`)

```
┌─────────────────────────────────────────────────┐
│ Dashboard          [+ Add Repository]           │
│ Your connected BMAD repositories                │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │ owner/   │  │ owner/   │  │ owner/   │      │
│  │ repo-1   │  │ repo-2   │  │ repo-3   │      │
│  │ [main ▾] │  │ [dev ▾]  │  │ [main ▾] │      │
│  │      [🗑]│  │      [🗑]│  │      [🗑]│      │
│  └──────────┘  └──────────┘  └──────────┘      │
│                                                 │
└─────────────────────────────────────────────────┘
```

**État vide :** icône folder-open + message + bouton "Add Repository".
**Grille :** 1→2→3 colonnes responsive. Cards cliquables vers le repo.

### 4.6 Repo dashboard (`/repos/[owner]/[repo]`)

```
┌─────────────────────────────────────────────────┐
│ [Roadmap] [Epics & Stories] [Documents]   [🔄]  │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌── Roadmap (v-show) ──────────────────────┐   │
│  │ Stats:  Total │ Done │ Progress │ Active │   │
│  │ ──────────────────────────────────────── │   │
│  │ Timeline verticale                       │   │
│  │   ● Epic 1 [done] ████████████ 100%     │   │
│  │   ● Epic 2 [done] ████████████ 100%     │   │
│  │   ...                                    │   │
│  └──────────────────────────────────────────┘   │
│                                                 │
│  ┌── Epics & Stories (v-show, hidden) ──────┐   │
│  │ Epic cards: [E1] [E2] [E3] [E4] ...     │   │
│  │ Filters: [🔍 Search] [Status ▾] [Prio ▾]│   │
│  │ [Table] [Kanban]                         │   │
│  │ ┌──────────────────────────────────────┐ │   │
│  │ │ ID │ Title │ Epic │ Status │ Priority│ │   │
│  │ │────│───────│──────│────────│─────────│ │   │
│  │ │ ...│  ...  │ ...  │  ...   │   ...   │ │   │
│  │ └──────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────┘   │
│                                                 │
│  ┌── Documents (v-show, hidden) ────────────┐   │
│  │ ┌────────┐ ┌───────────────────────────┐ │   │
│  │ │ Tree   │ │ Breadcrumb               │ │   │
│  │ │ 📁 docs│ │ ┌─────────────────────┐  │ │   │
│  │ │  📄 prd│ │ │ Rendered Markdown   │  │ │   │
│  │ │  📄 arc│ │ │                     │  │ │   │
│  │ │ 📁 impl│ │ │                     │  │ │   │
│  │ └────────┘ │ └─────────────────────┘  │ │   │
│  │            │        [Open in GitHub]   │ │   │
│  │            └───────────────────────────┘ │   │
│  └──────────────────────────────────────────┘   │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Pattern v-show (ADR-4) :** Les 3 onglets sont rendus simultanément, seul l'onglet actif est visible. Cela préserve l'état des filtres, le scroll, et les données entre les basculements.

**Documents (mobile) :** La sidebar est remplacée par un bouton "Browse documents" qui ouvre un `USlideover`.

### 4.7 Détail story (`/repos/[owner]/[repo]/story/[id]`)

```
┌─────────────────────────────────────────────────┐
│ ← Epics & Stories                               │
│ [1-1] Story Title Here                          │
│ [Copy link] [Open in GitHub]    [done ✓]        │
├───────────────────────────┬─────────────────────┤
│                           │                     │
│  Story Content            │  Metadata           │
│  ┌─────────────────────┐  │  ┌───────────────┐  │
│  │ Rendered Markdown   │  │  │ Status: done  │  │
│  │ (acceptance criteria│  │  │ Priority: mid │  │
│  │  tasks, dev notes)  │  │  │ Epic: 1       │  │
│  └─────────────────────┘  │  │ Estimate: 5   │  │
│                           │  └───────────────┘  │
│  Leave a Comment          │                     │
│  ┌─────────────────────┐  │  Related PRs        │
│  │ [Write] [Preview]   │  │  ┌───────────────┐  │
│  │ ┌─────────────────┐ │  │  │ #12 merged    │  │
│  │ │ Markdown editor │ │  │  └───────────────┘  │
│  │ └─────────────────┘ │  │                     │
│  │        [Submit]     │  │  Linked Issues       │
│  └─────────────────────┘  │  ┌───────────────┐  │
│                           │  │ #45 open      │  │
│                           │  └───────────────┘  │
└───────────────────────────┴─────────────────────┘
```

**Layout 2 colonnes :** 2/3 contenu + 1/3 sidebar (responsive : stacked sur mobile).

---

## 5. Système de statuts & couleurs

### 5.1 Statuts des stories

| Statut | Couleur | Badge | Contexte |
|--------|---------|-------|----------|
| `todo` | Gris/Muted | Subtle | Non démarré |
| `in_progress` | Bleu/Info | Subtle | En cours |
| `ready_for_review` | Ambre/Warning | Subtle | En attente de review |
| `done` | Vert/Success | Subtle | Terminé |
| `blocked` | Rouge/Error | Subtle | Bloqué |

### 5.2 Priorités

| Priorité | Couleur | Icône |
|----------|---------|-------|
| `high` | Rouge/Error | arrow-up |
| `medium` | Ambre/Warning | minus |
| `low` | Gris/Neutral | arrow-down |

### 5.3 Statuts des epics/sprints

| Statut | Couleur | Cercle timeline |
|--------|---------|----------------|
| `completed` | Vert/Success | bg-success |
| `active` | Bleu/Info | bg-info |
| `planned` | Gris/Muted | bg-muted |

### 5.4 États des PRs

| État | Couleur | Icône |
|------|---------|-------|
| `open` | Vert/Success | git-pull-request |
| `draft` | Gris/Neutral | git-pull-request-draft |
| `merged` | Indigo/Primary | git-merge |
| `closed` | Rouge/Error | git-pull-request-closed |

---

## 6. Parcours utilisateur

### 6.1 Premier lancement (onboarding)

```
Landing page (/) → Clic "Go to Dashboard"
  ├── Mode Personal → Dashboard directement
  ├── Mode Multi-user → Login → OAuth GitHub → Dashboard
  └── Mode Unconfigured → /setup → Configuration env vars → Redémarrage
```

### 6.2 Ajout d'un repo

```
Dashboard → [+ Add Repository]
  → Modal avec select searchable (repos GitHub)
  → Sélection → Clic "Add"
  → Toast succès + card apparaît
  → Stockage dans localStorage
```

### 6.3 Suivi quotidien

```
Dashboard → Clic repo card
  → Roadmap (défaut) : stats + timeline
  → Onglet "Epics & Stories" : cards epic + table/kanban
  → Filtres : statut, priorité, epic, recherche texte
  → Clic story → Détail (Markdown + métadonnées + PRs + issues)
```

### 6.4 Feedback via issue

```
Détail story → Section "Leave a Comment"
  → Écriture Markdown (toggle preview)
  → Submit → Issue GitHub créée (< 5s)
  → Toast succès avec lien vers l'issue
  → Labels auto : bmad-comment, story:{id}, epic:{id}
```

### 6.5 Exploration documentaire

```
Repo → Onglet "Documents"
  → Sidebar arbre (desktop) / Bouton + drawer (mobile)
  → Clic fichier → Rendu Markdown + breadcrumb
  → Deep-link : ?path=/chemin/vers/fichier.md
  → [Open in GitHub] → Nouvel onglet
```

---

## 7. Responsive design

### 7.1 Breakpoints

| Breakpoint | Largeur | Cible |
|------------|---------|-------|
| Default (mobile) | < 640px | Smartphone |
| `md` | >= 768px | Tablette |
| `lg` | >= 1024px | Desktop |

### 7.2 Adaptations par page

| Page | Mobile | Tablette | Desktop |
|------|--------|----------|---------|
| Dashboard | 1 colonne | 2 colonnes | 3 colonnes |
| Roadmap stats | 2 colonnes | 4 colonnes | 4 colonnes |
| Documents | Drawer sidebar | Sidebar fixe | Sidebar fixe |
| Story detail | 1 colonne stacked | 1 colonne | 2 colonnes (2/3 + 1/3) |
| Kanban | Scroll horizontal | 5 colonnes | 5 colonnes |
| Filtres | Colonne | Ligne | Ligne |
| Repo nav | Select dropdown | Menu horizontal | Menu horizontal |

### 7.3 Touch-friendly

- Boutons : hauteur minimum 44px
- Espacement entre éléments cliquables : `gap-2` minimum (8px)
- Modals : plein écran sur mobile, contenus sur desktop
- Drawers : `USlideover` pour la navigation mobile (geste swipe natif)

---

## 8. États d'interface

### 8.1 Chargement (skeletons)

Chaque type de vue a un composant skeleton dédié qui reproduit la structure du contenu final :

- `TableSkeleton` — Header + 5 lignes animées
- `CardSkeleton` — Grille configurable de cards animées
- `DocumentSkeleton` — Sidebar + zone contenu
- `TimelineSkeleton` — Stats + cards timeline
- `StoryDetailSkeleton` — Header + grille 2 colonnes

**Pattern :** `v-if="loading"` affiche le skeleton, `v-else` affiche le contenu. Pas de layout shift (CLS minimisé).

### 8.2 États vides

Chaque vue gère un état vide explicite avec :
- Icône contextuelle (folder-open, file-text, kanban-square...)
- Titre descriptif
- Texte d'aide avec action si applicable
- Exemple : "No stories found in sprint-status.yaml"

### 8.3 États d'erreur

**Toasts (notifications éphémères) :**
- Erreur : titre "Error", couleur rouge, icône alert-circle
- Succès : titre "Success", couleur verte, icône check-circle

**Alertes inline :**
- Token invalide : banner warning en haut de page (dismissible)
- OAuth échoué : alert rouge sur la page login

**Page d'erreur globale :**
- 404 : "Page not found" + icône fichier
- 401 : "Unauthorized" + icône cadenas
- 500 : "Something went wrong" + icône alerte
- Boutons : "Go Home" + "Go Back"

---

## 9. Patterns d'interaction

### 9.1 Navigation par onglets (v-show)

Les onglets du repo dashboard utilisent `v-show` (pas `v-if`) pour préserver :
- La position de scroll dans chaque onglet
- L'état des filtres et de la recherche
- Les données chargées en mémoire
- Les formulaires en cours de saisie

### 9.2 Filtrage et recherche

- **Recherche texte** — Input avec icône search, filtrage case-insensitive sur le titre
- **Filtres dropdown** — `USelectMenu` multi-select pour statut et priorité
- **Filtres par epic** — Cards cliquables avec état sélectionné (ring indigo)
- **Logique** — Tous les filtres sont combinés en AND
- **Performance** — `computed()` réactif, < 100ms

### 9.3 Copier dans le presse-papier

- Bouton "Copy link" sur le détail story
- Feedback visuel : icône change (link → check) + label "Copied!" pendant 2s
- Utilise `navigator.clipboard.writeText()`

### 9.4 Modals et drawers

- **AddRepoModal** — Modal avec select searchable et submit
- **NewStoryModal** — Modal avec formulaire 5 champs + éditeur Markdown
- **Document sidebar mobile** — `USlideover` (slide depuis la gauche)
- Focus trap actif dans les modals

### 9.5 Deep linking

- Documents : paramètre query `?path=/chemin/vers/fichier.md`
- Préservé au rechargement du navigateur
- Permet de partager un lien direct vers un document

---

## 10. Accessibilité

### 10.1 Patterns sémantiques

- **Breadcrumbs** : `<UBreadcrumb>` avec structure liste sémantique
- **Tables** : `<UTable>` avec sémantique native
- **Liens** : `<NuxtLink>` avec attributs `to` corrects
- **Boutons icon-only** : `aria-label` systématique (delete, refresh, etc.)
- **Formulaires** : `<UFormField>` avec labels associés
- **Alertes** : `<UAlert>` avec rôle sémantique et couleur

### 10.2 Contraste

- Primary indigo sur fond blanc : WCAG AAA
- Texte muted sur fond par défaut : accessible
- Couleurs sémantiques : haut contraste

### 10.3 Navigation clavier

- Tous les boutons et liens accessibles au clavier
- Ordre de tabulation naturel (flow du DOM)
- Focus trap dans les modals
- Liens avec affordance visuelle au hover (underline)

### 10.4 Dark mode

- Toggle via `UColorModeButton` (header + footer)
- Toutes les couleurs adaptées automatiquement via Nuxt UI / Tailwind
- Pas de couleur hard-codée

---

## 11. Décisions UX clés (ADR)

### ADR-UX1 : SSR désactivé

`ssr: false` — L'application est entièrement client-side. reka-ui (couche headless de Nuxt UI v4) crash en SSR. App derrière auth, SEO non requis. Pas d'impact UX visible pour l'utilisateur.

### ADR-UX2 : Préchargement complet (ADR-2)

Toutes les données (documents, sprint-status, stories, PRs) chargées en parallèle à l'ouverture du repo. Trade-off : ouverture initiale ~2-3s avec skeleton, mais navigation entre onglets instantanée (0 API call).

### ADR-UX3 : Tabs v-show (ADR-4)

Page unique à onglets avec `v-show`. Préserve l'état des composants (filtres, scroll, données). Trade-off : tous les onglets sont rendus en mémoire simultanément, consommation mémoire légèrement supérieure.

### ADR-UX4 : Lecture seule + issues GitHub (ADR-3)

Pas de modification directe des fichiers BMAD. Les commentaires et corrections créent des issues GitHub avec contexte complet. Respecte l'intégrité du workflow BMAD.

### ADR-UX5 : Repos en localStorage

Pas de base de données côté serveur pour les repos. Stockage dans `localStorage` (clé `bmad-repos`). Simple, rapide, mais non partagé entre appareils.

---

## 12. Gaps connus & améliorations futures

| # | Gap | Impact | Priorité |
|---|-----|--------|----------|
| 1 | `RelatedPRs.vue` est un stub (texte statique) | PRs non mappées aux stories individuelles | Moyenne |
| 2 | `SprintCard.vue` sans texte "no stories" quand epic a 0 stories | Barre 0% sans explication | Faible |
| 3 | Pas de preview Markdown dans `CommentForm` et `NewStoryModal` | L'utilisateur ne peut pas vérifier le rendu avant soumission | Faible |
| 4 | Pas de debounce sur la soumission des formulaires d'issues | Risque théorique de doublons (le loading state atténue) | Moyenne |
| 5 | Labels BMAD créés à la volée sans couleurs custom | Labels fonctionnels mais visuellement neutres sur GitHub | Faible |
| 6 | Pas de tests automatisés | Risque de régression si contributions externes | Haute |
