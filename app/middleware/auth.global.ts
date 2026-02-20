export default defineNuxtRouteMiddleware((to) => {
  const { mode } = useAppMode()

  // Unconfigured: redirect everything to /setup
  if (mode.value === 'unconfigured') {
    if (to.path !== '/setup' && to.path !== '/') return navigateTo('/setup')
    return
  }

  // Personal mode: no auth needed
  if (mode.value === 'personal') {
    if (to.path === '/setup' || to.path === '/login' || to.path === '/register') {
      return navigateTo('/dashboard')
    }
    return
  }

  // Multi-user mode: protect routes behind auth
  const publicRoutes = ['/', '/login', '/setup', '/auth/github']
  if (publicRoutes.includes(to.path)) return

  const { loggedIn } = useUserSession()
  if (!loggedIn.value) {
    return navigateTo('/login')
  }
})
