import { readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { existsSync } from 'node:fs'

const LOCAL_REPO_PATH = process.env.LOCAL_REPO_PATH || '/local-repo'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const path = query.path as string

  if (!path) {
    throw createError({ statusCode: 400, statusMessage: 'Missing path parameter' })
  }

  // Prevent path traversal attacks
  const normalizedPath = join(LOCAL_REPO_PATH, path)
  if (!normalizedPath.startsWith(LOCAL_REPO_PATH)) {
    throw createError({ statusCode: 403, statusMessage: 'Invalid path' })
  }

  if (!existsSync(normalizedPath)) {
    throw createError({ statusCode: 404, statusMessage: 'Directory not found' })
  }

  try {
    const entries = await readdir(normalizedPath, { withFileTypes: true })
    const files: { path: string, type: 'file' | 'directory', source?: 'bmad' | 'wds' }[] = []

    for (const entry of entries) {
      const fullPath = join(path, entry.name)
      if (entry.isDirectory()) {
        files.push({ path: fullPath, type: 'directory' })
      } else if (entry.isFile()) {
        files.push({ path: fullPath, type: 'file' })
      }
    }

    return files
  } catch {
    throw createError({ statusCode: 500, statusMessage: 'Failed to read directory' })
  }
})
