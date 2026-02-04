<script setup lang="ts">
import type { Sprint } from '~~/shared/types/bmad'

defineProps<{
  sprints: Sprint[]
}>()

function getDotColor(status: string): string {
  if (status === 'completed') return 'bg-success'
  if (status === 'active') return 'bg-info'
  return 'bg-muted'
}
</script>

<template>
  <div class="relative">
    <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

    <div
      v-for="sprint in sprints"
      :key="sprint.number"
      class="relative pl-10 pb-8 last:pb-0"
    >
      <div
        class="absolute left-2.5 top-2 size-3 rounded-full ring-4 ring-default"
        :class="getDotColor(sprint.status)"
      />
      <SprintCard :sprint="sprint" />
    </div>
  </div>
</template>
