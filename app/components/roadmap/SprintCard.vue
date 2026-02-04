<script setup lang="ts">
import type { Sprint } from '~~/shared/types/bmad'

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
</script>

<template>
  <UCard>
    <div class="flex items-start justify-between mb-3">
      <div>
        <h3 class="font-semibold">
          Sprint {{ sprint.number }}
        </h3>
        <p class="text-sm text-muted">
          {{ sprint.goal }}
        </p>
      </div>
      <UBadge
        :label="sprint.status"
        :color="getSprintBadgeColor(sprint.status)"
        variant="subtle"
      />
    </div>

    <UProgress
      :value="progress.percentage"
      class="mb-3"
    />

    <div class="flex items-center gap-3 text-xs text-muted">
      <span>{{ progress.done }}/{{ progress.total }} stories</span>
      <span v-if="breakdown.in_progress">{{ breakdown.in_progress }} in progress</span>
      <span v-if="breakdown.blocked">{{ breakdown.blocked }} blocked</span>
    </div>
  </UCard>
</template>
