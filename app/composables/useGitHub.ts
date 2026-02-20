import type { BmadDocument } from '~~/shared/types/bmad'

export function useGitHub() {
  const api = useApi()

  async function fetchDocumentTree(owner: string, repo: string): Promise<BmadDocument[]> {
    const files = await api<{ path: string, type: 'file' | 'directory' }[]>('/api/github/tree', {
      params: { owner, repo }
    })

    const { buildDocumentTree } = useBmadParser()
    return buildDocumentTree(files)
  }

  async function fetchFileContent(owner: string, repo: string, path: string): Promise<string> {
    const data = await api<{ content: string }>('/api/github/contents', {
      params: { owner, repo, path }
    })
    return data.content
  }

  async function fetchSprintStatus(owner: string, repo: string) {
    const paths = [
      '_bmad-output/implementation-artifacts/sprint-status.yaml',
      '_bmad-output/sprint-status.yaml'
    ]
    for (const path of paths) {
      try {
        const content = await fetchFileContent(owner, repo, path)
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

  async function fetchStories(owner: string, repo: string, storyPaths: string[]) {
    const { parseStory } = useBmadParser()
    const results = await Promise.allSettled(
      storyPaths.map(async (path) => {
        const content = await fetchFileContent(owner, repo, path)
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
