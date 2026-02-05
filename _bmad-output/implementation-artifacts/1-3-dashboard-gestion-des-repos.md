# Story 1.3: Dashboard & gestion des repos

Status: done

## Story

As a **logged-in user**,
I want **to see my connected repositories on a dashboard and add or remove repos**,
So that **I can manage which BMAD projects I track**.

## Acceptance Criteria

1. Given I am on the dashboard, When the page loads, Then I see my repos with owner/name and last sync date; if none, an empty state (AC:1)
2. Given I click "Add Repository", When I provide owner/name/token, Then the system validates and adds the repo with encrypted token (AC:2)
3. Given I provide an invalid token, When I submit, Then I see an explicit error message (AC:3)
4. Given I click delete on a repo, When I confirm, Then the repo is removed (AC:4)

## Tasks / Subtasks

- [x] Create dashboard.vue — grid of RepoCards, loading state, empty state
- [x] Create RepoCard.vue — owner/name, last sync, delete button
- [x] Create AddRepoModal.vue — form with owner/name/token, validation
- [x] Create useRepository.ts — fetchRepos(), addRepo(), deleteRepo()
- [x] Create server/api/repos/index.get.ts — list user's repos
- [x] Create server/api/repos/index.post.ts — add repo, validate token, encrypt
- [x] Create server/api/repos/[id].delete.ts — delete with ownership check
- [x] Create server/utils/encryption.ts — AES-256-GCM encrypt/decrypt
- [x] Create server/utils/supabase.ts — service role client

## Dev Notes

### Implementation: COMPLETE

- AES-256-GCM with random 12-byte IV, 16-byte auth tag
- Token validated via Octokit before storage (rejects invalid tokens)
- Duplicate repo detection (409)
- RLS: user_id = auth.uid() on repositories table
- `default_branch` auto-detected from GitHub API at repo creation, displayed as badge on RepoCard
- PATCH `/api/repos/:id` supports updating `default_branch` and `last_synced_at`

### File List

- `app/pages/dashboard.vue`
- `app/components/dashboard/RepoCard.vue`
- `app/components/dashboard/AddRepoModal.vue`
- `app/composables/useRepository.ts`
- `server/api/repos/index.get.ts`
- `server/api/repos/index.post.ts`
- `server/api/repos/[id].delete.ts`
- `server/api/repos/[id].patch.ts`
- `server/utils/encryption.ts`
- `server/utils/supabase.ts`
- `supabase/migrations/002_add_default_branch.sql`
