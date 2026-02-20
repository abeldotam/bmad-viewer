import { and, eq } from 'drizzle-orm'
import { repositories } from '~~/server/database/schema'

export default defineEventHandler(async (event) => {
  const user = await getAuthUser(event)
  if (!user?.id) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const query = getQuery(event)
  const repoId = query.repoId as string
  const storyId = query.storyId as string

  if (!repoId) throw createError({ statusCode: 400, statusMessage: 'repoId is required' })

  const db = useDatabase()
  const repo = db.select().from(repositories)
    .where(and(eq(repositories.id, repoId), eq(repositories.userId, user.id)))
    .get()

  if (!repo) throw createError({ statusCode: 404, statusMessage: 'Repository not found' })

  const token = await getGitHubToken(event)
  const octokit = createOctokit(token)

  const labels = storyId ? `story: ${storyId}` : 'bmad-comment'

  const { data: issues } = await octokit.rest.issues.listForRepo({
    owner: repo.owner,
    repo: repo.name,
    labels,
    state: 'all',
    per_page: 20
  })

  return issues.map(issue => ({
    id: issue.id,
    number: issue.number,
    title: issue.title,
    body: issue.body || '',
    state: issue.state,
    labels: issue.labels.map(l => typeof l === 'string' ? l : l.name || ''),
    htmlUrl: issue.html_url,
    createdAt: issue.created_at
  }))
})
