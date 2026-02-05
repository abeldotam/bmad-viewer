export default defineEventHandler(async (event) => {
  const user = await getAuthUser(event)
  if (!user?.id) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const supabase = useServerSupabase(event)
  const { data, error } = await supabase
    .from('repositories')
    .select('id, owner, name, default_branch, last_synced_at, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })

  return (data ?? []).map((r: Record<string, unknown>) => ({
    id: r.id,
    owner: r.owner,
    name: r.name,
    defaultBranch: r.default_branch ?? 'main',
    lastSyncedAt: r.last_synced_at,
    createdAt: r.created_at
  }))
})
