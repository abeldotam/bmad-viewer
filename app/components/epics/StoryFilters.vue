<script setup lang="ts">
import type { Epic } from '~~/shared/types/bmad'

defineProps<{
  epics: Epic[]
}>()

const search = defineModel<string>('search', { default: '' })
const statusFilter = defineModel<string>('statusFilter', { default: '' })
const priorityFilter = defineModel<string>('priorityFilter', { default: '' })

const statusOptions = [
  { label: 'All Statuses', value: '' },
  { label: 'To Do', value: 'todo' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Done', value: 'done' },
  { label: 'Blocked', value: 'blocked' },
  { label: 'Ready for Review', value: 'ready_for_review' }
]

const priorityOptions = [
  { label: 'All Priorities', value: '' },
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' }
]
</script>

<template>
  <div class="flex flex-col md:flex-row gap-3">
    <UInput
      v-model="search"
      icon="i-lucide-search"
      placeholder="Search stories..."
      class="flex-1"
    />
    <USelectMenu
      v-model="statusFilter"
      :items="statusOptions"
      value-key="value"
      class="w-full md:w-48"
    />
    <USelectMenu
      v-model="priorityFilter"
      :items="priorityOptions"
      value-key="value"
      class="w-full md:w-48"
    />
  </div>
</template>
