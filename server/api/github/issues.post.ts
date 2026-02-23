export default defineEventHandler(async (event) => {
  const body = await readBody<{
    owner: string
    repo: string
    title: string
    body: string
    labels: string[]
  }>(event)

  validateOwnerRepo(body.owner, body.repo)
  if (!body.title || !body.body) {
    throw createError({ statusCode: 400, statusMessage: 'title and body are required' })
  }

  const token = await getGitHubToken(event)
  if (!token) throw createError({ statusCode: 400, statusMessage: 'GitHub token required to create issues' })

  const octokit = createOctokit(token)

  const { data: issue } = await octokit.rest.issues.create({
    owner: body.owner,
    repo: body.repo,
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
