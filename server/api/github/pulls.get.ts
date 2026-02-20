export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const owner = query.owner as string
  const repo = query.repo as string

  if (!owner || !repo) throw createError({ statusCode: 400, statusMessage: 'owner and repo are required' })

  const token = await getGitHubToken(event)
  const octokit = createOctokit(token)

  try {
    const { data: pulls } = await octokit.rest.pulls.list({
      owner,
      repo,
      state: 'all',
      sort: 'updated',
      direction: 'desc',
      per_page: 50
    })

    return pulls.map(pr => ({
      number: pr.number,
      title: pr.title,
      state: pr.draft ? 'draft' : pr.merged_at ? 'merged' : pr.state,
      htmlUrl: pr.html_url,
      headBranch: pr.head.ref,
      updatedAt: pr.updated_at
    }))
  } catch (e) {
    if (isGitHubAuthError(e)) {
      throw createError({ statusCode: 403, statusMessage: 'GitHub token invalid or expired' })
    }
    throw e
  }
})
