import type { H3Event } from 'h3'

export async function getGitHubToken(event: H3Event): Promise<string> {
  const mode = getAppMode()

  if (mode === 'personal') {
    const config = useRuntimeConfig()
    return config.githubToken
  }

  if (mode === 'multiuser') {
    const session = await requireUserSession(event)
    const token = session.user?.githubToken as string | undefined
    if (!token) {
      throw createError({ statusCode: 401, statusMessage: 'GitHub token missing from session. Please sign in again.' })
    }
    return token
  }

  throw createError({ statusCode: 500, statusMessage: 'Application not configured' })
}
