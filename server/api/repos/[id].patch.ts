import { and, eq } from 'drizzle-orm'
import { repositories } from '~~/server/database/schema'

export default defineEventHandler(async (event) => {
  const user = await getAuthUser(event)
  if (!user?.id) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Repository ID is required' })

  const body = await readBody<{ default_branch?: string | null }>(event)

  const updates: Record<string, string | null> = {
    last_synced_at: new Date().toISOString()
  }
  if (body && 'default_branch' in body) {
    updates.default_branch = body.default_branch || null
  }

  const db = useDatabase()
  db.update(repositories)
    .set({
      lastSyncedAt: updates.last_synced_at,
      ...(updates.default_branch !== undefined && { defaultBranch: updates.default_branch })
    })
    .where(and(eq(repositories.id, id), eq(repositories.userId, user.id)))
    .run()

  return { success: true }
})
