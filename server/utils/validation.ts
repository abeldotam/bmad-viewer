const OWNER_REPO_RE = /^[a-zA-Z0-9._-]+$/
const PATH_FORBIDDEN_SEGMENTS = ['..', '~']

export function validateOwnerRepo(owner: string, repo: string) {
  if (!owner || !repo) {
    throw createError({ statusCode: 400, statusMessage: 'owner and repo are required' })
  }
  if (!OWNER_REPO_RE.test(owner) || !OWNER_REPO_RE.test(repo)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid owner or repo format' })
  }
}

export function validatePath(path: string) {
  if (!path) {
    throw createError({ statusCode: 400, statusMessage: 'path is required' })
  }
  const segments = path.split('/')
  if (segments.some(s => PATH_FORBIDDEN_SEGMENTS.includes(s))) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid path' })
  }
}
