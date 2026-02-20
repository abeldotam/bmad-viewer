import type { GitHubIssue, IssueType, Priority } from '~~/shared/types/bmad'

export function useGitHubIssues() {
  const api = useApi()

  async function createComment(owner: string, repo: string, storyId: string, epicId: string, comment: string) {
    const body = buildCommentIssueBody(storyId, epicId, comment)
    const labels = getCommentLabels(storyId, epicId)

    return await api('/api/github/issues', {
      method: 'POST',
      body: {
        owner,
        repo,
        title: `[BMAD Comment] ${storyId}: ${comment.slice(0, 50)}...`,
        body,
        labels
      }
    })
  }

  async function createNewStory(owner: string, repo: string, params: {
    type: IssueType
    title: string
    description: string
    epic: string
    priority: Priority
  }) {
    const body = buildNewStoryIssueBody(params)
    const labels = getNewStoryLabels(params.type, params.priority)
    const prefix = params.type === 'bug' ? '[BMAD Bug]' : params.type === 'improvement' ? '[BMAD Improvement]' : '[NEW STORY]'

    return await api('/api/github/issues', {
      method: 'POST',
      body: {
        owner,
        repo,
        title: `${prefix} ${params.title}`,
        body,
        labels
      }
    })
  }

  async function fetchLinkedIssues(owner: string, repo: string, storyId?: string): Promise<GitHubIssue[]> {
    return await api<GitHubIssue[]>('/api/github/issues', {
      params: { owner, repo, storyId }
    })
  }

  return {
    createComment,
    createNewStory,
    fetchLinkedIssues
  }
}
