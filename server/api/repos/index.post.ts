import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const body = await readBody<{ owner: string, name: string, token?: string }>(event)

  if (!body.owner || !body.name) {
    throw createError({ statusCode: 400, statusMessage: 'owner and name are required' })
  }

  if (body.token) {
    try {
      const octokit = createOctokit(body.token)
      await octokit.rest.repos.get({ owner: body.owner, repo: body.name })
    } catch {
      throw createError({ statusCode: 400, statusMessage: 'Invalid token or repository not accessible' })
    }
  }

  const encryptedToken = body.token ? encrypt(body.token) : null

  const supabase = useServerSupabase(event)
  const { data, error } = await supabase
    .from('repositories')
    .insert({
      user_id: user.id,
      owner: body.owner,
      name: body.name,
      github_token_encrypted: encryptedToken
    })
    .select('id, owner, name, last_synced_at, created_at')
    .single()

  if (error) {
    if (error.code === '23505') {
      throw createError({ statusCode: 409, statusMessage: 'Repository already exists' })
    }
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return {
    id: data.id,
    owner: data.owner,
    name: data.name,
    lastSyncedAt: data.last_synced_at,
    createdAt: data.created_at
  }
})
