import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import * as schema from '../database/schema'

let _db: ReturnType<typeof drizzle> | null = null

export function useDatabase() {
  if (_db) return _db

  const dbPath = process.env.DATABASE_PATH || 'data/bmad-viewer.db'
  mkdirSync(dirname(dbPath), { recursive: true })

  const sqlite = new Database(dbPath)
  sqlite.pragma('journal_mode = WAL')
  sqlite.pragma('foreign_keys = ON')

  // Auto-create tables
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS repositories (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      owner TEXT NOT NULL,
      name TEXT NOT NULL,
      default_branch TEXT,
      last_synced_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(user_id, owner, name)
    );

    CREATE TABLE IF NOT EXISTS cached_files (
      id TEXT PRIMARY KEY,
      repository_id TEXT NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
      path TEXT NOT NULL,
      content TEXT,
      sha TEXT,
      cached_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(repository_id, path)
    );
  `)

  _db = drizzle(sqlite, { schema })
  return _db
}
