export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const owner = query.owner as string
  const repo = query.repo as string

  validateOwnerRepo(owner, repo)

  const token = await getGitHubToken(event)
  const octokit = createOctokit(token)

  try {
    const { data: repoInfo } = await octokit.rest.repos.get({ owner, repo })
    return {
      owner: repoInfo.owner.login,
      name: repoInfo.name,
      defaultBranch: repoInfo.default_branch
    }
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'Repository not accessible. Check that the repo exists and your token has access.' })
  }
})
