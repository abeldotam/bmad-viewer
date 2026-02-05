# Story 4.2: Filtres & recherche

Status: done

## Story

As a **user browsing stories**,
I want **to filter stories by status, priority, and epic, and search by text**,
So that **I can find specific stories quickly without scrolling through all items**.

## Acceptance Criteria

1. Given I select a status filter, When applied, Then table updates in real-time < 100ms (AC:1)
2. Given multiple filters, When applied, Then table shows stories matching ALL criteria (AC:2)
3. Given I type in search, When text matches title or ID, Then table updates in real-time (AC:3)
4. Given active filters, When I clear all, Then full list is restored (AC:4)

## Tasks / Subtasks

- [x] Create StoryFilters.vue — UInput search + USelectMenu for status/priority/epic
- [x] Integrate computed filteredStories in repo page index.vue
- [x] Real-time filtering via Vue computed properties (no debounce needed)

## Dev Notes

### Implementation: COMPLETE

- Filters implemented as computed property in index.vue (filteredStories)
- No debounce needed — Vue reactivity + computed is instantaneous for small datasets
- Filters: search (text), status (select), priority (select), epic (via EpicProgressCards click)
- Clear filters resets all to default values

### File List

- `app/components/epics/StoryFilters.vue`
