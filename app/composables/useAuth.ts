export function useAuth() {
  const { mode } = useAppMode()
  const { loggedIn, user, clear } = useUserSession()

  const isAuthenticated = computed(() => {
    if (mode.value === 'personal') return true
    return loggedIn.value
  })

  const displayName = computed(() => {
    if (mode.value === 'personal') return 'Personal'
    return user.value?.name || user.value?.login || 'User'
  })

  const avatarUrl = computed(() => {
    if (mode.value === 'personal') return undefined
    return user.value?.avatarUrl
  })

  async function logout() {
    await clear()
    await navigateTo('/login')
  }

  return {
    isAuthenticated,
    user,
    displayName,
    avatarUrl,
    logout
  }
}
