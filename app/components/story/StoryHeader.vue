<script setup lang="ts">
import type { Story } from '~~/shared/types/bmad'

defineProps<{
  story: Story
  repoOwner: string
  repoName: string
}>()

const breadcrumbItems = computed(() => [
  { label: 'Epics & Stories', icon: 'i-lucide-kanban', to: `../../epics` }
])
</script>

<template>
  <div class="space-y-3">
    <UBreadcrumb :items="breadcrumbItems" />

    <div class="flex items-start justify-between gap-4">
      <div class="flex items-center gap-3">
        <UBadge
          :label="story.id"
          color="primary"
          variant="subtle"
          size="lg"
        />
        <h1 class="text-2xl font-bold">
          {{ story.title }}
        </h1>
      </div>
      <UButton
        label="Open in GitHub"
        icon="i-simple-icons-github"
        variant="subtle"
        size="sm"
        :to="`https://github.com/${repoOwner}/${repoName}/blob/main/_bmad-output/${story.filePath}`"
        target="_blank"
      />
    </div>

    <StatusBadge :status="story.status" />
  </div>
</template>
