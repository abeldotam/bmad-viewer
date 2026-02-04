import yaml from 'js-yaml'
import { parseFrontmatter } from '~/utils/yamlFrontmatter'
import type { Story, Epic, Sprint, BmadDocument, StoryStatus, SprintStatus } from '~~/shared/types/bmad'

interface RawSprintStory {
  id: string
  status: string
}

interface RawSprint {
  number: number
  goal: string
  status: string
  stories: RawSprintStory[]
}

interface RawSprintStatus {
  current_sprint: number
  sprints: RawSprint[]
}

interface StoryFrontmatter {
  id: string
  title: string
  epic: string
  status: string
  priority: string
  estimate: number
  assignee?: string
}

export function useBmadParser() {
  function parseSprintStatus(yamlContent: string): { currentSprint: number, sprints: Sprint[] } {
    const raw = yaml.load(yamlContent) as RawSprintStatus
    return {
      currentSprint: raw.current_sprint,
      sprints: raw.sprints.map(s => ({
        number: s.number,
        goal: s.goal,
        status: s.status as SprintStatus,
        stories: s.stories.map(st => ({
          id: st.id,
          title: st.id,
          epic: '',
          status: st.status as StoryStatus,
          priority: 'medium' as const,
          estimate: 0,
          filePath: ''
        }))
      }))
    }
  }

  function parseStory(markdown: string, filePath: string): Story {
    const { data, content } = parseFrontmatter<StoryFrontmatter>(markdown)
    return {
      id: data.id || '',
      title: data.title || '',
      epic: data.epic || '',
      status: (data.status || 'todo') as StoryStatus,
      priority: (data.priority || 'medium') as Story['priority'],
      estimate: data.estimate || 0,
      assignee: data.assignee,
      content,
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

  function buildDocumentTree(files: { path: string, type: 'file' | 'directory' }[]): BmadDocument[] {
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
