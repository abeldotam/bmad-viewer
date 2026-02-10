# Story 1.1: Fondations projet & application shell

Status: done

## Story

As a **visitor**,
I want **to see BMAD Viewer's landing page with a clear call-to-action**,
So that **I understand the product and can proceed to register or log in**.

## Acceptance Criteria

1. **Given** I visit the root URL **When** the page loads **Then** I see the BMAD Viewer branding, a description of the product, and links to register/login (AC:1)
2. **Given** I am on any page **When** I look at the header **Then** I see the BMAD Viewer logo and navigation consistent with the app design (AC:2)

## Tasks / Subtasks

- [x] Task 1 — Remove starter boilerplate (AC: #1, #2)
  - [x] Delete `AppLogo.vue` and `TemplateMenu.vue` from starter
  - [x] Replace green palette with BMAD branding colors (indigo/slate)
  - [x] Update `app.config.ts` with primary: indigo, neutral: slate
  - [x] Clean `app/assets/css/main.css` — Tailwind + Public Sans font
- [x] Task 2 — Create BMAD branding component (AC: #2)
  - [x] Create `BmadLogo.vue` — text-based logo ("BMAD" in primary + "Viewer" in muted)
- [x] Task 3 — Build application shell layout (AC: #2)
  - [x] `app.vue` — sticky header (logo, color mode, GitHub link, user menu)
  - [x] Auth-aware header: user avatar + dropdown when logged in, "Sign in" button otherwise
  - [x] Footer with copyright + color mode toggle
  - [x] `NewStoryModal` floating button in repo context
- [x] Task 4 — Create landing page (AC: #1)
  - [x] `app/pages/index.vue` — UPageHero (title, description, CTA "Go to Dashboard")
  - [x] Features section: Document Browser, Sprint Roadmap, Epics & Stories, Comments as Issues, GitHub Integration, Multi-Repo Dashboard
  - [x] `layout: false` to avoid default layout on landing
- [x] Task 5 — Define TypeScript domain types (AC: #1, #2)
  - [x] `shared/types/bmad.ts` — Story, Epic, Sprint, BmadDocument, Repository, CommentPayload, NewStoryPayload, GitHubIssue, PullRequest
  - [x] Status enums: StoryStatus, Priority, SprintStatus, IssueType, PullRequestState
- [x] Task 6 — Create page stubs for routing
  - [x] `app/pages/dashboard.vue` — dashboard placeholder
  - [x] `app/pages/repos/[owner]/[repo]/index.vue` — repo page with tabs
  - [x] Route structure: `/repos/:owner/:repo/` with Documents/Roadmap/Epics tabs

## Dev Notes

### Implementation Status: ALREADY COMPLETE

This story's implementation already exists in the codebase. All files listed below are present and functional. The brownfield BMAD planning was performed after the code was already built.

### Existing Implementation Summary

**Branding & Config:**
- `app.config.ts` — primary: indigo, neutral: slate
- `app/assets/css/main.css` — Tailwind CSS 4 + @nuxt/ui + Public Sans font
- `app/components/BmadLogo.vue` — text logo, "BMAD" in primary, "Viewer" in muted

**Application Shell (`app/app.vue`):**
- Sticky header with backdrop blur
- BmadLogo as NuxtLink to "/"
- UColorModeButton, GitHub repo link, auth-aware user menu (UDropdownMenu + UAvatar)
- Main area with NuxtPage
- NewStoryModal floating in repo context (`isRepoContext` computed)
- Footer with copyright + color mode

**Landing Page (`app/pages/index.vue`):**
- UPageHero: "BMAD Viewer" title, description, CTA to /dashboard + GitHub link
- UPageSection: 6 feature cards (Document Browser, Sprint Roadmap, Epics & Stories, Comments as Issues, GitHub Integration, Multi-Repo Dashboard)
- `layout: false` — standalone page

**TypeScript Types (`shared/types/bmad.ts`):**
- StoryStatus: 'todo' | 'in_progress' | 'done' | 'blocked' | 'ready_for_review'
- Priority: 'high' | 'medium' | 'low'
- SprintStatus: 'active' | 'completed' | 'planned'
- IssueType: 'comment' | 'feature' | 'bug' | 'improvement'
- PullRequestState: 'open' | 'merged' | 'closed' | 'draft'
- Interfaces: Story, Epic, PullRequest, Sprint, BmadDocument, Repository, CommentPayload, NewStoryPayload, GitHubIssue

### Nuxt UI Best Practices (PR #12)

- `app.vue` now wrapped in `<UApp>` — required for Toast, Tooltip, and overlay components to function correctly
- Token error banner in `repos/[owner]/[repo]/index.vue` replaced with `<UAlert>` component (was a custom styled `<div>`)

### Architecture Compliance

- SSR disabled (`ssr: false`) ✅ [Source: architecture.md#Technical Constraints]
- Nuxt UI v4 components throughout ✅ [Source: architecture.md#Frontend Architecture]
- Tailwind CSS 4 CSS-first config ✅ [Source: architecture.md#Starter Template]
- File-based routing with `app/` directory ✅ [Source: architecture.md#Structure Patterns]
- PascalCase components, camelCase functions ✅ [Source: architecture.md#Naming Patterns]
- No Pinia, no barrel files except `shared/types/` ✅ [Source: architecture.md#Anti-patterns]

### Project Structure Notes

- All paths align with the architecture document's project structure
- No detected conflicts or variances

### References

- [Source: architecture.md#Starter Template Evaluation] — Nuxt UI starter selection
- [Source: architecture.md#Frontend Architecture] — SPA mode, Nuxt UI components
- [Source: architecture.md#Implementation Patterns] — Naming conventions, file limits
- [Source: prd.md#FR1-FR5] — Auth requirements covered by app shell auth-awareness
- [Source: epics.md#Story 1.1] — Story definition and acceptance criteria

## Dev Agent Record

### Agent Model Used

claude-opus-4-5-20251101

### Completion Notes List

- All tasks verified complete against existing codebase
- Story is ready for verification pass — no new code to write

### File List

- `app/app.vue` — Root layout with header, main, footer
- `app/app.config.ts` — UI theme configuration
- `app/assets/css/main.css` — Tailwind + font config
- `app/components/BmadLogo.vue` — BMAD Viewer logo component
- `app/pages/index.vue` — Landing page with hero + features
- `shared/types/bmad.ts` — All TypeScript domain types
- `app/pages/dashboard.vue` — Dashboard page
- `app/pages/repos/[owner]/[repo]/index.vue` — Repo page with tabs
