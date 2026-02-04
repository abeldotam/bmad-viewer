<script setup lang="ts">
import type { Story, StoryStatus } from '~~/shared/types/bmad'

defineProps<{
  title: string
  stories: Story[]
  status: StoryStatus
}>()
</script>

<template>
  <div class="flex flex-col min-w-[280px] w-full">
    <div class="flex items-center justify-between mb-3 px-1">
      <div class="flex items-center gap-2">
        <StatusBadge :status="status" />
        <span class="text-sm text-muted">({{ stories.length }})</span>
      </div>
    </div>

    <div class="space-y-3 flex-1 overflow-y-auto max-h-[calc(100vh-400px)] p-1">
      <KanbanCard
        v-for="story in stories"
        :key="story.id"
        :story="story"
      />
      <div
        v-if="stories.length === 0"
        class="text-center py-8 text-sm text-muted"
      >
        No stories
      </div>
    </div>
  </div>
</template>
