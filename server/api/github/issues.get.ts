export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const owner = query.owner as string
  const repo = query.repo as string
  const storyId = query.storyId as string

  validateOwnerRepo(owner, repo)

  const token = await getGitHubToken(event)
  const octokit = createOctokit(token)

  const labels = storyId ? `story: ${storyId}` : 'bmad-comment'

  const { data: issues } = await octokit.rest.issues.listForRepo({
    owner,
    repo,
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
