# Story 2.2: Rendu Markdown & lien GitHub

Status: done

## Story

As a **user browsing documents**,
I want **to read a document with formatted Markdown rendering and open it directly on GitHub**,
So that **I can review project documentation in a readable format and access the source**.

## Acceptance Criteria

1. Given I click a document, When selected, Then Markdown is rendered with formatting in < 500ms and breadcrumb updates (AC:1)
2. Given I am viewing a document, When I click "Open in GitHub", Then a new tab opens on GitHub (AC:2)
3. Given YAML frontmatter, When rendered, Then frontmatter is handled (not raw YAML) (AC:3)
4. Given empty/failed content, When displayed, Then I see an error or empty state (AC:4)

## Tasks / Subtasks

- [x] Create DocumentViewer.vue — MDC rendering, "Open in GitHub" button
- [x] Prose styling with dark mode support
- [x] GitHub link construction: `https://github.com/{owner}/{repo}/blob/main/{path}`

## Dev Notes

### Implementation: COMPLETE

- Uses `<MDC :value="content" />` from @nuxtjs/mdc
- "Open in GitHub" button with external link icon
- Prose class with dark:prose-invert for dark mode
- Frontmatter handling: `<MDC>` natively parses YAML frontmatter and excludes it from rendered output. Verified — no raw YAML leak (AC:3 satisfied)

### File List

- `app/components/documents/DocumentViewer.vue`
