import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const query = getQuery(event)
  const repoId = query.repoId as string
  const storyId = query.storyId as string

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

  const labels = storyId ? `story: ${storyId}` : 'bmad-comment'

  const { data: issues } = await octokit.rest.issues.listForRepo({
    owner: repo.owner,
    repo: repo.name,
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
