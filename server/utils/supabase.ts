import type { H3Event } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useServerSupabase(event: H3Event): any {
  return serverSupabaseServiceRole(event)
}
