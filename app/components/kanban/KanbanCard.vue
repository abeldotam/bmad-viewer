<script setup lang="ts">
import type { Story } from '~~/shared/types/bmad'

defineProps<{
  story: Story
}>()

const route = useRoute()
const owner = computed(() => route.params.owner as string)
const repo = computed(() => route.params.repo as string)
</script>

<template>
  <NuxtLink :to="`/repos/${owner}/${repo}/story/${story.id}`">
    <UCard class="hover:ring-1 hover:ring-primary transition-all cursor-pointer">
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <span class="font-mono text-xs text-muted">{{ story.id }}</span>
          <PriorityBadge :priority="story.priority" />
        </div>
        <p class="text-sm font-medium leading-snug">
          {{ story.title }}
        </p>
        <div class="flex items-center justify-between">
          <UBadge
            :label="story.epic"
            color="neutral"
            variant="subtle"
            size="xs"
          />
          <span
            v-if="story.assignee"
            class="text-xs text-muted"
          >{{ story.assignee }}</span>
        </div>
      </div>
    </UCard>
  </NuxtLink>
</template>
