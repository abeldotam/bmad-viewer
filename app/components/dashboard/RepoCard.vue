<script setup lang="ts">
import type { Repository } from '~~/shared/types/bmad'

defineProps<{
  repo: Repository
}>()

defineEmits<{
  delete: [id: string]
}>()
</script>

<template>
  <UCard>
    <div class="flex items-start justify-between">
      <div>
        <NuxtLink
          :to="`/repos/${repo.owner}/${repo.name}`"
          class="font-semibold text-primary hover:underline"
        >
          {{ repo.owner }}/{{ repo.name }}
        </NuxtLink>
        <div class="flex items-center gap-2 mt-1">
          <UBadge
            :label="repo.defaultBranch"
            icon="i-lucide-git-branch"
            variant="subtle"
            color="neutral"
            size="sm"
          />
          <span
            v-if="repo.lastSyncedAt"
            class="text-xs text-muted"
          >
            Last synced: {{ new Date(repo.lastSyncedAt).toLocaleDateString() }}
          </span>
          <span
            v-else
            class="text-xs text-muted"
          >
            Never synced
          </span>
        </div>
      </div>
      <UButton
        icon="i-lucide-trash-2"
        color="error"
        variant="ghost"
        size="xs"
        aria-label="Delete repository"
        @click="$emit('delete', repo.id)"
      />
    </div>
  </UCard>
</template>
