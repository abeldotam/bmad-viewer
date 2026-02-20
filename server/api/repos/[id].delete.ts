import { and, eq } from 'drizzle-orm'
import { repositories } from '~~/server/database/schema'

export default defineEventHandler(async (event) => {
  const user = await getAuthUser(event)
  if (!user?.id) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Repository ID is required' })

  const db = useDatabase()
  db.delete(repositories)
    .where(and(eq(repositories.id, id), eq(repositories.userId, user.id)))
    .run()

  return { success: true }
})
