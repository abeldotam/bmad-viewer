export default defineEventHandler(async (event) => {
  const user = await getAuthUser(event)
  if (!user?.id) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const query = getQuery(event)
  const repoId = query.repoId as string

  if (!repoId) throw createError({ statusCode: 400, statusMessage: 'repoId is required' })

  const supabase = useServerSupabase(event)
  const { data: repo, error } = await supabase
    .from('repositories')
    .select('owner, name, github_token_encrypted')
    .eq('id', repoId)
    .eq('user_id', user.id)
    .single()

  if (error || !repo) throw createError({ statusCode: 404, statusMessage: 'Repository not found' })

  const token = repo.github_token_encrypted ? decrypt(repo.github_token_encrypted) : ''
  const octokit = createOctokit(token)

  try {
    const { data: pulls } = await octokit.rest.pulls.list({
      owner: repo.owner,
      repo: repo.name,
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
