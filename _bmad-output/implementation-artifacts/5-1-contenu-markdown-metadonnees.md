# Story 5.1: Contenu Markdown & métadonnées

Status: done

## Story

As a **user**,
I want **to view a story's full Markdown content alongside its metadata (epic, status, priority, estimate, assignee)**,
So that **I can understand the complete scope and context of a work item**.

## Acceptance Criteria

1. Given I navigate to story detail, When page loads, Then I see title with ID badge, status badge, breadcrumb (AC:1)
2. Given Markdown content, When rendered, Then full formatting in < 500ms (AC:2)
3. Given metadata, When I look at sidebar, Then I see epic, status, priority, estimation, assignee (AC:3)
4. Given empty content, When page loads, Then I see an explicit message (AC:4)

## Tasks / Subtasks

- [x] Create story/[id].vue — two-column layout, lazy-loads content
- [x] Create StoryHeader.vue — ID badge, title, status badge, breadcrumb
- [x] Create StoryContent.vue — MDC rendering
- [x] Create StoryMetadata.vue — sidebar with structured metadata card

## Dev Notes

### Implementation: COMPLETE

- Story found from preloaded data (useRepoData inject)
- Content lazy-loaded on page visit via fetchFileContent
- Two-column layout: content (left) + metadata sidebar (right)
- "Story not found" message for invalid IDs
- "Copy link" button in StoryHeader copies story URL to clipboard with visual feedback

### File List

- `app/pages/repos/[owner]/[repo]/story/[id].vue`
- `app/components/story/StoryHeader.vue`
- `app/components/story/StoryContent.vue`
- `app/components/story/StoryMetadata.vue`
