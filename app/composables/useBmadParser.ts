import yaml from 'js-yaml'
import { parseFrontmatter } from '~/utils/yamlFrontmatter'
import type { Story, Epic, Sprint, BmadDocument, StoryStatus, SprintStatus } from '~~/shared/types/bmad'

interface RawEpic {
  name: string
  status: string
  stories_total: number
  stories_completed: number
  stories_in_progress: number
  pr?: string | null
  branch?: string
  notes?: string
  dependencies?: string[]
}

interface RawStory {
  id: string
  file: string
  status: string
  epic: number
}

interface RawSprintStatus {
  // New epic-based format
  project?: string
  epics?: Record<string, RawEpic>
  stories?: RawStory[]
  total_stories?: number
  completed_stories?: number
  // Legacy sprint-based format
  current_sprint?: number
  sprints?: { number: number, goal: string, status: string, stories: { id: string, status: string }[] }[]
  // BMAD development_status format (flat map)
  development_status?: Record<string, string>
  story_location?: string
}

function mapStoryStatus(status: string): StoryStatus {
  const mapping: Record<string, StoryStatus> = {
    'completed': 'done',
    'done': 'done',
    'in-progress': 'in_progress',
    'in_progress': 'in_progress',
    'ready-for-dev': 'todo',
    'ready_for_dev': 'todo',
    'todo': 'todo',
    'pending': 'todo',
    'blocked': 'blocked',
    'ready-for-review': 'ready_for_review',
    'ready_for_review': 'ready_for_review'
  }
  return mapping[status] || 'todo'
}

function mapEpicStatus(status: string): SprintStatus {
  const mapping: Record<string, SprintStatus> = {
    'completed': 'completed',
    'done': 'completed',
    'in-progress': 'active',
    'in_progress': 'active',
    'active': 'active',
    'pending': 'planned',
    'planned': 'planned',
    'backlog': 'planned'
  }
  return mapping[status] || 'planned'
}

