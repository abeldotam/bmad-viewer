import type { Story, Sprint, Epic } from '~~/shared/types/bmad'

interface ProgressResult {
  total: number
  done: number
  percentage: number
}

export function useStoryStatus() {
  function computeProgress(stories: Story[]): ProgressResult {
    const total = stories.length
    const done = stories.filter(s => s.status === 'done').length
    return {
      total,
      done,
      percentage: total > 0 ? Math.round((done / total) * 100) : 0
    }
  }

  function getSprintProgress(sprint: Sprint): ProgressResult {
    return computeProgress(sprint.stories)
  }

  function getEpicProgress(epic: Epic): ProgressResult {
    return computeProgress(epic.stories)
  }

  function getGlobalProgress(stories: Story[]): ProgressResult {
    return computeProgress(stories)
  }

  function getStatusBreakdown(stories: Story[]) {
    return {
      todo: stories.filter(s => s.status === 'todo').length,
      in_progress: stories.filter(s => s.status === 'in_progress').length,
      done: stories.filter(s => s.status === 'done').length,
      blocked: stories.filter(s => s.status === 'blocked').length,
      ready_for_review: stories.filter(s => s.status === 'ready_for_review').length
    }
  }

  return {
    computeProgress,
    getSprintProgress,
    getEpicProgress,
    getGlobalProgress,
    getStatusBreakdown
  }
}
