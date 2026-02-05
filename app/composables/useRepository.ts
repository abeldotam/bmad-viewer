import type { Repository } from '~~/shared/types/bmad'

export function useRepository() {
  const api = useApi()
  const repos = useState<Repository[]>('repos', () => [])
  const loading = useState('repos-loading', () => false)
  const { handleError } = useErrorHandler()

  async function fetchRepos() {
    loading.value = true
    try {
      const data = await api<Repository[]>('/api/repos')
      repos.value = data
    } catch (e: unknown) {
      handleError(e, 'Failed to load repositories')
    } finally {
      loading.value = false
    }
  }

  async function addRepo(owner: string, name: string, token?: string) {
    const data = await api<Repository>('/api/repos', {
      method: 'POST',
      body: { owner, name, token }
    })
    repos.value.unshift(data)
    return data
  }

  async function updateBranch(id: string, branch: string | null) {
    await api(`/api/repos/${id}`, {
      method: 'PATCH',
      body: { default_branch: branch }
    })
    const repo = repos.value.find(r => r.id === id)
    if (repo) repo.defaultBranch = branch
  }

  async function deleteRepo(id: string) {
    await api(`/api/repos/${id}`, { method: 'DELETE' })
    repos.value = repos.value.filter(r => r.id !== id)
  }

  return {
    repos,
    loading,
    fetchRepos,
    addRepo,
    updateBranch,
    deleteRepo
  }
}
