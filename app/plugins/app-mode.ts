export default defineNuxtPlugin(async () => {
  const { fetchMode } = useAppMode()
  await fetchMode()
})
