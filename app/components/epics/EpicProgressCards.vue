<script setup lang="ts">
import type { Epic } from '~~/shared/types/bmad'

defineProps<{
  epics: Epic[]
  selectedEpic?: string
}>()

defineEmits<{
  select: [epicId: string | undefined]
}>()

const { getEpicProgress } = useStoryStatus()
</script>

<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
    <UCard
      v-for="epic in epics"
      :key="epic.id"
      class="cursor-pointer transition-all"
      :class="selectedEpic === epic.id ? 'ring-2 ring-primary' : 'hover:ring-1 hover:ring-border'"
      @click="$emit('select', selectedEpic === epic.id ? undefined : epic.id)"
    >
      <div>
        <p class="font-medium text-sm truncate">
          {{ epic.title }}
        </p>
        <p class="text-xs text-muted mt-1">
          {{ getEpicProgress(epic).done }}/{{ getEpicProgress(epic).total }} stories
        </p>
        <UProgress
          :model-value="getEpicProgress(epic).percentage"
          size="xs"
          class="mt-2"
        />
      </div>
    </UCard>
  </div>
</template>
