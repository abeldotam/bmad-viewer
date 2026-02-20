import type { H3Event } from 'h3'

export async function getAuthUser(event: H3Event): Promise<{ id: string } | null> {
  const mode = getAppMode()

  if (mode === 'personal') {
    return { id: 'personal' }
  }

  if (mode === 'multiuser') {
    try {
      const session = await requireUserSession(event)
      return { id: String(session.user.id) }
    } catch {
      return null
    }
  }

  return null
}
