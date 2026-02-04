import type { Story, Epic, Sprint, BmadDocument, Repository } from '~~/shared/types/bmad'

const stories: Story[] = [
  { id: 'S-001', title: 'User authentication flow', epic: 'E-001', status: 'done', priority: 'high', estimate: 5, assignee: 'alice', filePath: 'epics/epic-1/story-1.md', content: '## Description\n\nImplement email/password authentication using Supabase Auth.\n\n## Acceptance Criteria\n\n- User can register with email and password\n- User can log in with valid credentials\n- Error messages shown for invalid credentials\n- Session persisted across page refreshes' },
  { id: 'S-002', title: 'OAuth GitHub integration', epic: 'E-001', status: 'done', priority: 'high', estimate: 8, assignee: 'bob', filePath: 'epics/epic-1/story-2.md', content: '## Description\n\nAdd GitHub OAuth as an alternative login method.\n\n## Acceptance Criteria\n\n- "Login with GitHub" button on login page\n- OAuth callback handled correctly\n- GitHub user info stored in profile\n- Token securely stored for API access' },
  { id: 'S-003', title: 'Session management', epic: 'E-001', status: 'in_progress', priority: 'medium', estimate: 3, assignee: 'alice', filePath: 'epics/epic-1/story-3.md', content: '## Description\n\nManage user sessions with automatic refresh and logout.\n\n## Acceptance Criteria\n\n- Sessions auto-refresh before expiry\n- Logout clears all session data\n- Protected routes redirect to login' },
  { id: 'S-004', title: 'Repository CRUD API', epic: 'E-002', status: 'done', priority: 'high', estimate: 5, assignee: 'charlie', filePath: 'epics/epic-2/story-4.md', content: '## Description\n\nServer API endpoints for managing repositories.\n\n## Acceptance Criteria\n\n- POST /api/repos creates a new repo entry\n- GET /api/repos lists user repos\n- DELETE /api/repos/:id removes a repo\n- Validates GitHub token on creation' },
  { id: 'S-005', title: 'GitHub content fetching', epic: 'E-002', status: 'in_progress', priority: 'high', estimate: 8, assignee: 'bob', filePath: 'epics/epic-2/story-5.md', content: '## Description\n\nFetch file contents from GitHub repositories via Octokit.\n\n## Acceptance Criteria\n\n- Fetch single file content by path\n- List directory contents recursively\n- Handle rate limiting gracefully\n- Support private repositories with token' },
  { id: 'S-006', title: 'File caching layer', epic: 'E-002', status: 'todo', priority: 'medium', estimate: 5, filePath: 'epics/epic-2/story-6.md', content: '## Description\n\nCache GitHub file contents in Supabase to reduce API calls.\n\n## Acceptance Criteria\n\n- Files cached with SHA hash for invalidation\n- Cache refreshed on manual sync\n- Stale cache served while refreshing' },
  { id: 'S-007', title: 'Document tree sidebar', epic: 'E-003', status: 'done', priority: 'high', estimate: 5, assignee: 'alice', filePath: 'epics/epic-3/story-7.md', content: '## Description\n\nRecursive tree component for browsing _bmad-output/ files.\n\n## Acceptance Criteria\n\n- Directories expandable/collapsible\n- Files clickable to view content\n- Current file highlighted\n- Icons for file types' },
  { id: 'S-008', title: 'Markdown rendering', epic: 'E-003', status: 'done', priority: 'high', estimate: 3, assignee: 'charlie', filePath: 'epics/epic-3/story-8.md', content: '## Description\n\nRender Markdown documents with proper styling.\n\n## Acceptance Criteria\n\n- Full GFM support (tables, code blocks, lists)\n- Syntax highlighting for code\n- "Open in GitHub" link\n- Responsive layout' },
  { id: 'S-009', title: 'Sprint timeline view', epic: 'E-003', status: 'in_progress', priority: 'medium', estimate: 5, assignee: 'alice', filePath: 'epics/epic-3/story-9.md', content: '## Description\n\nVertical timeline showing sprint progress.\n\n## Acceptance Criteria\n\n- Each sprint shown as a card on the timeline\n- Progress bar per sprint\n- Current sprint highlighted\n- Story status breakdown visible' },
  { id: 'S-010', title: 'Stories table with filters', epic: 'E-003', status: 'ready_for_review', priority: 'medium', estimate: 8, assignee: 'bob', filePath: 'epics/epic-3/story-10.md', content: '## Description\n\nDataTable of all stories with sorting and filtering.\n\n## Acceptance Criteria\n\n- Columns: ID, Title, Epic, Status, Priority, Estimate\n- Filter by status, priority, epic\n- Search by title\n- Sortable columns\n- Click row to view story detail' },
  { id: 'S-011', title: 'Kanban board view', epic: 'E-003', status: 'todo', priority: 'low', estimate: 5, filePath: 'epics/epic-3/story-11.md', content: '## Description\n\nKanban board grouped by story status.\n\n## Acceptance Criteria\n\n- Columns: To Do, In Progress, Done\n- Story cards with key info\n- Toggle between Table and Kanban via tabs\n- Read-only (no drag & drop in v1)' },
  { id: 'S-012', title: 'Comment to issue creation', epic: 'E-004', status: 'blocked', priority: 'high', estimate: 8, filePath: 'epics/epic-4/story-12.md', content: '## Description\n\nAllow users to leave comments on stories that create GitHub issues.\n\n## Acceptance Criteria\n\n- Comment form on story detail page\n- Creates issue with [BMAD Comment] prefix\n- Auto-applies labels: bmad-comment, story ID, epic ID\n- Shows linked issues on story page\n\n## Blocked By\n\nRequires GitHub API integration (S-005) to be completed first.' },
  { id: 'S-013', title: 'New story proposal form', epic: 'E-004', status: 'todo', priority: 'medium', estimate: 5, filePath: 'epics/epic-4/story-13.md', content: '## Description\n\nModal form for proposing new stories via GitHub issues.\n\n## Acceptance Criteria\n\n- Modal with: type, title, description, epic, priority\n- Creates issue with [NEW STORY] prefix\n- Appropriate labels applied\n- Accessible from floating action button' },
  { id: 'S-014', title: 'Issue label automation', epic: 'E-004', status: 'todo', priority: 'low', estimate: 3, filePath: 'epics/epic-4/story-14.md', content: '## Description\n\nAutomatic label management for BMAD-created issues.\n\n## Acceptance Criteria\n\n- Labels created if they do not exist\n- Consistent color scheme for BMAD labels\n- Labels: bmad-comment, bmad-new-story, bmad-bug, bmad-improvement' }
]

