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

  const token = repo.github_token_encrypted ? decrypt(repo.github_token_encrypted as string) : ''
  const octokit = createOctokit(token)

  try {
    const files = await listBmadFiles(octokit, repo.owner as string, repo.name as string)
    return files
  } catch (e) {
    if (isGitHubAuthError(e)) {
      throw createError({ statusCode: 403, statusMessage: 'GitHub token invalid or expired' })
    }
    throw e
  }
})
