import type { BmadDocument, Sprint, Story, Epic, PullRequest } from '~~/shared/types/bmad'

interface RepoData {
  documents: Ref<BmadDocument[]>
  sprints: Ref<Sprint[]>
  stories: Ref<Story[]>
  epics: Ref<Epic[]>
  loading: Ref<boolean>
  syncing: Ref<boolean>
  tokenError: Ref<boolean>
  fetchFileContent: (path: string) => Promise<string>
  refresh: () => Promise<void>
}

const REPO_DATA_KEY = 'repoData' as const

export function useRepoData(): RepoData {
  return inject<RepoData>(REPO_DATA_KEY)!
}

function isStatusCode(e: unknown, code: number): boolean {
  return !!e && typeof e === 'object' && 'statusCode' in e && (e as { statusCode: number }).statusCode === code
}

export function provideRepoData(owner: Ref<string>, repo: Ref<string>) {
  const { fetchDocumentTree, fetchSprintStatus, fetchFileContent: rawFetchFileContent } = useGitHub()
  const api = useApi()
  const { handleError } = useErrorHandler()

  const documents = ref<BmadDocument[]>([])
  const sprints = ref<Sprint[]>([])
  const stories = ref<Story[]>([])
  const epics = ref<Epic[]>([])
  const loading = ref(true)
  const syncing = ref(false)
  const tokenError = ref(false)

  async function fetchFileContent(path: string): Promise<string> {
    return rawFetchFileContent(owner.value, repo.value, path)
  }

  async function fetchPulls(): Promise<PullRequest[]> {
    try {
      return await api<PullRequest[]>('/api/github/pulls', { params: { owner: owner.value, repo: repo.value } })
    } catch (e) {
      if (isStatusCode(e, 403)) throw e
      return []
    }
  }

  async function loadAll() {
    if (!owner.value || !repo.value) return
    loading.value = true
    tokenError.value = false
    try {
      const [tree, sprintData, pulls] = await Promise.all([
        fetchDocumentTree(owner.value, repo.value),
        fetchSprintStatus(owner.value, repo.value),
        fetchPulls()
      ])

      documents.value = tree

      // Match PRs to sprints/epics by branch name
      const prByBranch = new Map<string, PullRequest>()
      for (const pr of pulls) {
        prByBranch.set(pr.headBranch, pr)
      }

      for (const sprint of sprintData.sprints) {
        if (sprint.branch) {
          sprint.pr = prByBranch.get(sprint.branch) ?? null
        }
        // Update epic status based on PR state
        if (sprint.pr?.state === 'open' || sprint.pr?.state === 'draft') {
          sprint.status = 'active'
        }
      }

      sprints.value = sprintData.sprints
      stories.value = sprintData.sprints.flatMap(s => s.stories)

      // Build epics from sprints
      epics.value = sprintData.sprints.map(s => ({
        id: s.goal,
        title: s.goal,
        description: '',
        stories: s.stories,
        filePath: ''
      }))
    } catch (e) {
      if (isStatusCode(e, 403)) {
        tokenError.value = true
      }
      handleError(e, 'Failed to load repository data')
    } finally {
      loading.value = false
    }
  }

  async function refresh() {
    syncing.value = true
    try {
      await loadAll()
    } finally {
      syncing.value = false
    }
  }

  watch([owner, repo], ([o, r]) => {
    if (o && r) loadAll()
  }, { immediate: true })

  const data: RepoData = {
    documents,
    sprints,
    stories,
    epics,
    loading,
    syncing,
    tokenError,
    fetchFileContent,
    refresh
  }

  provide(REPO_DATA_KEY, data)

  return data
}
