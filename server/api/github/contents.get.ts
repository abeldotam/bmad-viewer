const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

export default defineEventHandler(async (event) => {
  const user = await getAuthUser(event)
  if (!user?.id) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const query = getQuery(event)
  const repoId = query.repoId as string
  const path = query.path as string
  const noCache = query.noCache === 'true'

  if (!repoId || !path) {
    throw createError({ statusCode: 400, statusMessage: 'repoId and path are required' })
  }

  const supabase = useServerSupabase(event)

  const { data: cached } = await supabase
    .from('cached_files')
    .select('content, sha, cached_at')
    .eq('repository_id', repoId)
    .eq('path', path)
    .single()

  // Return fresh cache if TTL not expired and not forced refresh
  if (!noCache && cached?.content && cached.cached_at) {
    const age = Date.now() - new Date(cached.cached_at).getTime()
    if (age < CACHE_TTL_MS) {
      return { content: cached.content, fromCache: true }
    }
  }

  const { data: repo, error: repoError } = await supabase
    .from('repositories')
    .select('owner, name, github_token_encrypted')
    .eq('id', repoId)
    .eq('user_id', user.id)
    .single()

  if (repoError || !repo) throw createError({ statusCode: 404, statusMessage: 'Repository not found' })

  const token = repo.github_token_encrypted ? decrypt(repo.github_token_encrypted as string) : ''
  const octokit = createOctokit(token)

  try {
    const content = await getFileContent(octokit, repo.owner as string, repo.name as string, path)

    await supabase
      .from('cached_files')
      .upsert({
        repository_id: repoId,
        path,
        content,
        cached_at: new Date().toISOString()
      }, { onConflict: 'repository_id,path' })

    return { content, fromCache: false }
  } catch (e) {
    if (isGitHubAuthError(e)) {
      throw createError({ statusCode: 403, statusMessage: 'GitHub token invalid or expired' })
    }
    if (cached?.content) {
      return { content: cached.content, fromCache: true }
    }
    throw createError({ statusCode: 404, statusMessage: 'File not found' })
  }
})
