import type { AppMode } from '~~/server/utils/mode'

export function useAppMode() {
  const mode = useState<AppMode>('appMode', () => 'unconfigured')
  const loaded = useState('appModeLoaded', () => false)
  const localRepoSlug = useState<string>('localRepoSlug', () => '')

  async function fetchMode() {
    if (loaded.value) return mode.value
    const data = await $fetch<{ appMode: AppMode, localRepoSlug?: string }>('/api/_config')
    mode.value = data.appMode
    if (data.localRepoSlug) {
      localRepoSlug.value = data.localRepoSlug
    }
    loaded.value = true
    return data.appMode
  }

  return {
    mode: readonly(mode),
    loaded: readonly(loaded),
    localRepoSlug: readonly(localRepoSlug),
    fetchMode
  }
}
