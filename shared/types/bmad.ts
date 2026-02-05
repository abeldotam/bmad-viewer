export type StoryStatus = 'todo' | 'in_progress' | 'done' | 'blocked' | 'ready_for_review'

export type Priority = 'high' | 'medium' | 'low'

export type SprintStatus = 'active' | 'completed' | 'planned'

export type IssueType = 'comment' | 'feature' | 'bug' | 'improvement'

export interface Story {
  id: string
  title: string
  epic: string
  status: StoryStatus
  priority: Priority
  estimate: number
  assignee?: string
  content?: string
  filePath: string
}

export interface Epic {
  id: string
  title: string
  description: string
  stories: Story[]
  filePath: string
}

export type PullRequestState = 'open' | 'merged' | 'closed' | 'draft'

export interface PullRequest {
  number: number
  title: string
  state: PullRequestState
  htmlUrl: string
  headBranch: string
  updatedAt: string
}

export interface Sprint {
  number: number
  goal: string
  status: SprintStatus
  stories: Story[]
  branch?: string
  pr?: PullRequest | null
}

export interface BmadDocument {
  name: string
  path: string
  type: 'file' | 'directory'
  children?: BmadDocument[]
  content?: string
}

export interface Repository {
  id: string
  owner: string
  name: string
  defaultBranch: string | null
  lastSyncedAt: string | null
  createdAt: string
}

export interface CommentPayload {
  storyId: string
  epicId: string
  body: string
  repoOwner: string
  repoName: string
}

export interface NewStoryPayload {
  type: IssueType
  title: string
  description: string
  epic: string
  priority: Priority
  repoOwner: string
  repoName: string
}

export interface GitHubIssue {
  id: number
  number: number
  title: string
  body: string
  state: 'open' | 'closed'
  labels: string[]
  htmlUrl: string
  createdAt: string
}
