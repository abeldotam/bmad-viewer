import { and, eq } from 'drizzle-orm'
import { repositories, cachedFiles } from '~~/server/database/schema'

const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

export default defineEventHandler(async (event) => {
  const user = await getAuthUser(event)
  if (!user?.id) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const query = getQuery(event)
  const repoId = query.repoId as string
  const path = query.path as string
  const noCache = query.noCache === 'true'

  if (!repoId || !path) {
    throw createError({ statusCode: 400, statusMessage: 'repoId and path are required' })
  }

  const db = useDatabase()

  // Check cache
  const cached = db.select().from(cachedFiles)
    .where(and(eq(cachedFiles.repositoryId, repoId), eq(cachedFiles.path, path)))
    .get()

  if (!noCache && cached?.content && cached.cachedAt) {
    const age = Date.now() - new Date(cached.cachedAt).getTime()
    if (age < CACHE_TTL_MS) {
      return { content: cached.content, fromCache: true }
    }
  }

  // Get repo
  const repo = db.select().from(repositories)
    .where(and(eq(repositories.id, repoId), eq(repositories.userId, user.id)))
    .get()

  if (!repo) throw createError({ statusCode: 404, statusMessage: 'Repository not found' })

  const token = await getGitHubToken(event)
  const octokit = createOctokit(token)
  const branch = repo.defaultBranch || undefined

  try {
    const content = await getFileContent(octokit, repo.owner, repo.name, path, branch)

    // Upsert cache
    if (cached) {
      db.update(cachedFiles)
        .set({ content, cachedAt: new Date().toISOString() })
        .where(and(eq(cachedFiles.repositoryId, repoId), eq(cachedFiles.path, path)))
        .run()
    } else {
      db.insert(cachedFiles).values({
        repositoryId: repoId,
        path,
        content,
        cachedAt: new Date().toISOString()
      }).run()
    }

    return { content, fromCache: false }
  } catch (e) {
    if (isGitHubAuthError(e)) {
      throw createError({ statusCode: 403, statusMessage: 'GitHub token invalid or expired' })
    }
    if (cached?.content) {
      return { content: cached.content, fromCache: true }
    }
    throw createError({ statusCode: 404, statusMessage: 'File not found' })
  }
})
