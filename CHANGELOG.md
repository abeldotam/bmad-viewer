# Changelog

All notable changes to this project will be documented in this file.

## Unreleased

### Added
- Skeleton loading components for repo data (roadmap, epics, documents, story detail)
- Searchable GitHub repo selector on dashboard
- GitHub repo validation endpoint (`GET /api/github/validate`)

### Changed
- Replaced SQLite with browser localStorage for repo storage
- Aligned OAuth env var names with `nuxt-auth-utils` conventions

### Fixed
- Pass `repo` param instead of `name` to validate endpoint
- Handle missing story files gracefully
- Display actual error when story content fails to load
- Parse BMAD `development_status` format in `sprint-status.yaml`
- Make `default_branch` nullable so NULL uses repo's actual default

## 1.0.0 — Initial Release

### Added
- Browse BMAD project documents rendered as Markdown
- Sprint roadmap with progress bars per epic
- Story explorer with table and Kanban views
- Story detail with metadata, related PRs, and GitHub issue comments
- Dual-mode: personal (PAT) and multi-user (GitHub OAuth)
- Docker support with `Dockerfile` and `docker-compose.yml`
- MIT license
