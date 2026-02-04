import type { GitHubIssue, IssueType, Priority } from '~~/shared/types/bmad'

export function useGitHubIssues() {
  const api = useApi()

  async function createComment(repoId: string, storyId: string, epicId: string, comment: string) {
    const body = buildCommentIssueBody(storyId, epicId, comment)
    const labels = getCommentLabels(storyId, epicId)

    return await api('/api/github/issues', {
      method: 'POST',
      body: {
        repoId,
        title: `[BMAD Comment] ${storyId}: ${comment.slice(0, 50)}...`,
        body,
        labels
      }
    })
  }

  async function createNewStory(repoId: string, params: {
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
        repoId,
        title: `${prefix} ${params.title}`,
        body,
        labels
      }
    })
  }

  async function fetchLinkedIssues(repoId: string, storyId?: string): Promise<GitHubIssue[]> {
    return await api<GitHubIssue[]>('/api/github/issues', {
      params: { repoId, storyId }
    })
  }

  return {
    createComment,
    createNewStory,
    fetchLinkedIssues
  }
}
