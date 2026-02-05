export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      repositories: {
        Row: {
          id: string
          user_id: string
          owner: string
          name: string
          github_token_encrypted: string | null
          default_branch: string
          last_synced_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          owner: string
          name: string
          github_token_encrypted?: string | null
          default_branch?: string
          last_synced_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          owner?: string
          name?: string
          github_token_encrypted?: string | null
          default_branch?: string
          last_synced_at?: string | null
          created_at?: string
        }
      }
      cached_files: {
        Row: {
          id: string
          repository_id: string
          path: string
          content: string | null
          sha: string | null
          cached_at: string
        }
        Insert: {
          id?: string
          repository_id: string
          path: string
          content?: string | null
          sha?: string | null
          cached_at?: string
        }
        Update: {
          id?: string
          repository_id?: string
          path?: string
          content?: string | null
          sha?: string | null
          cached_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
