# Story 1.4: Proxy GitHub & préchargement des données

Status: done

## Story

As a **user**,
I want **all repository data to be loaded when I open a repo, so that tab navigation is instant**,
So that **I can browse documents, roadmap, and stories without waiting for API calls**.

## Acceptance Criteria

1. Given I click a repo, When the page loads, Then all data is fetched in parallel in < 3s with a loading indicator (AC:1)
2. Given data is preloaded, When I switch tabs, Then content appears instantly without API calls (AC:2)
3. Given the GitHub API errors, When preloading fails, Then I see an explicit error message (AC:3)
4. Given the repo is private, When data is fetched, Then the token is used server-side only (AC:4)

## Tasks / Subtasks

- [x] Create server/api/github/tree.get.ts — fetch _bmad-output/ tree
- [x] Create server/api/github/contents.get.ts — fetch file content + cache
- [x] Create server/api/github/pulls.get.ts — fetch PRs
- [x] Create server/utils/github.ts — Octokit wrapper
- [x] Create useRepoData.ts — provideRepoData() with parallel loading
- [x] Create useGitHub.ts — fetchDocumentTree(), fetchFileContent(), fetchSprintStatus(), fetchStories()
- [x] Create useBmadParser.ts — parseSprintStatus(), parseStory(), parseEpic(), buildDocumentTree()
- [x] Create useStoryStatus.ts — computeProgress(), getGlobalProgress(), getStatusBreakdown()
- [x] Create repos/[owner]/[repo]/index.vue — tabbed layout with preloaded data
- [x] Create RepoNavigation.vue — desktop nav + mobile dropdown

## Dev Notes

### Implementation: COMPLETE

- Parallel fetch: tree + sprint-status + PRs via Promise.allSettled
- PRs matched to sprints/epics by branch name
- File content cached in `cached_files` table with 5-minute TTL (CACHE_TTL_MS)
- Cache bypass via `noCache` query parameter for manual sync
- "Sync now" button (refresh-cw icon) in tab bar with loading spinner
- GitHub auth error detection (401/403) via `isGitHubAuthError()` helper
- Auth errors propagated through all 3 API routes → client shows warning banner with dashboard link
- `tokenError` and `syncing` refs in useRepoData (separate from `loading`)
- `last_synced_at` updated via PATCH `/api/repos/:id` after successful loadAll (fire-and-forget)
- Configurable `default_branch` per repository (column added in migration 002)
- `default_branch` nullable (migration 003): NULL = use repo's actual default branch (HEAD)
- Branch auto-detected from GitHub API at repo creation when token provided
- Branch editable from dashboard RepoCard (UPopover inline form)
- Multi-format parser: epic-based + legacy sprint format, with/without frontmatter
- provide/inject for repo-scoped data (useRepoData)
- Tabs use v-show per ADR-4

### File List

- `supabase/migrations/002_add_default_branch.sql`
- `supabase/migrations/003_nullable_default_branch.sql`
- `server/api/repos/index.post.ts`
- `server/api/repos/index.get.ts`
- `server/api/repos/[id].patch.ts`
- `server/api/github/tree.get.ts`
- `server/api/github/contents.get.ts`
- `server/api/github/pulls.get.ts`
- `server/utils/github.ts`
- `app/composables/useRepoData.ts`
- `app/composables/useGitHub.ts`
- `app/composables/useBmadParser.ts`
- `app/composables/useStoryStatus.ts`
- `app/pages/repos/[owner]/[repo]/index.vue`
- `app/components/RepoNavigation.vue`
- `app/components/dashboard/RepoCard.vue`
- `app/composables/useRepository.ts`
- `app/types/database.types.ts`
- `shared/types/bmad.ts`
