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
        <p
          v-if="repo.lastSyncedAt"
          class="text-xs text-muted mt-1"
        >
          Last synced: {{ new Date(repo.lastSyncedAt).toLocaleDateString() }}
        </p>
        <p
          v-else
          class="text-xs text-muted mt-1"
        >
          Never synced
        </p>
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
