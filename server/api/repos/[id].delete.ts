export default defineEventHandler(async (event) => {
  const user = await getAuthUser(event)
  if (!user?.id) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Repository ID is required' })

  const supabase = useServerSupabase(event)
  const { error } = await supabase
    .from('repositories')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })

  return { success: true }
})
