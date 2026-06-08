export function useLocalRepo() {
  const config = useRuntimeConfig()

  function isLocalRepo(owner: string, repo: string): boolean {
    if (!config.localRepoSlug) return false
    return `${owner}/${repo}` === config.localRepoSlug
  }

  return {
    isLocalRepo,
    localRepoSlug: config.localRepoSlug as string
  }
}
