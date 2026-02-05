import type { BmadDocument } from '~~/shared/types/bmad'

export function useGitHub() {
  const api = useApi()

  async function fetchDocumentTree(repoId: string): Promise<BmadDocument[]> {
    const files = await api<{ path: string, type: 'file' | 'directory' }[]>('/api/github/tree', {
      params: { repoId }
    })

    const { buildDocumentTree } = useBmadParser()
    return buildDocumentTree(files)
  }

  async function fetchFileContent(repoId: string, path: string, noCache = false): Promise<string> {
    const data = await api<{ content: string, fromCache: boolean }>('/api/github/contents', {
      params: { repoId, path, ...(noCache && { noCache: 'true' }) }
    })
    return data.content
  }

  async function fetchSprintStatus(repoId: string, noCache = false) {
    const paths = [
      '_bmad-output/implementation-artifacts/sprint-status.yaml',
      '_bmad-output/sprint-status.yaml'
    ]
    for (const path of paths) {
      try {
        const content = await fetchFileContent(repoId, path, noCache)
        const { parseSprintStatus } = useBmadParser()
        const result = parseSprintStatus(content)

        // Resolve story filePaths to full paths relative to sprint-status.yaml
        const dir = path.substring(0, path.lastIndexOf('/'))
        for (const sprint of result.sprints) {
          for (const story of sprint.stories) {
            if (story.filePath && !story.filePath.includes('/')) {
              story.filePath = `${dir}/${story.filePath}`
            }
          }
        }

        return result
      } catch (e: unknown) {
        if (e && typeof e === 'object' && 'statusCode' in e && (e as { statusCode: number }).statusCode === 403) {
          throw e
        }
        continue
      }
    }
    return { currentSprint: 0, sprints: [] }
  }

  async function fetchStories(repoId: string, storyPaths: string[]) {
    const { parseStory } = useBmadParser()
    const results = await Promise.allSettled(
      storyPaths.map(async (path) => {
        const content = await fetchFileContent(repoId, path)
        return parseStory(content, path)
      })
    )
    return results
      .filter((r): r is PromiseFulfilledResult<ReturnType<typeof parseStory>> => r.status === 'fulfilled')
      .map(r => r.value)
  }

  return {
    fetchDocumentTree,
    fetchFileContent,
    fetchSprintStatus,
    fetchStories
  }
}
