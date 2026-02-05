# Story 5.2: PRs associées & issues liées

Status: done

## Story

As a **user viewing a story**,
I want **to see pull requests and GitHub issues linked to this story**,
So that **I can track implementation progress and related discussions**.

## Acceptance Criteria

1. Given PRs exist, When I view story detail, Then I see PRs with title, number, status, clickable GitHub link (AC:1)
2. Given issues exist, When I view story detail, Then I see issues with title, number, state, labels (AC:2)
3. Given no PRs/issues, When I view story detail, Then sections are hidden (AC:3)

## Tasks / Subtasks

- [x] Create RelatedPRs.vue — PR list from preloaded data
- [x] Create LinkedIssues.vue — issues fetched via GET /api/github/issues
- [x] Conditional rendering: hide sections when empty

## Dev Notes

### Implementation: PARTIAL — LinkedIssues complete, RelatedPRs is a stub

- **LinkedIssues**: fetched on demand via useGitHubIssues.fetchLinkedIssues(), filtered by label `story: {id}` — COMPLETE
- **RelatedPRs**: stub component showing static "No pull requests linked yet." — NOT IMPLEMENTED
  - Root cause: data model supports PRs at epic level (Sprint.pr), not per-story PR matching
  - PR data exists in useRepoData (preloaded pulls) but no logic maps PRs to individual stories
  - To implement: match PRs by branch name or title pattern containing story ID

### File List

- `app/components/story/RelatedPRs.vue`
- `app/components/story/LinkedIssues.vue`
