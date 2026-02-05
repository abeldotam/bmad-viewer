# Story 4.1: Vue table des stories

Status: done

## Story

As a **user viewing a repo**,
I want **to see all stories in a sortable data table with key information**,
So that **I can quickly scan project work items and their status**.

## Acceptance Criteria

1. Given I am on the Epics & Stories tab, When displayed, Then I see a UTable with columns: ID, Title, Epic, Status, Priority, Estimate; rows clickable to story detail (AC:1)
2. Given epic data is loaded, When I view the top, Then I see progress cards per epic; clicking one filters the table (AC:2)
3. Given no stories, When displayed, Then I see an empty state message (AC:3)

## Tasks / Subtasks

- [x] Create StoriesTable.vue — UTable with all columns, clickable rows
- [x] Create EpicProgressCards.vue — progress cards per epic with UProgress
- [x] Create StatusBadge.vue — UBadge by status with color mapping
- [x] Create PriorityBadge.vue — UBadge by priority with icon + color

## Dev Notes

### Implementation: COMPLETE

- UTable with column definitions, row click navigates to /story/[id]
- EpicProgressCards: clickable cards that emit filter events
- StatusBadge/PriorityBadge: use auto-imported getStatusColor/getStatusLabel/getPriorityIcon/getPriorityColor from utils/status.ts

### File List

- `app/components/epics/StoriesTable.vue`
- `app/components/epics/EpicProgressCards.vue`
- `app/components/epics/StatusBadge.vue`
- `app/components/epics/PriorityBadge.vue`
