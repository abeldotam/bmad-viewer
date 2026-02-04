export default defineNuxtRouteMiddleware(async (to) => {
  const publicRoutes = ['/', '/login', '/register', '/auth/callback']
  if (publicRoutes.includes(to.path)) return

  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  // In SPA mode, session may not be restored yet — force a check
  if (!user.value) {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return navigateTo('/login')
    }
  }
})
