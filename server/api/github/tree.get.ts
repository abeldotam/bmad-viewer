export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const owner = query.owner as string
  const repo = query.repo as string
  const branch = query.branch as string | undefined

  validateOwnerRepo(owner, repo)

  const token = await getGitHubToken(event)
  const octokit = createOctokit(token)

  try {
    return await listBmadFiles(octokit, owner, repo, branch || undefined)
  } catch (e) {
    if (isGitHubAuthError(e)) {
      throw createError({ statusCode: 403, statusMessage: 'GitHub token invalid or expired' })
    }
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch repository tree' })
  }
})
