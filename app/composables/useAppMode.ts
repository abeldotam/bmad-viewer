import type { AppMode } from '~~/server/utils/mode'

export function useAppMode() {
  const mode = useState<AppMode>('appMode', () => 'unconfigured')
  const loaded = useState('appModeLoaded', () => false)

  async function fetchMode() {
    if (loaded.value) return mode.value
    const { appMode } = await $fetch<{ appMode: AppMode }>('/api/_config')
    mode.value = appMode
    loaded.value = true
    return appMode
  }

  return {
    mode: readonly(mode),
    loaded: readonly(loaded),
    fetchMode
  }
}
