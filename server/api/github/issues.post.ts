import { and, eq } from 'drizzle-orm'
import { repositories } from '~~/server/database/schema'

export default defineEventHandler(async (event) => {
  const user = await getAuthUser(event)
  if (!user?.id) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const body = await readBody<{
    repoId: string
    title: string
    body: string
    labels: string[]
  }>(event)

  if (!body.repoId || !body.title || !body.body) {
    throw createError({ statusCode: 400, statusMessage: 'repoId, title, and body are required' })
  }

  const db = useDatabase()
  const repo = db.select().from(repositories)
    .where(and(eq(repositories.id, body.repoId), eq(repositories.userId, user.id)))
    .get()

  if (!repo) throw createError({ statusCode: 404, statusMessage: 'Repository not found' })

  const token = await getGitHubToken(event)
  if (!token) throw createError({ statusCode: 400, statusMessage: 'GitHub token required to create issues' })

  const octokit = createOctokit(token)

  const { data: issue } = await octokit.rest.issues.create({
    owner: repo.owner,
    repo: repo.name,
    title: body.title,
    body: body.body,
    labels: body.labels || []
  })

  return {
    id: issue.id,
    number: issue.number,
    title: issue.title,
    htmlUrl: issue.html_url
  }
})