function titleFromFilename(file: string): string {
  return file
    .replace('.md', '')
    .replace(/^story-[\d]+-[\d]+-/, '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
}

export function useBmadParser() {
  function parseSprintStatus(yamlContent: string): { currentSprint: number, sprints: Sprint[] } {
    const raw = yaml.load(yamlContent) as RawSprintStatus | null
    if (!raw) {
      return { currentSprint: 0, sprints: [] }
    }

    // New epic-based format (epics map + stories array)
    if (raw.epics && raw.stories) {
      const sprints: Sprint[] = Object.entries(raw.epics).map(([key, epic]) => {
        const epicNum = parseInt(key.replace('epic-', ''))
        const epicStories = raw.stories!
          .filter(s => s.epic === epicNum)
          .map(s => ({
            id: String(s.id),
            title: titleFromFilename(s.file || ''),
            epic: epic.name,
            status: mapStoryStatus(s.status),
            priority: 'medium' as const,
            estimate: 0,
            filePath: s.file || ''
          }))

        return {
          number: epicNum,
          goal: epic.name,
          status: mapEpicStatus(epic.status),
          stories: epicStories,
          branch: epic.branch
        }
      })

      const active = sprints.findIndex(s => s.status === 'active')
      return { currentSprint: active >= 0 ? sprints[active]!.number : 0, sprints }
    }

    // BMAD development_status format (flat map: epic-N, N-M-slug keys)
    if (raw.development_status && typeof raw.development_status === 'object') {
      const devStatus = raw.development_status
      const storyLocation = raw.story_location || '_bmad-output/implementation-artifacts'
      const epicMap = new Map<number, { status: string, stories: Story[] }>()

      for (const [key, status] of Object.entries(devStatus)) {
        if (key.endsWith('-retrospective')) continue

        const epicMatch = key.match(/^epic-(\d+)$/)
        if (epicMatch) {
          const num = parseInt(epicMatch[1]!)
          if (!epicMap.has(num)) epicMap.set(num, { status, stories: [] })
          else epicMap.get(num)!.status = status
          continue
        }

        const storyMatch = key.match(/^(\d+)-(\d+)-(.+)$/)
        if (storyMatch) {
          const epicNum = parseInt(storyMatch[1]!)
          const storyNum = parseInt(storyMatch[2]!)
          const slug = storyMatch[3]!
          if (!epicMap.has(epicNum)) epicMap.set(epicNum, { status: 'in-progress', stories: [] })
          epicMap.get(epicNum)!.stories.push({
            id: `${epicNum}.${storyNum}`,
            title: slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
            epic: `Epic ${epicNum}`,
            status: mapStoryStatus(status),
            priority: 'medium',
            estimate: 0,
            filePath: `${storyLocation}/${key}.md`
          })
        }
      }

      const sprints: Sprint[] = Array.from(epicMap.entries())
        .sort(([a], [b]) => a - b)
        .map(([num, data]) => ({
          number: num,
          goal: `Epic ${num}`,
          status: mapEpicStatus(data.status),
          stories: data.stories.sort((a, b) => a.id.localeCompare(b.id))
        }))

      const active = sprints.findIndex(s => s.status === 'active')
      return { currentSprint: active >= 0 ? sprints[active]!.number : 0, sprints }
    }

    // Legacy sprint-based format
    if (Array.isArray(raw.sprints)) {
      return {
        currentSprint: raw.current_sprint ?? 0,
        sprints: raw.sprints.map(s => ({
          number: s.number ?? 0,
          goal: s.goal ?? '',
          status: (s.status ?? 'planned') as SprintStatus,
          stories: Array.isArray(s.stories)
            ? s.stories.map(st => ({
                id: st.id ?? '',
                title: st.id ?? '',
                epic: '',
                status: mapStoryStatus(st.status),
                priority: 'medium' as const,
                estimate: 0,
                filePath: ''
              }))
            : []
        }))
      }
    }

    return { currentSprint: 0, sprints: [] }
  }

  function parseStory(markdown: string, filePath: string): Story {
    // Try YAML frontmatter first
    const { data, content } = parseFrontmatter<Record<string, unknown>>(markdown)
    if (data.id || data.title) {
      return {
        id: String(data.id || ''),
        title: String(data.title || ''),
        epic: String(data.epic || ''),
        status: mapStoryStatus(String(data.status || 'todo')),
        priority: (String(data.priority || 'medium')) as Story['priority'],
        estimate: Number(data.estimate) || 0,
        assignee: data.assignee ? String(data.assignee) : undefined,
        content,
        filePath
      }
    }

    // Parse Markdown header format: "# Story X.Y: Title"
    const lines = markdown.split('\n')
    const headerMatch = lines[0]?.match(/^#\s+Story\s+([\d.]+):\s*(.+)/)
    const statusLine = lines.find(l => /^Status:\s+/i.test(l.trim()))
    const statusValue = statusLine?.replace(/^Status:\s+/i, '').trim() || 'todo'

    const id = headerMatch?.[1] || filePath.match(/story-([\d]+)-([\d]+)/)?.[0]?.replace('story-', '') || ''
    const title = headerMatch?.[2]?.trim() || titleFromFilename(filePath.split('/').pop() || '')

    // Content starts after the Status line
    const statusIdx = lines.findIndex(l => /^Status:\s+/i.test(l.trim()))
    const bodyContent = statusIdx >= 0
      ? lines.slice(statusIdx + 1).join('\n').trim()
      : markdown

    return {
      id,
      title,
      epic: '',
      status: mapStoryStatus(statusValue),
      priority: 'medium',
      estimate: 0,
      content: bodyContent,
      filePath
    }
  }

  function parseEpic(markdown: string, filePath: string, stories: Story[] = []): Epic {
    const { content } = parseFrontmatter(markdown)
    const lines = content.split('\n')
    const titleLine = lines.find(l => l.startsWith('# '))
    const title = titleLine ? titleLine.replace(/^#\s+/, '') : filePath.split('/').pop()?.replace('.md', '') || ''
    const description = lines
      .filter(l => !l.startsWith('#') && l.trim().length > 0)
      .slice(0, 3)
      .join(' ')

    const id = filePath.match(/epic-(\d+)/)?.[0]?.toUpperCase().replace('-', '-') || ''

    return {
      id: `E-${id.replace('EPIC-', '')}`,
      title,
      description,
      stories,
      filePath
    }
  }

  function buildDocumentTree(files: { path: string, type: 'file' | 'directory', source?: 'bmad' | 'wds' }[]): BmadDocument[] {
    const root: BmadDocument[] = []
    const map = new Map<string, BmadDocument>()

    const sorted = [...files].sort((a, b) => a.path.localeCompare(b.path))

    for (const file of sorted) {
      const parts = file.path.split('/')
      const name = parts[parts.length - 1] || file.path
      const doc: BmadDocument = {
        name,
        path: file.path,
        type: file.type,
        ...(file.source ? { source: file.source } : {}),
        ...(file.type === 'directory' ? { children: [] } : {})
      }
      map.set(file.path, doc)

      const parentPath = parts.slice(0, -1).join('/')
      const parent = map.get(parentPath)
      if (parent && parent.children) {
        parent.children.push(doc)
      } else {
        root.push(doc)
      }
    }

    return root
  }

  return {
    parseSprintStatus,
    parseStory,
    parseEpic,
    buildDocumentTree
  }
}
