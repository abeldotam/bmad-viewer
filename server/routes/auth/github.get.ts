export default defineOAuthGitHubEventHandler({
  config: {
    scope: ['public_repo', 'read:user']
  },
  async onSuccess(event, { user, tokens }) {
    await setUserSession(event, {
      user: {
        id: user.id,
        login: user.login,
        name: user.name || user.login,
        avatarUrl: user.avatar_url
      },
      secure: {
        githubToken: tokens.access_token
      }
    })
    return sendRedirect(event, '/dashboard')
  },
  onError(event, error) {
    console.error('GitHub OAuth error:', error)
    return sendRedirect(event, '/login?error=oauth')
  }
})
