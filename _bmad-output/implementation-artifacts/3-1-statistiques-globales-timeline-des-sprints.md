# Story 3.1: Statistiques globales & timeline des sprints

Status: done

## Story

As a **user viewing a repo**,
I want **to see overall project progress and a timeline of sprints with their status and completion rates**,
So that **I know at a glance where my project stands**.

## Acceptance Criteria

1. Given I am on the Roadmap tab, When displayed, Then I see global stats: total stories, completed, % progress, current sprint (AC:1)
2. Given roadmap data is loaded, When I scroll, Then each sprint/epic shows as a card with number, goal, status badge, progress bar, story breakdown (AC:2)
3. Given an epic has no stories, When displayed, Then progress bar shows 0% (AC:3)

## Tasks / Subtasks

- [x] Create GlobalStats.vue — 4 stat cards + status breakdown with UProgress
- [x] Create SprintTimeline.vue — vertical timeline with color-coded dots
- [x] Create SprintCard.vue — card with status badge, UProgress, story breakdown

## Dev Notes

### Implementation: COMPLETE

- GlobalStats: responsive grid (2 cols mobile, 4 cols desktop)
- Timeline: CSS border-left + positioned dots (green/blue/gray by status)
- useStoryStatus composable centralizes progress calculations
- Minor note: empty epics show 0% bar but no explicit "no stories" text message

### File List

- `app/components/roadmap/GlobalStats.vue`
- `app/components/roadmap/SprintTimeline.vue`
- `app/components/roadmap/SprintCard.vue`
