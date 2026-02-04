import type { H3Event } from 'h3'
import { getHeader } from 'h3'

export async function getAuthUser(event: H3Event) {
  const authHeader = getHeader(event, 'Authorization')
  if (!authHeader?.startsWith('Bearer ')) return null

  const token = authHeader.substring(7)
  const supabase = useServerSupabase(event)
  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) return null

  return user
}
