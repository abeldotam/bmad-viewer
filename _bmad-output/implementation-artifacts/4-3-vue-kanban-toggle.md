# Story 4.3: Vue kanban & toggle

Status: done

## Story

As a **user browsing stories**,
I want **to switch to a kanban board view grouped by status**,
So that **I can visualize story progress in a spatial layout**.

## Acceptance Criteria

1. Given I click "Kanban" tab, Then stories organized in columns by status with filters preserved (AC:1)
2. Given kanban view, When I view a card, Then I see ID, title, epic badge, priority badge (AC:2)
3. Given I click a card, Then I navigate to story detail (AC:3)
4. Given I switch back to "Table", Then table displayed with filters preserved (v-show) (AC:4)

## Tasks / Subtasks

- [x] Create KanbanBoard.vue — 3 columns (To Do, In Progress, Done)
- [x] Create KanbanColumn.vue — header + counter + scrollable card list
- [x] Create KanbanCard.vue — story ID, title, epic badge, priority badge, clickable
- [x] UTabs toggle in epics page, filters shared between views

## Dev Notes

### Implementation: COMPLETE

- No drag & drop (read-only v1)
- Columns group stories by status
- Cards navigate to /story/[id] on click
- v-show tabs preserve state per ADR-4

### File List

- `app/components/kanban/KanbanBoard.vue`
- `app/components/kanban/KanbanColumn.vue`
- `app/components/kanban/KanbanCard.vue`
