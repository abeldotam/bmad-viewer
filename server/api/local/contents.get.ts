import { readFile } from 'node:fs/promises'
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
    throw createError({ statusCode: 404, statusMessage: 'File not found' })
  }

  try {
    const content = await readFile(normalizedPath, 'utf-8')
    return { content }
  } catch {
    throw createError({ statusCode: 500, statusMessage: 'Failed to read file' })
  }
})
