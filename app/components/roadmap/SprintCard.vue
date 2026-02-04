<script setup lang="ts">
import type { Sprint, PullRequestState } from '~~/shared/types/bmad'

const props = defineProps<{
  sprint: Sprint
}>()

const { getSprintProgress, getStatusBreakdown } = useStoryStatus()

const progress = computed(() => getSprintProgress(props.sprint))
const breakdown = computed(() => getStatusBreakdown(props.sprint.stories))

type BadgeColor = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'

function getSprintBadgeColor(status: string): BadgeColor {
  const colors: Record<string, BadgeColor> = {
    completed: 'success',
    active: 'info',
    planned: 'neutral'
  }
  return colors[status] || 'neutral'
}

function getPrBadgeColor(state: PullRequestState): BadgeColor {
  const colors: Record<PullRequestState, BadgeColor> = {
    open: 'success',
    draft: 'neutral',
    merged: 'primary',
    closed: 'error'
  }
  return colors[state]
}

function getPrIcon(state: PullRequestState): string {
  const icons: Record<PullRequestState, string> = {
    open: 'i-lucide-git-pull-request',
    draft: 'i-lucide-git-pull-request-draft',
    merged: 'i-lucide-git-merge',
    closed: 'i-lucide-git-pull-request-closed'
  }
  return icons[state]
}
</script>

<template>
  <UCard>
    <div class="flex items-start justify-between mb-3">
      <div>
        <h3 class="font-semibold">
          Epic {{ sprint.number }}
        </h3>
        <p class="text-sm text-muted">
          {{ sprint.goal }}
        </p>
      </div>
      <div class="flex items-center gap-2">
        <UBadge
          v-if="sprint.pr"
          :label="`#${sprint.pr.number}`"
          :color="getPrBadgeColor(sprint.pr.state)"
          :icon="getPrIcon(sprint.pr.state)"
          variant="subtle"
          :to="sprint.pr.htmlUrl"
          target="_blank"
          as="a"
        />
        <UBadge
          :label="sprint.status"
          :color="getSprintBadgeColor(sprint.status)"
          variant="subtle"
        />
      </div>
    </div>

    <UProgress
      :model-value="progress.percentage"
      class="mb-3"
    />

    <div class="flex items-center gap-3 text-xs text-muted">
      <span>{{ progress.done }}/{{ progress.total }} stories</span>
      <span v-if="breakdown.in_progress">{{ breakdown.in_progress }} in progress</span>
      <span v-if="breakdown.blocked">{{ breakdown.blocked }} blocked</span>
    </div>
  </UCard>
</template>
