import type { StoryStatus, Priority } from '~~/shared/types/bmad'

type BadgeColor = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'

export function getStatusColor(status: StoryStatus): BadgeColor {
  const colors: Record<StoryStatus, BadgeColor> = {
    todo: 'neutral',
    in_progress: 'info',
    done: 'success',
    blocked: 'error',
    ready_for_review: 'warning'
  }
  return colors[status]
}

export function getStatusLabel(status: StoryStatus): string {
  const labels: Record<StoryStatus, string> = {
    todo: 'To Do',
    in_progress: 'In Progress',
    done: 'Done',
    blocked: 'Blocked',
    ready_for_review: 'Ready for Review'
  }
  return labels[status]
}

export function getPriorityIcon(priority: Priority): string {
  const icons: Record<Priority, string> = {
    high: 'i-lucide-chevrons-up',
    medium: 'i-lucide-minus',
    low: 'i-lucide-chevrons-down'
  }
  return icons[priority]
}

export function getPriorityColor(priority: Priority): BadgeColor {
  const colors: Record<Priority, BadgeColor> = {
    high: 'error',
    medium: 'warning',
    low: 'neutral'
  }
  return colors[priority]
}
