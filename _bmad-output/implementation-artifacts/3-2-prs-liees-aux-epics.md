# Story 3.2: PRs liées aux epics

Status: done

## Story

As a **user viewing the roadmap**,
I want **to see pull requests linked to each epic and click them to open on GitHub**,
So that **I can track code progress alongside project planning**.

## Acceptance Criteria

1. Given an epic has PRs, When I view the card, Then I see PRs with title, status, number (AC:1)
2. Given I see a PR, When I click, Then GitHub opens in new tab (AC:2)
3. Given no PRs, When I view the card, Then no PR section displayed (AC:3)

## Tasks / Subtasks

- [x] Add PR badge section in SprintCard.vue
- [x] State-based color/icon (open=green, merged=primary, closed=red)
- [x] Clickable link to PR htmlUrl with target="_blank"

## Dev Notes

### Implementation: COMPLETE

- PR badge with state icon (git-pull-request/git-merge/git-pull-request-closed)
- v-if="sprint.pr" hides section cleanly when no PR
- PRs matched to epics by branch name in useRepoData

### File List

- `app/components/roadmap/SprintCard.vue` (PR section)
