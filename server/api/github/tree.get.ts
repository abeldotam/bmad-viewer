import { and, eq } from 'drizzle-orm'
import { repositories } from '~~/server/database/schema'

export default defineEventHandler(async (event) => {
  const user = await getAuthUser(event)
  if (!user?.id) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const query = getQuery(event)
  const repoId = query.repoId as string

  if (!repoId) throw createError({ statusCode: 400, statusMessage: 'repoId is required' })

  const db = useDatabase()
  const repo = db.select().from(repositories)
    .where(and(eq(repositories.id, repoId), eq(repositories.userId, user.id)))
    .get()

  if (!repo) throw createError({ statusCode: 404, statusMessage: 'Repository not found' })

  const token = await getGitHubToken(event)
  const octokit = createOctokit(token)
  const branch = repo.defaultBranch || undefined

  try {
    return await listBmadFiles(octokit, repo.owner, repo.name, branch)
  } catch (e) {
    if (isGitHubAuthError(e)) {
      throw createError({ statusCode: 403, statusMessage: 'GitHub token invalid or expired' })
    }
    throw e
  }
})
