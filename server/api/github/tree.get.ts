export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const owner = query.owner as string
  const repo = query.repo as string
  const branch = query.branch as string | undefined

  if (!owner || !repo) throw createError({ statusCode: 400, statusMessage: 'owner and repo are required' })

  const token = await getGitHubToken(event)
  const octokit = createOctokit(token)

  try {
    return await listBmadFiles(octokit, owner, repo, branch || undefined)
  } catch (e) {
    if (isGitHubAuthError(e)) {
      throw createError({ statusCode: 403, statusMessage: 'GitHub token invalid or expired' })
    }
    throw e
  }
})
