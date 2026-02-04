<script setup lang="ts">
import type { Story, StoryStatus } from '~~/shared/types/bmad'

const props = defineProps<{
  stories: Story[]
}>()

const columns: { title: string, status: StoryStatus }[] = [
  { title: 'To Do', status: 'todo' },
  { title: 'In Progress', status: 'in_progress' },
  { title: 'In Review', status: 'ready_for_review' },
  { title: 'Done', status: 'done' },
  { title: 'Blocked', status: 'blocked' }
]

function storiesForStatus(status: StoryStatus): Story[] {
  return props.stories.filter(s => s.status === status)
}
</script>

<template>
  <div class="flex gap-4 overflow-x-auto pb-4">
    <KanbanColumn
      v-for="col in columns"
      :key="col.status"
      :title="col.title"
      :status="col.status"
      :stories="storiesForStatus(col.status)"
    />
  </div>
</template>
