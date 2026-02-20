import { and, eq } from 'drizzle-orm'
import { repositories } from '~~/server/database/schema'

export default defineEventHandler(async (event) => {
  const user = await getAuthUser(event)
  if (!user?.id) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const body = await readBody<{ owner: string, name: string }>(event)

  if (!body.owner || !body.name) {
    throw createError({ statusCode: 400, statusMessage: 'owner and name are required' })
  }

  // Validate repo access with the user's token
  const token = await getGitHubToken(event)
  let defaultBranch: string | null = null
  try {
    const octokit = createOctokit(token)
    const { data: repoInfo } = await octokit.rest.repos.get({ owner: body.owner, repo: body.name })
    defaultBranch = repoInfo.default_branch
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'Repository not accessible. Check that the repo exists and your token has access.' })
  }

  const db = useDatabase()

  // Check for duplicates
  const existing = db.select().from(repositories)
    .where(and(
      eq(repositories.userId, user.id),
      eq(repositories.owner, body.owner),
      eq(repositories.name, body.name)
    ))
    .get()

  if (existing) {
    throw createError({ statusCode: 409, statusMessage: 'Repository already exists' })
  }

  const inserted = db.insert(repositories).values({
    userId: user.id,
    owner: body.owner,
    name: body.name,
    defaultBranch
  }).returning().get()

  return {
    id: inserted.id,
    owner: inserted.owner,
    name: inserted.name,
    defaultBranch: inserted.defaultBranch,
    lastSyncedAt: inserted.lastSyncedAt,
    createdAt: inserted.createdAt
  }
})
