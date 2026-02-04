export function useAuth() {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  async function login(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    await navigateTo('/dashboard')
  }

  async function register(email: string, password: string) {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    await navigateTo('/dashboard')
  }

  async function loginWithGithub() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${useRequestURL().origin}/auth/callback`
      }
    })
    if (error) throw error
  }

  async function logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    await navigateTo('/login')
  }

  return {
    user,
    login,
    register,
    loginWithGithub,
    logout
  }
}
