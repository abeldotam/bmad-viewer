import type { Repository } from '~~/shared/types/bmad'

const STORAGE_KEY = 'bmad-repos'

function loadFromStorage(): Repository[] {
  if (import.meta.server) return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveToStorage(repos: Repository[]) {
  if (import.meta.server) return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(repos))
}

export function useRepository() {
  const api = useApi()
  const repos = useState<Repository[]>('repos', () => [])
  const loading = useState('repos-loading', () => false)

  function fetchRepos() {
    repos.value = loadFromStorage()
  }

  async function addRepo(owner: string, name: string) {
    const data = await api<{ owner: string, name: string, defaultBranch: string }>('/api/github/validate', {
      params: { owner, repo: name }
    })

    const existing = repos.value.find(r => r.owner === data.owner && r.name === data.name)
    if (existing) {
      throw new Error('Repository already added')
    }

    const repo: Repository = {
      owner: data.owner,
      name: data.name,
      defaultBranch: data.defaultBranch
    }
    repos.value.unshift(repo)
    saveToStorage(repos.value)
    return repo
  }

  function updateBranch(owner: string, name: string, branch: string | null) {
    const repo = repos.value.find(r => r.owner === owner && r.name === name)
    if (repo) {
      repo.defaultBranch = branch
      saveToStorage(repos.value)
    }
  }

  function deleteRepo(owner: string, name: string) {
    repos.value = repos.value.filter(r => !(r.owner === owner && r.name === name))
    saveToStorage(repos.value)
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
