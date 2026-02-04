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

  async function fetchFileContent(repoId: string, path: string): Promise<string> {
    const data = await api<{ content: string, fromCache: boolean }>('/api/github/contents', {
      params: { repoId, path }
    })
    return data.content
  }

  async function fetchSprintStatus(repoId: string) {
    try {
      const content = await fetchFileContent(repoId, '_bmad-output/sprint-status.yaml')
      const { parseSprintStatus } = useBmadParser()
      return parseSprintStatus(content)
    } catch {
      return { currentSprint: 0, sprints: [] }
    }
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
