export type AppMode = 'personal' | 'multiuser' | 'unconfigured'

export function getAppMode(): AppMode {
  const config = useRuntimeConfig()
  if (config.githubClientId && config.githubClientSecret) {
    return 'multiuser'
  }
  if (config.githubToken) {
    return 'personal'
  }
  return 'unconfigured'
}
