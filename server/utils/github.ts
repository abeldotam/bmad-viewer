import { Octokit } from 'octokit'

export function createOctokit(token: string) {
  return new Octokit({ auth: token })
}

export async function getRepoContents(octokit: Octokit, owner: string, repo: string, path: string) {
  const { data } = await octokit.rest.repos.getContent({ owner, repo, path })
  return data
}

export async function getFileContent(octokit: Octokit, owner: string, repo: string, path: string): Promise<string> {
  const { data } = await octokit.rest.repos.getContent({ owner, repo, path })
  if (Array.isArray(data) || data.type !== 'file' || !('content' in data)) {
    throw new Error(`Path ${path} is not a file`)
  }
  return Buffer.from(data.content, 'base64').toString('utf-8')
}

export async function listBmadFiles(octokit: Octokit, owner: string, repo: string) {
  try {
    const { data } = await octokit.rest.git.getTree({
      owner,
      repo,
      tree_sha: 'HEAD',
      recursive: 'true'
    })

    return data.tree
      .filter(item => item.path?.startsWith('_bmad-output/'))
      .map(item => ({
        path: item.path!,
        type: item.type === 'tree' ? 'directory' as const : 'file' as const,
        sha: item.sha
      }))
  } catch {
    return []
  }
}
