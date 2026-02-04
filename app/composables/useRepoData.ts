import type { BmadDocument, Sprint, Story, Epic } from '~~/shared/types/bmad'

interface RepoData {
  documents: Ref<BmadDocument[]>
  sprints: Ref<Sprint[]>
  stories: Ref<Story[]>
  epics: Ref<Epic[]>
  loading: Ref<boolean>
  fetchFileContent: (path: string) => Promise<string>
}

const REPO_DATA_KEY = 'repoData' as const

export function useRepoData(): RepoData {
  return inject<RepoData>(REPO_DATA_KEY)!
}

export function provideRepoData(repoId: Ref<string | null>) {
  const { fetchDocumentTree, fetchSprintStatus, fetchFileContent: rawFetchFileContent } = useGitHub()
  const { handleError } = useErrorHandler()

  const documents = ref<BmadDocument[]>([])
  const sprints = ref<Sprint[]>([])
  const stories = ref<Story[]>([])
  const epics = ref<Epic[]>([])
  const loading = ref(true)

  async function fetchFileContent(path: string): Promise<string> {
    return rawFetchFileContent(repoId.value!, path)
  }

  async function loadAll() {
    if (!repoId.value) return
    loading.value = true
    try {
      const [tree, sprintData] = await Promise.all([
        fetchDocumentTree(repoId.value!),
        fetchSprintStatus(repoId.value!)
      ])

      documents.value = tree
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
      handleError(e, 'Failed to load repository data')
    } finally {
      loading.value = false
    }
  }

  watch(repoId, (id) => {
    if (id) loadAll()
  }, { immediate: true })

  const data: RepoData = {
    documents,
    sprints,
    stories,
    epics,
    loading,
    fetchFileContent
  }

  provide(REPO_DATA_KEY, data)

  return data
}
