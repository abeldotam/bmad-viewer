export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const owner = query.owner as string
  const repo = query.repo as string
  const path = query.path as string
  const branch = query.branch as string | undefined

  validateOwnerRepo(owner, repo)
  validatePath(path)

  const token = await getGitHubToken(event)
  const octokit = createOctokit(token)

  try {
    const content = await getFileContent(octokit, owner, repo, path, branch || undefined)
    return { content }
  } catch (e) {
    if (isGitHubAuthError(e)) {
      throw createError({ statusCode: 403, statusMessage: 'GitHub token invalid or expired' })
    }
    throw createError({ statusCode: 404, statusMessage: 'File not found' })
  }
})
