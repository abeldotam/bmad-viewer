export default defineEventHandler(async (event) => {
  const user = await getAuthUser(event)
  if (!user?.id) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Repository ID is required' })

  const body = await readBody<{ default_branch?: string | null }>(event)

  const updates: Record<string, string | null> = {
    last_synced_at: new Date().toISOString()
  }
  if (body && 'default_branch' in body) {
    updates.default_branch = body.default_branch || null
  }

  const supabase = useServerSupabase(event)
  const { error } = await supabase
    .from('repositories')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })

  return { success: true }
})
