export type AppMode = 'personal' | 'multiuser' | 'unconfigured'

export function getAppMode(): AppMode {
  const config = useRuntimeConfig()
  if (config.oauth?.github?.clientId && config.oauth?.github?.clientSecret) {
    return 'multiuser'
  }
  if (config.githubToken) {
    return 'personal'
  }
  return 'unconfigured'
}
