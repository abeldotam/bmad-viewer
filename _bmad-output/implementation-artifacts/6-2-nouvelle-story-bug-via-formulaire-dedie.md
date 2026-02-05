# Story 6.2: Nouvelle story/bug via formulaire dédié

Status: done

## Story

As a **user**,
I want **to create a new story, bug report, or improvement request via a dedicated form that generates a GitHub issue with a BMAD template**,
So that **I can propose changes following the BMAD methodology without modifying files directly**.

## Acceptance Criteria

1. Given I am in a repo context, When I click "New Story / Report Bug", Then I see a modal with type/title/description/epic/priority fields (AC:1)
2. Given I fill and submit, Then a GitHub issue is created with `[NEW STORY]`/`[BUG]`/`[BMAD Improvement]` prefix and BMAD labels (AC:2)
3. Given a feature request, Then the body includes BMAD processing instructions (AC:3)
4. Given success, Then I see a toast with a link to the created issue (AC:4)

## Tasks / Subtasks

- [x] Create NewStoryModal.vue — form with type/title/description/epic/priority
- [x] Add useGitHubIssues.createNewStory() with label generation
- [x] Create issue templates in issueTemplates.ts (buildNewStoryIssueBody, getNewStoryLabels)
- [x] Floating button in app.vue (visible in repo context via isRepoContext computed)

## Dev Notes

### Implementation: COMPLETE

- Modal form with all required fields
- Type prefix: feature=[NEW STORY], bug=[BMAD Bug], improvement=[BMAD Improvement]
- Labels: bmad-new-story/bmad-bug/bmad-improvement + bmad-pending + priority:{p}
- Floating button fixed bottom-right, only visible when route starts with /repos/

### File List

- `app/components/NewStoryModal.vue`
- `app/composables/useGitHubIssues.ts` (createNewStory)
- `app/utils/issueTemplates.ts` (buildNewStoryIssueBody, getNewStoryLabels)
- `app/app.vue` (floating button)
