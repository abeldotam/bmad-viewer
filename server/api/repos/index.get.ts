import { eq } from 'drizzle-orm'
import { repositories } from '~~/server/database/schema'

export default defineEventHandler(async (event) => {
  const user = await getAuthUser(event)
  if (!user?.id) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const db = useDatabase()
  const data = db.select().from(repositories)
    .where(eq(repositories.userId, user.id))
    .orderBy(repositories.createdAt)
    .all()
    .reverse()

  return data.map((r: typeof data[number]) => ({
    id: r.id,
    owner: r.owner,
    name: r.name,
    defaultBranch: r.defaultBranch ?? null,
    lastSyncedAt: r.lastSyncedAt,
    createdAt: r.createdAt
  }))
})
