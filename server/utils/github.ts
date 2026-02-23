import { Octokit } from 'octokit'

export function isGitHubAuthError(e: unknown): boolean {
  return !!e && typeof e === 'object' && 'status' in e
    && ((e as { status: number }).status === 401 || (e as { status: number }).status === 403)
}

export function createOctokit(token: string) {
  return new Octokit({ auth: token })
}

export async function getRepoContents(octokit: Octokit, owner: string, repo: string, path: string) {
  const { data } = await octokit.rest.repos.getContent({ owner, repo, path })
  return data
}

export async function getFileContent(octokit: Octokit, owner: string, repo: string, path: string, ref?: string): Promise<string> {
  const { data } = await octokit.rest.repos.getContent({ owner, repo, path, ...(ref && { ref }) })
  if (Array.isArray(data) || data.type !== 'file' || !('content' in data)) {
    throw new Error(`Path ${path} is not a file`)
  }
  return Buffer.from(data.content, 'base64').toString('utf-8')
}

export async function listBmadFiles(octokit: Octokit, owner: string, repo: string, ref?: string) {
  try {
    const { data } = await octokit.rest.git.getTree({
      owner,
      repo,
      tree_sha: ref || 'HEAD',
      recursive: 'true'
    })

    // Check if this is a WDS project (has _wds/ folder)
    const hasWds = data.tree.some(item => item.path?.startsWith('_wds/'))

    const bmadFiles = data.tree
      .filter(item => item.path?.startsWith('_bmad-output/'))
      .map(item => ({
        path: item.path!,
        type: item.type === 'tree' ? 'directory' as const : 'file' as const,
        sha: item.sha,
        source: 'bmad' as const
      }))

    // Only include docs/ as WDS output if _wds/ folder exists
    const wdsFiles = hasWds
      ? data.tree
          .filter(item => item.path?.startsWith('docs/'))
          .map(item => ({
            path: item.path!,
            type: item.type === 'tree' ? 'directory' as const : 'file' as const,
            sha: item.sha,
            source: 'wds' as const
          }))
      : []

    return [...bmadFiles, ...wdsFiles]
  } catch (e) {
    if (isGitHubAuthError(e)) throw e
    return []
  }
}