const epics: Epic[] = [
  {
    id: 'E-001',
    title: 'Authentication & Authorization',
    description: 'User authentication with email/password and GitHub OAuth, session management, and route protection.',
    stories: stories.filter(s => s.epic === 'E-001'),
    filePath: 'epics/epic-1.md'
  },
  {
    id: 'E-002',
    title: 'Repository Management',
    description: 'CRUD operations for repositories, GitHub API integration, content fetching, and file caching.',
    stories: stories.filter(s => s.epic === 'E-002'),
    filePath: 'epics/epic-2.md'
  },
  {
    id: 'E-003',
    title: 'Visualization & UI',
    description: 'Document browser, sprint roadmap, stories table, Kanban board, and story detail views.',
    stories: stories.filter(s => s.epic === 'E-003'),
    filePath: 'epics/epic-3.md'
  },
  {
    id: 'E-004',
    title: 'Feedback & Issues',
    description: 'Comment system creating GitHub issues, new story proposals, and automatic label management.',
    stories: stories.filter(s => s.epic === 'E-004'),
    filePath: 'epics/epic-4.md'
  }
]

const sprints: Sprint[] = [
  {
    number: 1,
    goal: 'Core authentication and repository setup',
    status: 'completed',
    stories: stories.filter(s => ['S-001', 'S-002', 'S-004'].includes(s.id))
  },
  {
    number: 2,
    goal: 'GitHub integration and document viewing',
    status: 'active',
    stories: stories.filter(s => ['S-003', 'S-005', 'S-007', 'S-008'].includes(s.id))
  },
  {
    number: 3,
    goal: 'Advanced views and feedback system',
    status: 'planned',
    stories: stories.filter(s => ['S-006', 'S-009', 'S-010', 'S-011', 'S-012', 'S-013', 'S-014'].includes(s.id))
  }
]

