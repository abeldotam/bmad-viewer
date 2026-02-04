import type { IssueType, Priority } from '~~/shared/types/bmad'

export function buildCommentIssueBody(storyId: string, epicId: string, comment: string): string {
  return `## BMAD Comment

**Story:** ${storyId}
**Epic:** ${epicId}

---

${comment}

---
*Created via BMAD Viewer*`
}

export function buildNewStoryIssueBody(params: {
  type: IssueType
  description: string
  epic: string
  priority: Priority
}): string {
  const typeLabel = params.type === 'bug' ? 'Bug Report' : params.type === 'improvement' ? 'Improvement' : 'New Story'

  return `## ${typeLabel}

**Epic:** ${params.epic}
**Priority:** ${params.priority}
**Type:** ${params.type}

---

${params.description}

---
*Created via BMAD Viewer*`
}

export function getCommentLabels(storyId: string, epicId: string): string[] {
  return ['bmad-comment', `story: ${storyId}`, `epic: ${epicId}`]
}

export function getNewStoryLabels(type: IssueType, priority: Priority): string[] {
  const typeLabel = type === 'bug' ? 'bmad-bug' : type === 'improvement' ? 'bmad-improvement' : 'bmad-new-story'
  return [typeLabel, 'bmad-pending', `priority: ${priority}`]
}
