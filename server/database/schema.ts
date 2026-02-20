import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

export const repositories = sqliteTable('repositories', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull(),
  owner: text('owner').notNull(),
  name: text('name').notNull(),
  defaultBranch: text('default_branch'),
  lastSyncedAt: text('last_synced_at'),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`)
})

export const cachedFiles = sqliteTable('cached_files', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  repositoryId: text('repository_id').notNull().references(() => repositories.id, { onDelete: 'cascade' }),
  path: text('path').notNull(),
  content: text('content'),
  sha: text('sha'),
  cachedAt: text('cached_at').notNull().default(sql`(datetime('now'))`)
})
