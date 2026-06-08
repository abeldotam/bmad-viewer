export default defineEventHandler(() => ({
  appMode: getAppMode(),
  localRepoSlug: useRuntimeConfig().localRepoSlug || ''
}))