const documents: BmadDocument[] = [
  {
    name: '_bmad-output',
    path: '_bmad-output',
    type: 'directory',
    children: [
      { name: 'PRD.md', path: '_bmad-output/PRD.md', type: 'file' },
      { name: 'architecture.md', path: '_bmad-output/architecture.md', type: 'file' },
      { name: 'sprint-status.yaml', path: '_bmad-output/sprint-status.yaml', type: 'file' },
      {
        name: 'epics',
        path: '_bmad-output/epics',
        type: 'directory',
        children: [
          { name: 'epic-1.md', path: '_bmad-output/epics/epic-1.md', type: 'file' },
          { name: 'epic-2.md', path: '_bmad-output/epics/epic-2.md', type: 'file' },
          {
            name: 'epic-1',
            path: '_bmad-output/epics/epic-1',
            type: 'directory',
            children: [
              { name: 'story-1.md', path: '_bmad-output/epics/epic-1/story-1.md', type: 'file' },
              { name: 'story-2.md', path: '_bmad-output/epics/epic-1/story-2.md', type: 'file' },
              { name: 'story-3.md', path: '_bmad-output/epics/epic-1/story-3.md', type: 'file' }
            ]
          },
          {
            name: 'epic-2',
            path: '_bmad-output/epics/epic-2',
            type: 'directory',
            children: [
              { name: 'story-4.md', path: '_bmad-output/epics/epic-2/story-4.md', type: 'file' },
              { name: 'story-5.md', path: '_bmad-output/epics/epic-2/story-5.md', type: 'file' },
              { name: 'story-6.md', path: '_bmad-output/epics/epic-2/story-6.md', type: 'file' }
            ]
          }
        ]
      }
    ]
  }
]

const repositories: Repository[] = [
  {
    id: '1',
    owner: 'acme-corp',
    name: 'project-alpha',
    lastSyncedAt: '2025-06-01T10:30:00Z',
    createdAt: '2025-05-15T08:00:00Z'
  },
  {
    id: '2',
    owner: 'acme-corp',
    name: 'project-beta',
    lastSyncedAt: null,
    createdAt: '2025-06-02T14:00:00Z'
  }
]

const documentContents: Record<string, string> = {
  '_bmad-output/PRD.md': '# Product Requirements Document\n\n## Vision\n\nBMAD Viewer provides a web-based interface for visualizing and tracking BMAD methodology projects stored in GitHub repositories.\n\n## Goals\n\n1. **Read-only visualization** of BMAD project outputs\n2. **Sprint tracking** with progress indicators\n3. **Document browsing** with Markdown rendering\n4. **Feedback system** via GitHub issues\n\n## Target Users\n\n- Project managers tracking BMAD-driven development\n- Developers reviewing project progress\n- Stakeholders monitoring sprint deliverables\n\n## Out of Scope (v1)\n\n- Direct file editing\n- Drag-and-drop Kanban\n- Real-time collaboration',
  '_bmad-output/architecture.md': '# Architecture Document\n\n## Tech Stack\n\n- **Frontend**: Nuxt 4, Nuxt UI, Tailwind CSS\n- **Backend**: Nitro server routes\n- **Database**: Supabase (PostgreSQL)\n- **Auth**: Supabase Auth with GitHub OAuth\n- **API**: GitHub REST API via Octokit\n\n## Key Decisions\n\n### ADR-001: Nuxt 4 over plain Vue\n\nFull-stack framework with SSR, file-based routing, and auto-imports.\n\n### ADR-002: Supabase over custom backend\n\nManaged PostgreSQL with built-in auth, RLS policies, and real-time subscriptions.\n\n### ADR-003: Read-only mode for v1\n\nNo write operations to BMAD files. Comments create GitHub issues instead.'
}

export function useMockData() {
  return {
    stories,
    epics,
    sprints,
    documents,
    repositories,
    documentContents,
    getStory: (id: string) => stories.find(s => s.id === id),
    getEpic: (id: string) => epics.find(e => e.id === id),
    getStoriesByEpic: (epicId: string) => stories.filter(s => s.epic === epicId),
    getStoriesByStatus: (status: string) => stories.filter(s => s.status === status),
    getDocumentContent: (path: string) => documentContents[path] || `# ${path.split('/').pop()}\n\nContent for this document is not yet available.`
  }
}
