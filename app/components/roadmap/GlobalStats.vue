<script setup lang="ts">
import type { Story, Sprint } from '~~/shared/types/bmad'

const props = defineProps<{
  stories: Story[]
  sprints: Sprint[]
}>()

const { getGlobalProgress, getStatusBreakdown } = useStoryStatus()

const progress = computed(() => getGlobalProgress(props.stories))
const breakdown = computed(() => getStatusBreakdown(props.stories))
const activeSprint = computed(() => props.sprints.find(s => s.status === 'active'))
</script>

<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
    <UCard>
      <div class="text-center">
        <p class="text-3xl font-bold">
          {{ progress.total }}
        </p>
        <p class="text-sm text-muted">
          Total Stories
        </p>
      </div>
    </UCard>

    <UCard>
      <div class="text-center">
        <p class="text-3xl font-bold text-success">
          {{ progress.done }}
        </p>
        <p class="text-sm text-muted">
          Completed
        </p>
      </div>
    </UCard>

    <UCard>
      <div class="text-center">
        <p class="text-3xl font-bold text-primary">
          {{ progress.percentage }}%
        </p>
        <p class="text-sm text-muted">
          Progress
        </p>
      </div>
    </UCard>

    <UCard>
      <div class="text-center">
        <p class="text-3xl font-bold">
          {{ activeSprint?.number || '-' }}
        </p>
        <p class="text-sm text-muted">
          Active Epic
        </p>
      </div>
    </UCard>

    <UCard class="col-span-2 md:col-span-4">
      <div class="flex items-center gap-4 flex-wrap text-sm">
        <span class="text-muted">Breakdown:</span>
        <span>{{ breakdown.todo }} To Do</span>
        <span class="text-info">{{ breakdown.in_progress }} In Progress</span>
        <span class="text-warning">{{ breakdown.ready_for_review }} In Review</span>
        <span class="text-success">{{ breakdown.done }} Done</span>
        <span class="text-error">{{ breakdown.blocked }} Blocked</span>
      </div>
      <UProgress
        :value="progress.percentage"
        class="mt-3"
      />
    </UCard>
  </div>
</template>
