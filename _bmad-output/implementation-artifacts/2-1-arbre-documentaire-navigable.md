# Story 2.1: Arbre documentaire navigable

Status: done

## Story

As a **user viewing a repo**,
I want **to browse the document tree of `_bmad-output/` with expandable folders**,
So that **I can find and select any project document quickly**.

## Acceptance Criteria

1. Given I am on the Documents tab, When displayed, Then I see the tree with expandable folders and file icons (AC:1)
2. Given missing/unexpected files, When the tree is built, Then available files shown gracefully (AC:2)
3. Given no documents, When I view the tab, Then I see an empty state message (AC:3)

## Tasks / Subtasks

- [x] Create DocumentTree.vue — recursive tree, v-show for expansion, icons by file type
- [x] Create DocumentBreadcrumb.vue — file path breadcrumb
- [x] Integrate in repo page Documents tab with empty state

## Dev Notes

### Implementation: COMPLETE

- Recursive component with depth tracking
- Icons: folder, yaml, markdown, generic (via getIcon())
- Selected item highlighted with primary/10 background
- Empty state handled at page level (index.vue) with explicit message

### File List

- `app/components/documents/DocumentTree.vue`
- `app/components/documents/DocumentBreadcrumb.vue`
