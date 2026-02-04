<script setup lang="ts">
import type { Story, Epic } from '~~/shared/types/bmad'

defineProps<{
  story: Story
  epic?: Epic
}>()
</script>

<template>
  <UCard>
    <div class="space-y-4">
      <h3 class="font-semibold text-sm">
        Details
      </h3>

      <div class="space-y-3 text-sm">
        <div class="flex items-center justify-between">
          <span class="text-muted">Status</span>
          <StatusBadge :status="story.status" />
        </div>

        <div class="flex items-center justify-between">
          <span class="text-muted">Priority</span>
          <PriorityBadge :priority="story.priority" />
        </div>

        <div class="flex items-center justify-between">
          <span class="text-muted">Epic</span>
          <span class="font-medium">{{ epic?.title || story.epic }}</span>
        </div>

        <div class="flex items-center justify-between">
          <span class="text-muted">Estimate</span>
          <span>{{ story.estimate }} points</span>
        </div>

        <div
          v-if="story.assignee"
          class="flex items-center justify-between"
        >
          <span class="text-muted">Assignee</span>
          <div class="flex items-center gap-2">
            <UAvatar
              :alt="story.assignee"
              size="xs"
            />
            <span>{{ story.assignee }}</span>
          </div>
        </div>
      </div>
    </div>
  </UCard>
</template>
